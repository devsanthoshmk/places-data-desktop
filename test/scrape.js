import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';
// import writeXlsxFile from 'write-excel-file/node';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

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

export function main(htmlContent,SKIP_MISSING_PHONE = false) {
    // 1. Load your HTML content (assuming it's in a file named 'input.html')
    // In production, you might fetch this via axios/puppeteer
    // const htmlContent = readFileSync('input.html', 'utf8');

    const dom = new JSDOM(htmlContent, {
        // This prevents JSDOM from trying to "execute" or parse 
        // parts of the page that aren't necessary for data scraping.
        runScripts: "outside-only", 
        resources: "usable" 
    });
    const document = dom.window.document;

    // 2. Define the scraping logic
    // We target '.VkpGBb' which is the standard wrapper for Google Local Pack cards.
    const items = document.querySelector("#search").querySelectorAll('.VkpGBb');
    const scrapedData = [];

    items.forEach((item) => {
        const row = {};

        // --- A. Title ---
        // Reliable: Uses accessibility role
        const titleEl = item.querySelector('[role="heading"]');
        row.title = titleEl ? titleEl.textContent.trim().replace(/\r?\n/g, ' ').split(" ").filter(str => /\S/.test(str)).join(" ") : 'N/A';
        // console.log(row.title); // Debug: Check if title is extracted correctly

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
                
                // 2. Logic for Metadata Line (Address/Phone)
                // If it's not the rating line, checks for metadata
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
                                if ('+81357385420' === phone) {
                                    console.log('Debug:',text,"\n",row.address);
                                }
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
        // --- THE SKIP LOGIC ---
        if (SKIP_MISSING_PHONE && !row.completePhoneNumber) {
            // Skip this item and move to the next one in the loop
            return;
        }
        // console.log('Extracted Row:', row); // Debug: Check the extracted data for each card
        if ('+81357385420' === row.completePhoneNumber) {
                                    console.log('Debug3:',{row});
                                }
        scrapedData.push(row);
    });
    return scrapedData;
}
// 3. Define Schema for Excel
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
// 4. Write File
// (async () => {
//     try {
//         const scrapedData = main(true); // Pass true to skip entries without phone numbers
//         await writeXlsxFile(scrapedData, {
//             schema,
//             filePath: './google_places_results.xlsx'
//         });
//         console.log('Successfully created ${}.xlsx');
//     } catch (error) {
//         console.error('Error writing file:', error);
//     }
// })();