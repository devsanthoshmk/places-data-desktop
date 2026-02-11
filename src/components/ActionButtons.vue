<!--
  ActionButtons Component
  
  Purpose: Provides action buttons for Advanced options and Search/Download functionality.
  
  Features:
  - Responsive button group with dropdown menu
  - Dynamic button state (Search/Download)
  - Loading spinner animation during operations
  - Separate layouts for desktop and mobile views
  - Disabled state management
  
  Props:
  - action (String): Current button action text ('Search' or 'Download')
  - btnColor (String): Bootstrap button color class
  - isLoading (Boolean): Controls loading spinner visibility
  - isDisabled (Boolean): Disables the action button
  
  Events:
  - action-click: Emitted when main action button is clicked
  
  Usage:
  <ActionButtons 
    :action="actionText" 
    :btn-color="buttonColor"
    :is-loading="loading"
    @action-click="handleAction" 
  />
  
  Author: devsanthoshmk
  Last Updated: 2026-02-12
-->

<template>
  <div>
    <!-- Desktop/Tablet Button Group (hidden on mobile) -->
    <div class="btn-group nbts">
      <!-- Advanced Options Dropdown -->
      <button
        class="btn dropdown-toggle btn-lg"
        type="button"
        id="dropdownMenuButtonDesktop"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        aria-label="Advanced search options"
      >
        Advanced
      </button>
      
      <!-- Dropdown Menu -->
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButtonDesktop">
        <li>
          <a class="dropdown-item d-flex align-items-center justify-content-center" href="#">
            Coming Soon...
            <i class="fas fa-info-circle ms-2" aria-hidden="true"></i>
          </a>
        </li>
      </ul>
      
      <!-- Main Action Button (Search/Download) -->
      <button
        :disabled="isDisabled"
        @click="handleClick"
        :class="['btn', btnColor, 'btn-lg']"
        style="border-top-left-radius: 2px; border-bottom-left-radius: 2px;"
        :aria-label="action"
      >
        <!-- Loading Spinner -->
        <span
          :class="{ 'd-none': !isLoading, 'spinner-grow text-primary': true }"
          role="status"
          aria-hidden="true"
        ></span>
        {{ action }}
      </button>
    </div>
    
    <!-- Mobile Button Group (visible only on mobile) -->
    <div class="justify-content-center mt-1 smbts">
      <div class="btn-group">
        <!-- Advanced Options Dropdown -->
        <button
          class="btn dropdown-toggle btn-lg"
          type="button"
          id="dropdownMenuButtonMobile"
          data-bs-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          aria-label="Advanced search options"
        >
          Advanced
        </button>
        
        <!-- Dropdown Menu -->
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButtonMobile">
          <li>
            <a class="dropdown-item d-flex align-items-center justify-content-center" href="#">
              Coming Soon...
              <i class="fas fa-info-circle ms-2" aria-hidden="true"></i>
            </a>
          </li>
        </ul>
        
        <!-- Main Action Button (Search/Download) -->
        <button
          @click="handleClick"
          :class="['btn', btnColor, 'btn-lg']"
          style="border-top-left-radius: 2px; border-bottom-left-radius: 2px;"
          :aria-label="action"
        >
          <!-- Loading Spinner -->
          <span
            :class="{ 'd-none': !isLoading, 'spinner-grow text-primary': true }"
            role="status"
            aria-hidden="true"
          ></span>
          {{ action }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * ActionButtons Component
 * 
 * @component
 * @description 
 * Provides responsive action buttons for search operations.
 * Includes adaptive layouts for desktop and mobile viewports.
 * 
 * @prop {String} action - Current action text ('Search' or 'Download')
 * @prop {String} btnColor - Bootstrap button color class (e.g., 'btn-success')
 * @prop {Boolean} isLoading - Shows/hides loading spinner
 * @prop {Boolean} isDisabled - Disables the action button
 * 
 * @emits action-click - Emitted when the action button is clicked
 * 
 * @example
 * <ActionButtons 
 *   action="Search" 
 *   btn-color="btn-success"
 *   :is-loading="false"
 *   :is-disabled="false"
 *   @action-click="performSearch" 
 * />
 */
export default {
  name: 'ActionButtons',
  
  props: {
    /**
     * Current action text displayed on the button
     */
    action: {
      type: String,
      required: true,
      validator: (value) => ['Search', 'Download', ''].includes(value),
    },
    
    /**
     * Bootstrap color class for the button
     */
    btnColor: {
      type: String,
      default: 'btn-success',
    },
    
    /**
     * Controls loading spinner visibility
     */
    isLoading: {
      type: Boolean,
      default: false,
    },
    
    /**
     * Controls button disabled state (desktop only)
     */
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  
  emits: ['action-click'],
  
  methods: {
    /**
     * Handles click event on action button
     * Emits action-click event to parent component
     */
    handleClick() {
      this.$emit('action-click');
    },
  },
};
</script>

<style scoped>
/**
 * Mobile button group styles
 * Hidden by default, shown only on mobile devices
 */
.smbts {
  display: none;
}

/**
 * Desktop button group styles
 * Hidden on mobile devices (max-width: 767.98px)
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
</style>
