<template>
  <h2>Simple Filter</h2>
  <div>
    <h3>As it is</h3>
    <SimpleFilter
      :filter="filter"
      :cssClasses="innerCssClasses"
      class="this-is-not-inherited-in-vue3-use-cssClasses-prop-instead"
      data-custom="this-is-not-inherited-in-vue3"
    />
  </div>
  <div>
    <h3>Label slot content</h3>
    <SimpleFilter :filter="filter" :cssClasses="innerCssClasses">
      <template #label>🚗 {{ filter.label }} ({{ filter.totalResults }})</template>
    </SimpleFilter>
  </div>
  <div>
    <h3>Default slot content</h3>
    <SimpleFilter
      v-slot="{ filter, clickFilter, cssClasses }"
      :filter="filter"
      :cssClasses="innerCssClasses"
    >
      <label :class="cssClasses" for="filter" class="LABEL-CLASS">
        <input @change="clickFilter" id="filter" :checked="filter.selected" type="checkbox" />
        {{ filter.label }}
      </label>
    </SimpleFilter>
  </div>
</template>

<script setup lang="ts">
  import { SimpleFilter as SimpleFilterModel } from '@empathyco/x-types';
  import { computed, ref, Ref } from 'vue';
  import SimpleFilter from '../../../../../x-components/src/x-modules/facets/components/filters/simple-filter.vue';

  const filter: Ref<SimpleFilterModel> = ref({
    modelName: 'SimpleFilter',
    label: 'My Filter',
    totalResults: 10,
    facetId: 'facet1',
    id: 'filter1',
    selected: false
  });

  const innerCssClasses = computed(() => [
    'MOT-CUSTOM',
    { 'MOT-CUSTOM--SELECTED': filter.value.selected }
  ]);
</script>

<style>
  .MOT-CUSTOM--SELECTED {
    background-color: greenyellow;
  }
</style>
