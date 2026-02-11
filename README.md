# Globex Places Data

A Vue.js application for searching and extracting Google Maps Places data with Excel export functionality.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Component Architecture](#component-architecture)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

Globex Places Data is a web application that allows users to search for businesses and places on Google Maps and export the results to Excel format. The application provides an intuitive interface for querying locations and retrieving detailed information including names, categories, reviews, ratings, contact details, and addresses.

## ✨ Features

- **🔍 Smart Search**: Search for any type of business or place with location
- **📊 Excel Export**: Download search results in organized Excel format
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **⚡ Fast Performance**: Parallel data fetching for optimal speed
- **🎨 Modern UI**: Clean, Bootstrap-based interface with smooth animations
- **♿ Accessible**: ARIA labels and semantic HTML for better accessibility
- **🔍 Robust Scraping**: Improved DOM-based data extraction with phone number validation

## 🔧 Scraping Technology

### Search URL Format

The application uses Google Search with the following URL structure:

```javascript
const url = new URL("https://www.google.com/search");
url.search = new URLSearchParams({
    q: query,          // Search query (e.g., "restaurants in Chennai")
    start: pagination, // Pagination offset (0, 10, 20, etc.)
    udm: "1",          // Universal Data Mode for structured results
})
```

### Advanced DOM Parsing

The scraping logic has been significantly improved to use robust DOM parsing instead of unsafe `eval()` operations:

**Key Improvements**:

1. **Structured Element Extraction**: Targets specific CSS classes and ARIA roles for reliable data extraction
   - Title: `[role="heading"]`
   - Details container: `.rllt__details`
   - Rating elements: `.yi40Hd`, `[role="img"]`
   - Review counts: `[aria-label*="reviews"]`

2. **Phone Number Validation**: Uses `libphonenumber-js` library for international phone number validation
   ```javascript
   import { parsePhoneNumberFromString } from 'libphonenumber-js';
   
   // Validates and formats phone numbers to E.164 standard
   // Example: +817012740809
   ```

3. **Intelligent Address Parsing**: Segments text by middle dots (·) to separate address from phone numbers

4. **Fallback Mechanisms**: Multiple extraction strategies for each data field to handle varying HTML structures

**Data Extraction Process**:
```javascript
// 1. Parse HTML using DOMParser (browser-native)
const parser = new DOMParser();
const doc = parser.parseFromString(html, 'text/html');

// 2. Find all place cards
const items = doc.querySelector("#search").querySelectorAll('.VkpGBb');

// 3. Extract structured data from each card
// - Title (heading role)
// - Stars/Reviews (aria labels)
// - Category (text parsing)
// - Address (segment parsing)
// - Phone (validated with libphonenumber-js)
// - Website URL (anchor tags)
```

### Dependencies for Scraping

- **libphonenumber-js**: Phone number validation and formatting
- **DOMParser**: Native browser API for HTML parsing (no external library needed)

## 📁 Project Structure

```
places-data/
├── src/
│   ├── components/
│   │   ├── NavigationBar.vue      # Application header/navbar
│   │   ├── SearchBar.vue          # Search input component
│   │   ├── ActionButtons.vue      # Search/Download controls
│   │   ├── FooterSocial.vue       # Footer with social links
│   │   └── UnderMaintance.vue     # Maintenance modal
│   ├── assets/                    # Static assets (CSS, images)
│   ├── App.vue                    # Root application component
│   ├── main.js                    # Application entry point
│   └── gmap_data.js               # Google Maps data fetching logic
├── public/                        # Public static files
├── test/                          # Test files
├── index.html                     # HTML entry point
├── package.json                   # Dependencies and scripts
├── vite.config.js                 # Vite configuration
└── README.md                      # This file
```

## 🏗️ Component Architecture

### Component Hierarchy

```
App.vue (Root)
├── NavigationBar.vue
├── SearchBar.vue
│   └── ActionButtons.vue (via slot)
├── FooterSocial.vue
└── UnderMaintenance.vue (conditional)
```

### Component Documentation

#### **App.vue** - Main Application Component

**Purpose**: Orchestrates the entire application, managing state and coordinating between components.

**Key Responsibilities**:
- Search state management
- API interaction coordination
- UI state transitions (Search → Download)
- Modal control for maintenance notifications

**Data Properties**:
```javascript
{
  input: String,           // User's search query
  action: String,          // Current action ('Search' | 'Download')
  btncolor: String,        // Button color class
  shaking: String,         // Shake animation class
  spin: Boolean,           // Loading state
  showMaintenance: Boolean,// Maintenance modal visibility
  row_datas: Array         // Search results
}
```

**Methods**:
- `act(query)`: Main action handler for search/download
- `closeMaintenance()`: Closes maintenance modal
- `log(ob)`: Development logging utility

---

#### **NavigationBar.vue** - Application Header

**Purpose**: Displays the application branding and navigation.

**Features**:
- Bootstrap dark-themed navbar
- Google Maps icon branding
- Responsive across all breakpoints
- Links to GitHub repository

**Props**: None

**Events**: None

---

#### **SearchBar.vue** - Search Input Interface

**Purpose**: Provides the main search input field with validation feedback.

**Features**:
- v-model support for two-way binding
- Enter key support for quick search
- Shake animation on empty input validation
- Bootstrap tooltip with usage examples
- Slot for action buttons (desktop view)

**Props**:
```javascript
{
  modelValue: String,    // The current search input (v-model)
  isShaking: Boolean     // Controls shake animation
}
```

**Events**:
```javascript
{
  'update:modelValue': String,  // Emitted on input change
  'search': void                // Emitted on Enter key or search trigger
}
```

**Slots**:
- `actions-desktop`: Slot for injecting action buttons (desktop layout)

---

#### **ActionButtons.vue** - Action Controls

**Purpose**: Provides responsive action buttons for search and advanced options.

**Features**:
- Dual layouts (desktop/mobile)
- Dynamic button states
- Loading spinner animation
- Advanced options dropdown (coming soon)

**Props**:
```javascript
{
  action: String,        // Button text ('Search' | 'Download' | '')
  btnColor: String,      // Bootstrap color class
  isLoading: Boolean,    // Loading spinner visibility
  isDisabled: Boolean    // Button disabled state
}
```

**Events**:
```javascript
{
  'action-click': void   // Emitted when action button clicked
}
```

**Responsive Behavior**:
- Desktop (>768px): Inline button group
- Mobile (<768px): Stacked button group below search bar

---

#### **FooterSocial.vue** - Social Links Footer

**Purpose**: Displays social media links in a styled footer.

**Features**:
- Links to GitHub, LinkedIn, Instagram
- Bootstrap icons
- Hover effects
- Sticky positioning

**Props**: None

**Events**: None

---

#### **UnderMaintenance.vue** - Maintenance Modal

**Purpose**: Notifies users when features are under maintenance.

**Features**:
- Modal overlay
- Informative message
- Close functionality

**Props**: None (existing component)

**Events**:
```javascript
{
  'close': void  // Emitted when modal is closed
}
```

---

## 🚀 Setup & Installation

### Prerequisites

- **Node.js**: v16.x or higher
- **npm** or **pnpm**: Package manager

### Installation Steps

1. **Clone the repository**:
```bash
git clone https://github.com/devsanthoshmk/places-data.git
cd places-data
```

2. **Install dependencies**:
```bash
npm install
# or
pnpm install
```

3. **Run development server**:
```bash
npm run dev
# or
pnpm dev
```

4. **Build for production**:
```bash
npm run build
# or
pnpm build
```

5. **Preview production build**:
```bash
npm run preview
# or
pnpm preview
```

## 💡 Usage

### Basic Search

1. Enter a query in the format: `[place type] in [location]`
   - Example: `restaurants in Chennai`
   - Example: `hospitals in Bangalore`

2. Press **Enter** or click the **Search** button

3. Wait for results to load (spinner animation indicates progress)

4. Click **Download** to export results to Excel

### Query Format Guidelines

**Recommended Format**:
```
[business/place type] in [city/area]
```

**Examples**:
- ✅ `coffee shops in Mumbai`
- ✅ `dental clinics in Delhi`
- ✅ `pharmacies in Pune`
- ❌ `restaurants` (missing location)
- ❌ `Chennai` (missing place type)

## 📚 API Documentation

### gmap_data.js

Core module for Google Maps data fetching and Excel export.

#### **search(query)**

Searches Google Maps for places matching the query.

**Parameters**:
- `query` (String): Search query in format "[type] in [location]"

**Returns**:
- `Promise<Array>`: Array of place objects

**Place Object Structure**:
```javascript
{
  id: String,                 // Unique place identifier
  title: String,              // Business/place name
  category: String,           // Business category
  address: String,            // Full address
  phoneNumber: String,        // Local phone number
  completePhoneNumber: String,// International format phone
  domain: String,             // Website domain
  url: String,                // Website URL
  coor: String,               // GPS coordinates (lat,lng)
  stars: String,              // Rating (0-5)
  reviews: String             // Number of reviews
}
```

**Example Usage**:
```javascript
import { search } from './gmap_data.js';

const results = await search('restaurants in Chennai');
console.log(results); // Array of restaurant objects
```

---

#### **make_excel(data, query)**

Exports search results to Excel file.

**Parameters**:
- `data` (Array): Array of place objects from search()
- `query` (String): Original search query (used for filename)

**Returns**: void (triggers file download)

**Excel Schema**:
| Column | Source | Width |
|--------|--------|-------|
| Name | `title` | 30 |
| Category | `category` | 20 |
| No. Of Reviews | `reviews` | 15 |
| Stars | `stars` | 10 |
| Phone Number | `completePhoneNumber` | 20 |
| Address | `address` | 60 |
| Place Website | `url` (hyperlink) | 50 |
| Gmap URL | Generated link | 25 |

**Example Usage**:
```javascript
import { search, make_excel } from './gmap_data.js';

const results = await search('coffee shops in Mumbai');
make_excel(results, 'coffee shops in Mumbai');
// Downloads: "coffee shops in Mumbai.xlsx"
```

---

### Component Props & Events

See [Component Documentation](#component-documentation) section above for detailed props and events for each component.

## 🛠️ Development

### Code Standards

**1. Component Structure**:
- Use Vue 3 Composition API or Options API consistently
- Keep components focused on single responsibility
- Document all props, events, and methods with JSDoc

**2. Naming Conventions**:
- Components: PascalCase (e.g., `NavigationBar.vue`)
- Props/Events: camelCase (e.g., `isLoading`, `action-click`)
- Files: kebab-case for utilities (e.g., `gmap-data.js`)

**3. Documentation Standards**:
- All components must have header documentation
- Document all props with types and defaults
- Document all emitted events
- Include usage examples

**4. Accessibility**:
- Use semantic HTML elements
- Include ARIA labels and roles
- Ensure keyboard navigation works
- Maintain sufficient color contrast

### Adding New Components

1. Create component file in `src/components/`
2. Add comprehensive header documentation
3. Document all props, events, and slots
4. Include JSDoc for methods
5. Add usage examples in comments
6. Register in parent component
7. Update README.md

**Template**:
```vue
<!--
  ComponentName.vue
  
  Purpose: Brief description
  
  Features:
  - Feature 1
  - Feature 2
  
  Props:
  - propName (Type): Description
  
  Events:
  - event-name: Description
  
  Usage:
  <ComponentName :prop="value" @event="handler" />
  
  Author: devsanthoshmk
  Last Updated: YYYY-MM-DD
-->

<template>
  <!-- Component markup -->
</template>

<script>
/**
 * ComponentName
 * 
 * @component
 * @description Detailed description
 */
export default {
  name: 'ComponentName',
  // ... component options
};
</script>

<style scoped>
/* Component styles */
</style>
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test src/components/SearchBar.spec.js
```

## 🔧 Technologies

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **Bootstrap 5.3.3** - UI component framework
- **Vite 6.0.5** - Build tool and dev server

### Libraries
- **write-excel-file** (v2.0.10) - Excel export functionality
- **libphonenumber-js** - Phone number validation and formatting
- **vuedraggable** (v4.1.0) - Drag & drop (if needed)

### Development Tools
- **@vitejs/plugin-vue** (v5.2.1) - Vue 3 Vite plugin
- **ESLint** (recommended) - Code linting
- **Prettier** (recommended) - Code formatting

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Add/update documentation for all changes
- Include tests for new features
- Ensure all tests pass before submitting PR
- Keep commits atomic and well-described

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Santhosh M K** ([@devsanthoshmk](https://github.com/devsanthoshmk))

- GitHub: [@devsanthoshmk](https://github.com/devsanthoshmk)
- LinkedIn: [M K Santhosh](https://www.linkedin.com/in/m-k-santhosh-689287258/)
- Instagram: [@mksantho.sh](https://www.instagram.com/mksantho.sh/)

## 🙏 Acknowledgments

- Google Maps for place data
- Bootstrap for UI components
- Vue.js community for excellent documentation
- All contributors who help improve this project

---

**Made with ❤️ by [@devsanthoshmk](https://github.com/devsanthoshmk)**
