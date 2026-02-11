import writeXlsxFile from 'write-excel-file'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { fetch } from '@tauri-apps/plugin-http';
import { save } from '@tauri-apps/plugin-dialog';
import { writeFile } from '@tauri-apps/plugin-fs';


/**
 * Helper to extract phone numbers using regex
 * Matches formats like: +81 70-1274-0809, (555) 123-4567, etc.
 */
function extractPhone(text) {
    // 1. We still use a basic regex to find potential number strings in the text
    const rawMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/);
    if (!rawMatch) return '';

    // 2. Use the library to validate and format it properly
    const phoneNumber = parsePhoneNumberFromString(rawMatch[0]);

    if (phoneNumber && phoneNumber.isValid()) {
        // Returns standardized E.164 format (e.g., +817012740809)
        return phoneNumber.number;
    }

    return '';
}

async function make_excel(data, query) {
    // console.log(data,query);
    const schema = [
        {
            column: 'Name',
            type: String, // Good practice to be explicit
            value: (row) => row.title,
            width: 30
        },
        {
            column: 'Category',
            type: String,
            value: (row) => row.category,
            width: 20
        },
        {
            column: 'No. Of Reviews',
            type: Number,
            value: (row) => row.reviews,
            width: 15
        },
        {
            column: 'Stars',
            type: Number,
            value: (row) => row.stars,
            width: 10
        },
        {
            column: 'Phone Number',
            type: String,
            value: (row) => row.completePhoneNumber,
            width: 20
        },
        {
            column: 'Address',
            type: String,
            value: (row) => row.address,
            wrap: true,
            width: 60
        },
        {
            column: 'Place Website',
            type: String, // Just use String here
            value: (row) => row.url || "",
            width: 50
        },
        {
            column: 'Gmap URL',
            value: (row) => `HYPERLINK("http://google.com/search?q=${encodeURIComponent(row.title + ' ' + row.address)}", "View Map")`,
            type: 'Formula',
            width: 25
        }
    ];

    // Clone data to remove Vue proxies which might confuse the library
    const plainData = JSON.parse(JSON.stringify(data));

    try {
        // Get Blob from write-excel-file (without fileName, it returns blob)
        const blob = await writeXlsxFile(plainData, {
            schema
        });

        // Use Tauri dialog to get save path
        const filePath = await save({
            defaultPath: `${query || 'places_data'}.xlsx`,
            filters: [{
                name: 'Excel Workbook',
                extensions: ['xlsx']
            }]
        });

        if (filePath) {
            // Convert Blob to Uint8Array for writing
            const arrayBuffer = await blob.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            // Write file using Tauri fs plugin
            await writeFile(filePath, uint8Array);
            console.log(`Successfully saved to ${filePath}`);
            alert(`File saved successfully to ${filePath}`);
        } else {
            console.log('Save cancelled by user');
        }
    } catch (error) {
        console.error('Error saving Excel file:', error);
        const errorMsg = error instanceof Error ? error.message : JSON.stringify(error);
        alert(`Error saving file: ${errorMsg}`);
    }

}

async function fetchit(url) {

    const headers = {
        "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
        Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
    };

    try {
        const response = await fetch(url, {
            headers,
            redirect: "follow",
            signal: AbortSignal.timeout(20_000),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const htmlText = await response.text();

        const parser = new DOMParser();

        // htmlText is the raw HTML string
        console.info(htmlText);
        const doc = parser.parseFromString(htmlText, 'text/html');

        // Define the scraping logic
        // We target '.VkpGBb' which is the standard wrapper for Google Local Pack cards.
        const items = doc.querySelector("#search")?.querySelectorAll('.VkpGBb');
        if (!items) throw new Error("No items variable found");
        const scrapedData = [];

        items.forEach((item) => {
            const row = {};

            // --- A. Title ---
            // Reliable: Uses accessibility role
            const titleEl = item.querySelector('[role="heading"]');
            row.title = titleEl ? titleEl.textContent.trim().replace(/\r?\n/g, ' ').split(" ").filter(str => /\S/.test(str)).join(" ") : 'N/A';

            // --- B. Wrapper for Text Details ---
            // Google groups text details in a container with class 'rllt__details'
            const detailsDiv = item.querySelector('.rllt__details');

            // Default values
            row.stars = 0;
            row.reviews = 0;
            row.category = '';
            row.address = '';
            row.completePhoneNumber = '';

            if (detailsDiv) {
                // Get all direct text-containing divs to iterate safely
                const lines = Array.from(detailsDiv.querySelectorAll('div'));

                lines.forEach(line => {
                    const text = line.textContent.trim();

                    // 1. Logic for Rating/Category Line
                    // Usually contains the star rating numerical value or specific star icon classes
                    if (line.querySelector('[role="img"]') || text.match(/^\d\.\d/)) {

                        // Extract Stars
                        // Look for the span that holds the specific number (e.g., "5.0")
                        const starSpan = line.querySelector('.yi40Hd') || line.querySelector('[aria-hidden="true"]');
                        if (starSpan) {
                            const val = parseFloat(starSpan.textContent);
                            if (!isNaN(val)) row.stars = val;
                        }

                        // Extract Reviews
                        // Reliable: Look for aria-label containing "reviews" or pattern (23)
                        const reviewSpan = line.querySelector('[aria-label*="reviews"]');
                        if (reviewSpan) {
                            // Remove parens and non-digits
                            const count = parseInt(reviewSpan.textContent.replace(/\D/g, ''));
                            row.reviews = isNaN(count) ? 0 : count;
                        }

                        // Extract Category
                        // Usually separated by a middle dot '·' after the rating block
                        // Example: "5.0 ***** (23) · Gym"
                        if (text.includes('·')) {
                            const parts = text.split('·');
                            // The category is usually the last item in this specific line
                            row.category = parts[parts.length - 1].trim();
                        }
                    }

                    // 2. Logic for Metadata Line (Address/Phone) - IMPROVED
                    else if (text.length > 0) {
                        // Split the line by the middle dot
                        const segments = text.split('·').map(s => s.trim());

                        // Google usually puts the phone number in the LAST segment
                        const lastSegment = segments[segments.length - 1];
                        const phone = extractPhone(lastSegment.trim().replace(/\r?\n/g, ' ').split(" ").filter(str => /\S/.test(str)).join(" ")); // Clean up the segment before extracting phone

                        if (phone) {
                            row.completePhoneNumber = phone;
                            // If the last segment was the phone, the segment before it is likely the address
                            if (segments.length > 1) {
                                // Filter out segments that are definitely not addresses
                                const addressCandidate = segments[segments.length - 2];
                                if (!addressCandidate.includes('years in business') && !addressCandidate.includes('Open')) {
                                    row.address = addressCandidate.replace(/\s+/g, ' ').trim();
                                }
                            }
                        } else {
                            // Fallback: If no phone found in the last segment, check if the whole line is an address
                            if (!text.includes('Opens') && !text.includes('Closed') && text.includes(',') && !row.address) {
                                row.address = text.replace(/\s+/g, ' ').trim();
                            }
                        }
                    }
                });
            }

            // --- C. Website URL ---
            // The "Website" button is an anchor tag usually adjacent to the details or directions
            // We look for any anchor inside the card that visually says "Website"
            const allLinks = Array.from(item.querySelectorAll('a'));
            const websiteLink = allLinks.find(link => link.textContent.includes('Website'));

            // We get the raw href. Note: Google hrefs are often redirects (/url?q=...), 
            // strictly speaking, we might want to clean this, but for this schema we take the href.
            row.url = websiteLink ? websiteLink.href : '';

            scrapedData.push(row);
        });
        return scrapedData;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}


const full_list = [];
let tasks = [];
const controller = new AbortController();
const signal = controller.signal;
let query;

async function search(q) {
    full_list.length = 0; // Clear previous results
    query = q;

    // console.log(endpagination,"outer loop");
    let pagination = 0;
    while (true) {
        const url = new URL("https://www.google.com/search");
        url.search = new URLSearchParams({
            q: query,
            start: pagination,
            udm: "1",
        }).toString();
        console.log(`Fetching: ${url}`);
        // const flaskUrl = `https://getcorsproxy.pythonanywhere.com/fetch?url=${url.toString()}`;
        // console.log(endpagination,"in loop");
        const result = await fetchit(url.toString());
        if (result?.length > 0) {
            pagination += 10;
            full_list.push(...result);
        } else {
            break;
        }



    }


    // Await all tasks to complete
    await Promise.all(tasks);

    // console.log("Search complete:", full_list);
    return [...new Set(full_list)];
}

export { search, make_excel };
// Usage
// search("gift shop in vandavasi ").then((data) => {
//     console.log("Final full_list:", data.length,JSON.stringify(data));
//     make_excel(data,query);
// });
