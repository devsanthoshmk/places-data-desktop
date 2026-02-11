/**
 * Component Usage Examples
 * 
 * This file demonstrates how to use each component in the application.
 * These examples can be used as reference when building new features.
 * 
 * Author: devsanthoshmk
 * Last Updated: 2026-02-12
 */

// =============================================================================
// NavigationBar Component
// =============================================================================

/**
 * Basic Usage
 * 
 * The NavigationBar is a stateless component requiring no props.
 * Simply import and use in template.
 */

// In script:
import NavigationBar from './components/NavigationBar.vue';

// In template:
`<NavigationBar />`

// =============================================================================
// SearchBar Component
// =============================================================================

/**
 * v-model Usage
 * 
 * SearchBar supports v-model for two-way binding with the search input.
 */

// In script:
import { ref } from 'vue';
import SearchBar from './components/SearchBar.vue';

const searchQuery = ref('');

// In template:
`<SearchBar v-model="searchQuery" />`

/**
 * With Events
 * 
 * Listen to the @search event for when user presses Enter or submits.
 */

// In script:
const handleSearch = () => {
    console.log('Searching for:', searchQuery.value);
};

// In template:
`<SearchBar 
  v-model="searchQuery" 
  @search="handleSearch" 
/>`

/**
 * With Validation Feedback
 * 
 * Use the isShaking prop to show validation errors.
 */

// In script:
const showError = ref(false);

const validateAndSearch = () => {
    if (!searchQuery.value.trim()) {
        showError.value = true;
        setTimeout(() => showError.value = false, 500);
        return;
    }
    // Perform search...
};

// In template:
`<SearchBar 
  v-model="searchQuery" 
  :is-shaking="showError"
  @search="validateAndSearch" 
/>`

    /**
     * With Action Buttons Slot (Desktop)
     * 
     * Inject ActionButtons into the search bar for desktop layout.
     */

    // In template:
    `<SearchBar v-model="query" @search="search">
  <template #actions-desktop>
    <ActionButtons 
      action="Search" 
      btn-color="btn-success"
      @action-click="search" 
    />
  </template>
</SearchBar>`

// =============================================================================
// ActionButtons Component
// =============================================================================

/**
 * Basic Usage
 * 
 * ActionButtons requires several props to control its state.
 */

// In script:
import { ref } from 'vue';
import ActionButtons from './components/ActionButtons.vue';

const currentAction = ref('Search');
const buttonColor = ref('btn-success');
const isProcessing = ref(false);

// In template:
`<ActionButtons 
  :action="currentAction" 
  :btn-color="buttonColor"
  :is-loading="isProcessing"
  :is-disabled="isProcessing"
  @action-click="handleAction" 
/>`

/**
 * Search to Download Flow
 * 
 * Example of transitioning from Search to Download state.
 */

// In script:
const action = ref('Search');
const btnColor = ref('btn-success');
const loading = ref(false);

const handleAction = async () => {
    if (action.value === 'Search') {
        // Start search
        loading.value = true;
        btnColor.value = 'border';

        try {
            const results = await performSearch();

            // Switch to download state
            action.value = 'Download';
            btnColor.value = 'btn-primary';
        } catch (error) {
            // Reset on error
            action.value = 'Search';
            btnColor.value = 'btn-success';
        } finally {
            loading.value = false;
        }
    } else {
        // Handle download
        performDownload();

        // Reset to search state
        action.value = 'Search';
        btnColor.value = 'btn-success';
    }
};

// In template:
`<ActionButtons 
  :action="action" 
  :btn-color="btnColor"
  :is-loading="loading"
  :is-disabled="loading"
  @action-click="handleAction" 
/>`

    /**
     * Standalone Actions (Mobile)
     * 
     * ActionButtons automatically handles mobile layout.
     * No additional configuration needed.
     */

    // In template (automatically responsive):
    `<SearchBar v-model="query" @search="search" />

<ActionButtons 
  :action="action" 
  :btn-color="btnColor"
  @action-click="handleAction" 
/>
<!-- Shows inline on desktop, stacked on mobile -->`

// =============================================================================
// FooterSocial Component
// =============================================================================

/**
 * Basic Usage
 * 
 * FooterSocial is a stateless component requiring no props.
 */

// In script:
import FooterSocial from './components/FooterSocial.vue';

// In template:
`<FooterSocial />`

/**
 * Customizing Links
 * 
 * To customize social links, modify the component directly:
 * src/components/FooterSocial.vue
 * 
 * Update the href attributes in the template.
 */

// =============================================================================
// UnderMaintenance Component
// =============================================================================

/**
 * Conditional Rendering
 * 
 * Show/hide modal based on state.
 */

// In script:
import { ref } from 'vue';
import UnderMaintenance from './components/UnderMaintance.vue';

const showModal = ref(false);

const openMaintenance = () => {
    showModal.value = true;
};

const closeMaintenance = () => {
    showModal.value = false;
};

// In template:
`<UnderMaintenance 
  v-if="showModal" 
  @close="closeMaintenance" 
/>`

// =============================================================================
// Complete App.vue Example
// =============================================================================

/**
 * Full Application Structure
 * 
 * This is how all components work together in App.vue.
 */

/*
// Import all components
import NavigationBar from './components/NavigationBar.vue';
import SearchBar from './components/SearchBar.vue';
import ActionButtons from './components/ActionButtons.vue';
import FooterSocial from './components/FooterSocial.vue';
import UnderMaintenance from './components/UnderMaintance.vue';
import { search } from './gmap_data.js';

export default {
  components: {
    NavigationBar,
    SearchBar,
    ActionButtons,
    FooterSocial,
    UnderMaintenance,
  },
  
  data() {
    return {
      input: '',
      action: 'Search',
      btncolor: 'btn-success',
      spin: true,
      showMaintenance: false,
      results: [],
    };
  },
  
  methods: {
    async performSearch() {
      if (!this.input.trim()) return;
      
      if (this.action === 'Search') {
        this.spin = false;
        this.btncolor = 'border';
        
        try {
          this.results = await search(this.input);
          this.action = 'Download';
          this.btncolor = 'btn-primary';
        } catch (error) {
          console.error('Search failed:', error);
          this.action = 'Search';
          this.btncolor = 'btn-success';
        } finally {
          this.spin = true;
        }
      } else {
        this.showMaintenance = true;
      }
    },
    
    closeMaintenance() {
      this.showMaintenance = false;
      this.action = 'Search';
      this.btncolor = 'btn-success';
    },
  },
};
*/

/* Template:

<template>
  <NavigationBar />
  
  <div class="main-container">
    <SearchBar 
      v-model="input" 
      @search="performSearch"
    >
      <template #actions-desktop>
        <ActionButtons
          :action="action"
          :btn-color="btncolor"
          :is-loading="!spin"
          :is-disabled="!spin"
          @action-click="performSearch"
        />
      </template>
    </SearchBar>
  </div>

  <FooterSocial />

  <UnderMaintenance 
    v-if="showMaintenance" 
    @close="closeMaintenance" 
  />
</template>

*/

// =============================================================================
// Advanced Patterns
// =============================================================================

/**
 * 1. Custom Validation
 * 
 * Add custom validation logic before search.
 */

/*
const validateInput = (query) => {
  const hasType = /\b(restaurant|hospital|shop|hotel)\b/i.test(query);
  const hasLocation = /\bin\s+\w+/i.test(query);
  
  return hasType && hasLocation;
};

const handleSearch = () => {
  if (!validateInput(input.value)) {
    showError.value = true;
    setTimeout(() => showError.value = false, 500);
    return;
  }
  
  performSearch();
};
*/

/**
 * 2. Debounced Search
 * 
 * Delay search until user stops typing.
 */

/*
import { ref, watch } from 'vue';

const searchQuery = ref('');
let debounceTimer = null;

watch(searchQuery, (newValue) => {
  clearTimeout(debounceTimer);
  
  debounceTimer = setTimeout(() => {
    if (newValue.trim()) {
      performSearch(newValue);
    }
  }, 500);
});
*/

/**
 * 3. Search History
 * 
 * Store and display previous searches.
 */

/*
const searchHistory = ref([]);

const saveToHistory = (query) => {
  if (!searchHistory.value.includes(query)) {
    searchHistory.value.unshift(query);
    if (searchHistory.value.length > 10) {
      searchHistory.value.pop();
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value));
  }
};

const loadHistory = () => {
  const saved = localStorage.getItem('searchHistory');
  if (saved) {
    searchHistory.value = JSON.parse(saved);
  }
};
*/

/**
 * 4. Progressive Loading
 * 
 * Update UI as results come in.
 */

/*
const results = ref([]);
const totalPages = ref(0);
const currentPage = ref(0);

const searchWithProgress = async (query) => {
  results.value = [];
  currentPage.value = 0;
  
  // Use a custom search function that yields results progressively
  for await (const page of searchProgressive(query)) {
    results.value.push(...page);
    currentPage.value++;
    totalPages.value = page.totalPages;
  }
};
*/

// =============================================================================
// Testing Examples
// =============================================================================

/**
 * Unit Test for SearchBar
 */

/*
import { mount } from '@vue/test-utils';
import SearchBar from '@/components/SearchBar.vue';

describe('SearchBar', () => {
  it('emits search event on Enter key', async () => {
    const wrapper = mount(SearchBar, {
      props: {
        modelValue: 'test query',
      },
    });
    
    const input = wrapper.find('input');
    await input.trigger('keyup.enter');
    
    expect(wrapper.emitted('search')).toBeTruthy();
  });
  
  it('shows shake animation when isShaking is true', () => {
    const wrapper = mount(SearchBar, {
      props: {
        isShaking: true,
      },
    });
    
    expect(wrapper.find('.shake').exists()).toBe(true);
  });
});
*/

// =============================================================================
// Accessibility Examples
// =============================================================================

/**
 * Keyboard Navigation
 * 
 * All interactive elements support keyboard navigation:
 * - Tab: Move between elements
 * - Enter: Activate buttons, submit search
 * - Escape: Close modals
 */

/**
 * Screen Reader Support
 * 
 * All components include proper ARIA labels and roles.
 * Test with screen readers like NVDA or JAWS.
 */

// =============================================================================
// End of Examples
// =============================================================================

export default {
    // This file is for documentation purposes only
    // No exports are needed
};
