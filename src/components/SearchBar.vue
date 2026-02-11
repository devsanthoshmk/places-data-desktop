<!--
  SearchBar Component
  
  Purpose: Main search input interface for entering business/place types and locations.
  
  Features:
  - Search input field with placeholder guidance
  - Enter key support for quick search
  - Visual feedback with shake animation on empty input
  - Bootstrap tooltip with usage examples
  - Responsive design
  
  Props:
  - modelValue (String): The current search input value (v-model support)
  - isShaking (Boolean): Controls shake animation for validation feedback
  
  Events:
  - update:modelValue: Emitted when input value changes
  - search: Emitted when user presses Enter or triggers search
  
  Usage:
  <SearchBar v-model="searchQuery" :is-shaking="shaking" @search="handleSearch" />
  
  Author: devsanthoshmk
  Last Updated: 2026-02-12
-->

<template>
  <div class="card m-auto" style="max-width: 100%;">
    <div
      :class="['card-body p-3', { shake: isShaking }]"
      data-bs-toggle="tooltip"
      data-bs-placement="bottom"
      data-bs-html="true"
      :title="tooltipContent"
      role="search"
      aria-label="Search for places"
    >
      <div class="d-flex align-items-center">
        <!-- Search Icon -->
        <i class="fas fa-search text-body h4 m-0" aria-hidden="true"></i>
        
        <!-- Search Input Field -->
        <input
          :value="modelValue"
          @input="updateValue"
          @keyup.enter="handleSearch"
          class="form-control form-control-lg flex-shrink-1 form-control-borderless"
          type="search"
          name="searchbar"
          placeholder="Enter business/place type & location"
          aria-label="Search for business or place type and location"
          aria-describedby="search-help"
        />
        
        <!-- Slot for action buttons (desktop view) -->
        <slot name="actions-desktop"></slot>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * SearchBar Component
 * 
 * @component
 * @description 
 * Provides an input interface for users to search for places and businesses.
 * Supports v-model binding and emits search events for parent handling.
 * 
 * @prop {String} modelValue - The current search query (v-model)
 * @prop {Boolean} isShaking - Controls shake animation for validation
 * 
 * @emits {String} update:modelValue - Emitted when input value changes
 * @emits search - Emitted when user triggers a search action
 * 
 * @example
 * <SearchBar 
 *   v-model="searchQuery" 
 *   :is-shaking="hasError"
 *   @search="performSearch" 
 * />
 */
export default {
  name: 'SearchBar',
  
  props: {
    /**
     * The current value of the search input (v-model binding)
     */
    modelValue: {
      type: String,
      default: '',
    },
    
    /**
     * Controls shake animation for validation feedback
     */
    isShaking: {
      type: Boolean,
      default: false,
    },
  },
  
  emits: ['update:modelValue', 'search'],
  
  computed: {
    /**
     * Tooltip content with usage examples
     * @returns {String} HTML string for Bootstrap tooltip
     */
    tooltipContent() {
      return '<em>Example:</em> \'<b>restaurants in Chennai</b>\' or \'<b>hospitals in Bangalore</b>\'. Include a place type and city/area.';
    },
  },
  
  methods: {
    /**
     * Updates the v-model value when input changes
     * @param {Event} event - The input event
     */
    updateValue(event) {
      this.$emit('update:modelValue', event.target.value);
    },
    
    /**
     * Handles search action when Enter key is pressed
     */
    handleSearch() {
      this.$emit('search');
    },
  },
};
</script>

<style scoped>
/**
 * Shake animation for validation feedback
 * Applied when isShaking prop is true
 */
.shake {
  animation: shake-animation 0.5s;
}

@keyframes shake-animation {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

/**
 * Remove default border from search input
 */
.form-control-borderless {
  border: none;
  outline: none;
  box-shadow: none;
}

.form-control-borderless:focus {
  border: none;
  outline: none;
  box-shadow: none;
}
</style>
