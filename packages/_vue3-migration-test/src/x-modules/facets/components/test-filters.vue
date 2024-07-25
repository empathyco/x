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
  <br />
  <hr />
  <br />
  <h2>Number Range Filter</h2>
  <NumberRangeFilter
    :clickEvents="{ UserClickedANumberRangeFilter: filterNumber }"
    :filter="filterNumber"
    :cssClasses="innerCssClasses"
  />
  <br />
  <hr />
  <br />
  <h2>Editable Number Range Filter</h2>
  <EditableNumberRangeFilter
    :filter="filterEditNumber"
    :hasClearButton="false"
    :class="innerCssClasses"
    :inputsClass="'my-inputs-class'"
    :buttonsClass="'my-buttons-class'"
  />
  <EditableNumberRangeFilter
    :filter="filterEditNumber"
    :class="innerCssClasses"
    #default="{
      min,
      max,
      setMin,
      setMax,
      emitUserModifiedFilter,
      clearValues,
      hasError,
      isAnyRange
    }"
  >
    <button @click="emitUserModifiedFilter">✅ Apply!</button>
    <button @click="clearValues">🗑 Clear!</button>
    <input @change="setMin($event.target.value)" :value="!isAnyRange ? min : null" />
    <input @change="setMax($event.target.value)" :value="max" />
    <div v-if="hasError" class="has-error">⚠️ Invalid range values</div>
  </EditableNumberRangeFilter>
  <br />
  <hr />
  <br />
  <h2>Hierarchical Filter</h2>
  <HierarchicalFilter :cssClasses="innerCssClasses" :filter="filterHierarchical">
    <template #label>
      <span class="custom-class">{{ filterHierarchical.label }}</span>
    </template>
  </HierarchicalFilter>
</template>

<script setup lang="ts">
  import {
    SimpleFilter as SimpleFilterModel,
    NumberRangeFilter as NumberRangeFilterModel,
    EditableNumberRangeFilter as EditableNumberRangeFilterModel,
    HierarchicalFilter as HierarchicalFilterModel
  } from '@empathyco/x-types';
  import { computed, ref, Ref } from 'vue';
  import SimpleFilter from '../../../../../x-components/src/x-modules/facets/components/filters/simple-filter.vue';
  import NumberRangeFilter from '../../../../../x-components/src/x-modules/facets/components/filters/number-range-filter.vue';
  import EditableNumberRangeFilter from '../../../../../x-components/src/x-modules/facets/components/filters/editable-number-range-filter.vue';
  import HierarchicalFilter from '../../../../../x-components/src/x-modules/facets/components/filters/hierarchical-filter.vue';

  const filter: Ref<SimpleFilterModel> = ref({
    modelName: 'SimpleFilter',
    label: 'My Filter',
    totalResults: 10,
    facetId: 'facet1',
    id: 'filter1',
    selected: false
  });

  const filterNumber: Ref<NumberRangeFilterModel> = ref({
    id: `price:1-10`,
    modelName: 'NumberRangeFilter',
    label: `From 1 to 10`,
    facetId: 'price',
    range: {
      min: 1,
      max: 10
    },
    selected: false
  });

  const filterEditNumber: Ref<EditableNumberRangeFilterModel> = ref({
    facetId: 'age',
    id: 'age:primary',
    label: 'primary',
    modelName: 'EditableNumberRangeFilter',
    range: {
      min: null,
      max: null
    },
    selected: false
  });

  const filterHierarchical: Ref<HierarchicalFilterModel> = ref({
    id: `categories:men`,
    modelName: 'HierarchicalFilter',
    label: `men`,
    facetId: 'categories',
    parentId: null,
    totalResults: 10,
    children: [],
    selected: false
  });

  const innerCssClasses = computed(() => [
    'MOT-CUSTOM',
    { 'MOT-CUSTOM--SELECTED': filter.value.selected }
  ]);
</script>

<style lang="scss">
  .MOT-CUSTOM--SELECTED,
  .x-selected {
    background-color: greenyellow;
  }
</style>
