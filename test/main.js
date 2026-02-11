#!/usr/bin/env node

import fs from "node:fs";
import { TextDecoder } from "node:util";
import { main } from "./scrape.js";
import writeXlsxFile from 'write-excel-file/node';


// ---- target request ----

const q = "gym in tokyo";

const url = new URL("https://www.google.com/search");
url.search = new URLSearchParams({
  q: q,
  start: "100",
  udm: "1",
}).toString();

const headers = {
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
  "Accept-Encoding": "gzip, deflate, br",
};

// ---- fetch ----
const res = await fetch(url, {
  headers,
  redirect: "follow",
  signal: AbortSignal.timeout(20_000),
});

if (!res.ok) {
  throw new Error(`HTTP ${res.status}`);
}

// ---- read already-decoded body ----
const buffer = Buffer.from(await res.arrayBuffer());

// ---- charset detection ----
const contentType = res.headers.get("content-type") || "";
const match = contentType.match(/charset=([^\s;]+)/i);
const charset = match ? match[1] : "utf-8";

// ---- decode ----
let html;
try {
  html = new TextDecoder(charset).decode(buffer);
} catch {
  html = new TextDecoder("utf-8").decode(buffer);
}

// ---- save ----
fs.writeFileSync(q+".html", html, "utf8");
console.log(`Saved ${html.length} characters to ${q}.html`);

// ---- scrape ----
(async () => {
  try {
    const scrapedData = main(html);
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
        await writeXlsxFile(scrapedData, {
            schema,
            filePath: `./${q}.xlsx`
        });
        console.log(`Successfully created ${q}.xlsx`);
        console.log(`Scraped ${scrapedData.length} items`);
    } catch (error) {
        console.error('Error writing file:', error);
    }
})();
