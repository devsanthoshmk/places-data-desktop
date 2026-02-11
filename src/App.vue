<!--
  App.vue - Main Application Component
  
  Purpose: Root component for the Globex Places Data application.
  
  Features:
  - Google Maps Places data search functionality
  - Excel export capability for search results
  - Responsive design with Bootstrap integration
  - Under maintenance modal for features in development
  
  Component Structure:
  - NavigationBar: Application header with branding
  - SearchBar: Main search input interface
  - ActionButtons: Search and download controls
  - FooterSocial: Social media links
  - UnderMaintenance: Modal for maintenance notifications
  
  Dependencies:
  - gmap_data.js: Search and Excel export functionality
  - Bootstrap 5.x: UI framework
  - Vue 3: Frontend framework
  
  Author: devsanthoshmk
  Last Updated: 2026-02-12
-->

<template>
  <!-- Navigation Header -->
  <NavigationBar />
  
  <!-- Main Content Area -->
  <div 
    class="d-flex justify-content-center align-items-center" 
    style="overflow: hidden; min-height: 78vh;"
  >
    <div class="row w-100 animate-me" style="margin-bottom: 150px;">
      <div class="col-md-8 col-sm-12 mx-auto">
        <!-- Search Bar Component with Desktop Action Buttons -->
        <SearchBar 
          v-model="input" 
          :is-shaking="shaking !== ''"
          @search="act(input)"
        >
          <!-- Desktop Action Buttons (injected into SearchBar slot) -->
          <template #actions-desktop>
            <ActionButtons
              :action="action"
              :btn-color="btncolor"
              :is-loading="!spin"
              :is-disabled="!spin"
              @action-click="act(input)"
            />
          </template>
        </SearchBar>
      </div>
    </div>
  </div>

  <!-- Footer with Social Links -->
  <FooterSocial />

  <!-- Maintenance Modal -->
  <UnderMaintenance 
    v-if="showMaintenance" 
    @close="closeMaintenance" 
  />
</template>

<script>
/**
 * App Component
 * 
 * @component
 * @description 
 * Main application component orchestrating the Places Data search interface.
 * Handles search operations, data export, and UI state management.
 * 
 * @requires gmap_data.js - Core search and export functionality
 * @requires NavigationBar - Header component
 * @requires SearchBar - Search input component
 * @requires ActionButtons - Action controls component
 * @requires FooterSocial - Footer with social links
 * @requires UnderMaintenance - Maintenance modal component
 */
import { search, make_excel } from './gmap_data.js';
import Tooltip from 'bootstrap/js/dist/tooltip';
import NavigationBar from './components/NavigationBar.vue';
import SearchBar from './components/SearchBar.vue';
import ActionButtons from './components/ActionButtons.vue';
import FooterSocial from './components/FooterSocial.vue';
import UnderMaintenance from './components/UnderMaintance.vue';

export default {
  name: 'App',
  
  components: {
    NavigationBar,
    SearchBar,
    ActionButtons,
    FooterSocial,
    UnderMaintenance,
  },
  
  data() {
    return {
      /**
       * User's search input query
       * @type {String}
       */
      input: '',
      
      /**
       * Current button action state
       * Values: 'Search' | 'Download' | ''
       * @type {String}
       */
      action: 'Search',
      
      /**
       * Bootstrap button color class
       * Values: 'btn-success' | 'btn-primary' | 'border'
       * @type {String}
       */
      btncolor: 'btn-success',
      
      /**
       * CSS class for shake animation on validation error
       * @type {String}
       */
      shaking: '',
      
      /**
       * Controls loading state of action button
       * @type {Boolean}
       */
      spin: true,
      
      /**
       * Controls visibility of maintenance modal
       * @type {Boolean}
       */
      showMaintenance: false,
      
      /**
       * Stores search results from Google Maps API
       * @type {Array}
       */
      row_datas: [],
    };
  },
  
  methods: {
    /**
     * Development logging utility
     * @param {*} ob - Object to log to console
     */
    log(ob) {
      console.log(ob);
    },
    
    /**
     * Main action handler for Search and Download operations
     * 
     * Workflow:
     * 1. Validates input query
     * 2. If action is 'Search': Performs Google Maps search
     * 3. If action is 'Download': Shows maintenance modal (Excel export disabled)
     * 
     * @param {String} query - The search query from user input
     * @returns {Promise<void>}
     */
    async act(query) {
      // Validate input is not empty
      if (query.trim()) {
        if (this.action === 'Search') {
          // Start loading state
          this.spin = false;
          this.action = '';
          this.btncolor = 'border';
          
          try {
            // Perform search operation
            this.rows = await search(query);
            console.log('Final full_list:', this.rows.length);
            
            // Update to download state on success
            this.btncolor = 'btn-primary';
            this.spin = true;
            this.action = 'Download';
          } catch (error) {
            console.error('There was a problem with the search function:', error);
            
            // Reset to search state on error
            this.btncolor = 'btn-success';
            this.spin = true;
            this.action = 'Search';
          }
        } else {
          // Show maintenance modal instead of downloading
          this.showMaintenance = true;
          
          // Production working code (currently disabled):
          // console.log(this.rows);
          // make_excel(this.rows, query);
          // this.btncolor = 'btn-success';
          // this.action = 'Search';
        }
      } else {
        // Trigger shake animation for empty input
        this.shaking = 'shake';
        setTimeout(() => {
          this.shaking = '';
        }, 500);
      }
    },
    
    /**
     * Closes maintenance modal and resets state
     */
    closeMaintenance() {
      this.showMaintenance = false;
      this.btncolor = 'btn-success';
      this.action = 'Search';
    },
  },
  
  /**
   * Initializes Bootstrap tooltips on component mount
   */
  mounted() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(el => new Tooltip(el));
  },
};
</script>

<style scoped>
/**
 * Mobile button group styles
 * Hidden by default, shown only on mobile devices (<768px)
 */
.smbts {
  display: none;
}

/**
 * Hide desktop button group on mobile
 */
@media (max-width: 767.98px) {
  .nbts {
    display: none;
  }
}

/**
 * Show mobile button group on small screens
 */
@media (max-width: 767.98px) {
  .smbts {
    display: flex;
  }
}

/**
 * Shake animation for input validation feedback
 */
.shake {
  animation: shake-animation 0.5s;
}

@keyframes shake-animation {
  0%, 100% { 
    transform: translateX(0); 
  }
  10%, 30%, 50%, 70%, 90% { 
    transform: translateX(-5px); 
  }
  20%, 40%, 60%, 80% { 
    transform: translateX(5px); 
  }
}
</style>
