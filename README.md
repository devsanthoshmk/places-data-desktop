# Places data desktop: Google Maps business data viewer and local lead database desktop

A desktop application to extract Google Maps business listings and save local lead records directly to Excel spreadsheets.

Globex Places Data is a desktop tool for querying Google Maps place listings without an API key. It operates as a Google Maps business data viewer, an Electron places data desktop app, a Vue Electron app, and a local lead database desktop extractor. The application queries Google Search place cards, normalizes contact numbers to E.164 international format, and exports business profiles into formatted `.xlsx` workbooks.

## Architecture

The project pairs a Tauri v2 Rust backend with a Vue 3 and Vite frontend.

- Frontend: Vue 3 with Composition API and Bootstrap 5 for UI components. It uses `@tauri-apps/plugin-http` to bypass browser CORS restrictions when requesting Google Search results.
- Data extraction (`src/gmap_data.js`): Uses the browser `DOMParser` to parse Google Search Local Pack cards (`#search .VkpGBb`). The scraper paginates in increments of 10 items per batch until all available results return. Extracted attributes include business name, rating, review count, address, category, website URL, formatted phone number, and a generated Google Maps query link.
- Phone number validation: Uses `libphonenumber-js` to parse, validate, and format extracted contact numbers into standard E.164 strings.
- Spreadsheet export: Uses `write-excel-file` to generate binary `.xlsx` files in memory with typed columns and formula links, then writes the file to disk using `@tauri-apps/plugin-dialog` and `@tauri-apps/plugin-fs`.
- Backend shell: Rust with Tauri v2 (`app_lib`) exposes native dialog, filesystem, shell, and HTTP plugins under capability scopes defined in `src-tauri/capabilities/default.json`.

## Setup

### Prerequisites

Install the following tools:

- Node.js (v18 or later)
- pnpm package manager
- Rust toolchain (edition 2021, rustc 1.77.2 or later)
- Platform dependencies for Tauri on Linux:
  ```bash
  sudo apt install build-essential libwebkit2gtk-4.1-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
  ```

### Installation

Clone the repository and install frontend dependencies:

```bash
git clone https://github.com/devsanthoshmk/places-data-desktop.git
cd places-data-desktop
pnpm install
```

### Development

Start the Vite development server with Tauri desktop window:

```bash
pnpm tauri:dev
```

### Production build

Build the standalone desktop executable for the host platform:

```bash
pnpm tauri:build
```

To cross-compile for Windows (x86_64-pc-windows-gnu) from a compatible host:

```bash
pnpm tauri:build:windows
```

The output binary compiles to `src-tauri/target/release/`.

## Usage

1. Launch the application.
2. Enter a search query into the search box, for example `restaurants in Chennai` or `hospitals in Bangalore`.
3. Press Enter or click Search.
4. The application queries Google Search, fetches place cards in 10-result batches, and parses the metadata into memory.
5. Once the search finishes, the button switches to Download.
6. Click Download to choose a target location and save the extracted leads to an Excel (`.xlsx`) spreadsheet.

Each exported row contains:

- Business name
- Rating
- Total review count
- Category
- Street and area address
- Formatted phone number (E.164)
- Website URL
- Google Maps view link

## Configuration

The application configures runtime capabilities, dev server ports, and build targets in two files:

- `vite.config.js`:
  * Dev server runs on port 5173 (`strictPort: true`).
  * Path alias `@` maps to `./src`.
  * Compile targets: `chrome105` on Windows, `safari13` on other platforms.
- `src-tauri/tauri.conf.json`:
  * Product name: `GlobexData`
  * Bundle identifier: `com.globexdata.app`
  * Default window dimensions: 1200x800 (minimum 800x600).
  * Capability permissions: HTTP requests restricted to `https://www.google.com/search?*`, file writes scoped to `$HOME`, `$DOWNLOADS`, `$DOCUMENTS`, and `$DESKTOP`.
