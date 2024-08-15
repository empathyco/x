<template>
  <h1>Dinamic content:</h1>
  <button @click="insert">Insert at random index</button>
  <button @click="reset">Reset</button>

  <StaggeredFadeAndSlide :stagger="500">
    <li v-for="item in items" :key="item.id">
      {{ item.id }} - {{ item.name }}
      <button @click="remove(item)">x</button>
    </li>
  </StaggeredFadeAndSlide>

  <br />
  <h1>Animation as prop</h1>
  <BaseSuggestions :suggestions="suggestions" :animation="StaggeredFadeAndSlide" :stagger="50">
    <template #default="{ suggestion }">
      <span>{{ suggestion.query }}</span>
    </template>
  </BaseSuggestions>

  <br />
  <h1>Static content:</h1>
  <StaggeredFadeAndSlide :stagger="50">
    <li key="1">Element to animate</li>
    <li key="2">Element to animate</li>
    <li key="3">Element to animate</li>
  </StaggeredFadeAndSlide>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import StaggeredFadeAndSlide from '../../../../x-components/src/components/animations/staggered-fade-and-slide.vue';
  import BaseSuggestions from '../../../../x-components/src/components/suggestions/base-suggestions.vue';
  import {
    getQuerySuggestionsStub,
    createResultStub,
    getResultsStub
  } from '../../../../x-components/src/__stubs__';
  const suggestions = getQuerySuggestionsStub('chip', 5);
  const getInitialItems = () => getResultsStub(5);
  const items = ref(getInitialItems());
  let id = items.value.length + 1;
  /**
   * Insert a new item at a random index.
   */
  function insert() {
    const i = Math.round(Math.random() * items.value.length);
    items.value.splice(i, 0, createResultStub(`Product ${id++}`));
  }
  /**
   * Reset the list of items.
   */
  function reset() {
    items.value = getInitialItems();
    id = items.value.length + 1;
  }
  /**
   * Remove an item from the list.
   *
   * @param item - The item to remove.
   */
  function remove(item: any) {
    const i = items.value.indexOf(item);
    if (i > -1) {
      items.value.splice(i, 1);
    }
  }
</script>
