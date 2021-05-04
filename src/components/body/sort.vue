<template>
  <SortDropdown :items="sortValues">
    <template #toggle="{ item, isOpen }">
      {{ item || 'Default' }} {{ isOpen ? '🔼' : '🔽' }}
    </template>
    <template #item="{ item, isHighlighted, isSelected }">
      <span v-if="isSelected">✅</span>
      <span v-if="isHighlighted">🟢</span>
      {{ item || 'Default' }}
    </template>
  </SortDropdown>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Sort } from '@empathy/search-types';
  import { SortDropdown } from '@empathy/x-components/search';

  @Component({
    components: {
      SortDropdown
    }
  })
  export default class SortComponent extends Vue {
    public sortValues: Sort[] = ['', 'priceSort asc', 'priceSort desc'];
  }
</script>
