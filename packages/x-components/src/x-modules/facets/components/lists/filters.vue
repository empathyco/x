<template>
  <component
    :is="animation"
    v-if="renderFilters"
    tag="ul"
    class="x-filters"
    :class="cssClasses"
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
  import { BooleanFilter } from '@empathy/search-types';
  import { Component, Prop } from 'vue-property-decorator';
  import { xComponentMixin } from '../../../../components';
  import { isFilterSelected } from '../../../../utils/filters';
  import { VueCSSClasses } from '../../../../utils/types';
  import { facetsXModule } from '../../x-module';

  /**
   * Renders a list with a list item per each
   * {@link @empathy/search-types#BooleanFilter | BooleanFilter} in the filters prop array.
   * Each list item has a scoped slot, passing the filter as slot prop.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(facetsXModule)]
  })
  export default class Filters extends Vue {
    /**
     * The list of filters to be rendered as slots.
     *
     * @public
     */
    @Prop({ required: true })
    protected filters!: BooleanFilter[];

    /**
     * Animation component that will be used to animate the base filters.
     *
     * @public
     */
    @Prop({ default: 'ul' })
    protected animation!: Vue | string;

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

    /**
     * Checks if at least one filter is selected.
     *
     * @returns True if at least one filter is selected. False otherwise.
     * @internal
     */
    protected get hasSelectedFilters(): boolean {
      return this.filters.some(isFilterSelected);
    }

    /**
     * Dynamic CSS classes for the root element of this component.
     *
     * @returns An object containing the dynamic CSS classes and a boolean indicating if they should
     * be added or not.
     */
    protected get cssClasses(): VueCSSClasses {
      return {
        'x-filters--has-selected-filters': this.hasSelectedFilters
      };
    }
  }
</script>

<style lang="scss" scoped>
  .x-filters {
    list-style-type: none;
    padding-inline-start: 0;
  }
</style>

<docs>
  #Example

  Renders a list with a list item per each filter in the filters prop array.
  Each list item has a scoped slot, passing the filter as slot prop.

  ## Basic usage

  Using default slot:
  ```vue
  <Filters :filters="filters">
    <template #default="{ filter }">
      <p>{{ filter.label }}</p>
    </template>
  </Filters>
  ```

  Using default slot abbreviated syntax:
  ```vue
  <Filters :filters="filters" v-slot="{ filter }">
    <p>{{ filter.label }}</p>
  </Filters>
  ```
</docs>
