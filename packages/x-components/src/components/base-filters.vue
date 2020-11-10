<template>
  <component
    :is="animation || 'ul'"
    v-if="renderFilters"
    tag="ul"
    class="x-filters"
    data-test="base-filters"
  >
    <li
      v-for="filter in filters"
      :key="filter.id"
      class="x-filters__item"
      data-test="base-filters-item"
    >
      <!--
        @slot (Required) Filter content
            @binding {Filter} filter - Search-types filter data.
      -->
      <slot :filter="filter" />
    </li>
  </component>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Filter } from '@empathy/search-types';
  import { Component, Prop } from 'vue-property-decorator';

  /**
   * Renders a list with a list item per each filter in the filters prop array.
   * Each list item has a scoped slot, passing the filter as slot prop.
   *
   * @public
   */
  @Component
  export default class BaseFilters extends Vue {
    /**
     * The list of filters to be rendered as slots.
     *
     * @public
     */
    @Prop({ required: true})
    protected filters!: Filter[];

    /**
     * Animation component that will be used to animate the base filters.
     *
     * @public
     */
    @Prop()
    protected animation!: Vue;

    /**
     * It handles if the filters should be rendered.
     *
     * @returns True if there are filters.
     *
     * @public
     */
    protected get renderFilters(): boolean {
      return this.filters.length > 0;
    }
  }
</script>

<docs>
  #Example

  Renders a list with a list item per each filter in the filters prop array.
  Each list item has a scoped slot, passing the filter as slot prop.

  ## Basic usage

  Using default slot:
  ```vue
  <BaseFilters :filters="filters">
    <template #default="{ filter }">
      <p>{{ filter.title }}</p>
    </template>
  </BaseFilters>
  ```

  Using default slot abbreviated syntax:
  ```vue
  <BaseFilters :filters="filters" v-slot="{ filter }">
    <p>{{ filter.title }}</p>
  </BaseFilters>
  ```
</docs>
