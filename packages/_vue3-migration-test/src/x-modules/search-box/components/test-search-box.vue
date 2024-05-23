<template>
  <div style="display: flex; flex-flow: row nowrap">
    <SearchInput
      @UserPressedEnterKey="value = 'You have pressed the enter key'"
      @UserFocusedSearchBox="hasFocus = true"
      @UserBlurredSearchBox="hasFocus = false"
      @UserIsTypingAQuery="value = 'Typing...'"
      :maxLength="10"
    />
    <ClearSearchInput @UserPressedClearSearchBoxButton="value = 'You clear your query'" />
    <SearchButton @UserPressedSearchButton="value = 'You search a query'">Search</SearchButton>
    <SearchInputPlaceholder
      :messages="placeholderMessages"
      animation="div"
      style="position: absolute; pointer-events: none; top: -41rem; left: 1rem"
    />
  </div>
  <br />
  <span>{{ value }}</span>
  <br />
  <span>{{ hasFocus ? 'Focused' : 'Unfocused' }}</span>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import SearchInput from '../../../../../x-components/src/x-modules/search-box/components/search-input.vue';
  import SearchInputPlaceholder from '../../../../../x-components/src/x-modules/search-box/components/search-input-placeholder.vue';
  import SearchButton from '../../../../../x-components/src/x-modules/search-box/components/search-button.vue';
  import ClearSearchInput from '../../../../../x-components/src/x-modules/search-box/components/clear-search-input.vue';

  const value = ref('There are no value yet');
  const hasFocus = ref(false);

  const placeholderMessages = [
    'Find shirts',
    'Find shoes',
    'Find watches',
    'Find handbags',
    'Find sunglasses'
  ];
</script>

<style scoped></style>
