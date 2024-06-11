<template>
  <SearchInput />
  <BaseKeyboardNavigation>
    <ul>
      <li>
        <button>First</button>
      </li>
      <li>
        <button>Second</button>
      </li>
      <li>
        <button>Third</button>
      </li>
    </ul>
  </BaseKeyboardNavigation>
</template>

<script setup lang="ts">
  import BaseKeyboardNavigation from '../../../x-components/src/components/base-keyboard-navigation.vue';
  import SearchInput from '../../../x-components/src/x-modules/search-box/components/search-input.vue';
</script>

<style>
  button:focus-visible {
    border: 3px solid red;
  }
</style>
