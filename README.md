# Globex Places Data (formerly GMAP VIGILANTE)

## Description
**Globex Places Data** is a powerful desktop application designed to provide comprehensive Google Maps location data in an instant. Recently migrated to a modern **Tauri (Vue 3 + Vite)** architecture, this tool extracts detailed information from Google Maps and reliably compiles it into an Excel file. Designed for fast and efficient data retrieval, it allows users to obtain structured insights into businesses or locations at various levels, such as state, district, or local areas. Whether you're conducting market research or need specific location details, Globex Places Data delivers the data you need quickly from your desktop.

## Features
- **Location Data in Excel**: Extracts detailed location information and compiles it into an easy-to-use Excel file.
- **Fast and Efficient**: Retrieves data in a matter of seconds, ensuring quick access to comprehensive information.
- **Versatile Search**: Obtain information at state, district, or local levels, tailored to your specific needs.
- **Detailed Business Information**: Get complete details including name, type, review count, rating, phone number, and address.
- **Desktop Experience**: A responsive, standalone desktop application built with Tauri, Vue 3, and Bootstrap 5.

## Installation Instructions

### Pre-requisites
Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/en/) & [pnpm](https://pnpm.io/)
- [Rust](https://www.rust-lang.org/tools/install)
- Platform-specific build tools for Tauri (e.g., `build-essential`, `libwebkit2gtk-4.1-dev` on Linux). Refer to [Tauri Prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites) for more details.

### Setup and Development
Clone the repository and install the Node dependencies:

```bash
pnpm install
```

To run the application in development mode:
```bash
pnpm tauri dev
```

To build a production bundle for your current platform:
```bash
pnpm tauri build
```

## Usage
Simply launch the application, enter a specific query (e.g., "gift shop in Chennai"), and click **Search**. The tool will fetch a list of businesses matching your query. Once the search completes, click **Download** to save the detailed information—including names, types, review counts, ratings, phone numbers, and addresses—as an Excel file on your machine.
