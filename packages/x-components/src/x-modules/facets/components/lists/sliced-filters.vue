<template>
  <div class="x-sliced-filters" :class="cssClasses" data-test="filters-show-more">
    <!--
      @slot (Required) Sliced filters content.
        @binding {Filter[]} slicedFilters - Sliced filters..
    -->
    <slot :slicedFilters="slicedFilters" />
    <template v-if="showButton">
      <button
        v-if="showMoreFilters"
        @click="toggleShowMoreFilters"
        class="x-sliced-filters__button x-sliced-filters__button--show-more"
        data-test="sliced-filters-show-more-button"
      >
        <!--
          @slot Button show more filters.
            @binding {number} difference - The difference between the filters and max to show.
        -->
        <slot name="show-more" :difference="difference">Show {{ difference }} more filters</slot>
      </button>
      <button
        v-else
        @click="toggleShowMoreFilters"
        class="x-sliced-filters__button x-sliced-filters__button--show-less"
        data-test="sliced-filters-show-less-button"
      >
        <!--
          @slot Button show less filters.
            @binding {number} difference - The difference between the filters and max to show.
        -->
        <slot name="show-less" :difference="difference">Show {{ difference }} less filters</slot>
      </button>
    </template>
  </div>
</template>

<script lang="ts">
  import { Filter } from '@empathy/search-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { xComponentMixin } from '../../../../components';
  import { VueCSSClasses } from '../../../../utils';
  import { facetsXModule } from '../../x-module';

  /**
   * Component that slices a list of filters and returns them using the default scoped slot,
   * allowing the user to show the full list of them or slicing them again using the
   * show more/less buttons.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(facetsXModule)]
  })
  export default class SlicedFilters extends Vue {
    /** The filters array. */
    @Prop({ required: true })
    protected filters!: Filter[];

    /** The maximum number of filters to show. */
    @Prop({ required: true })
    protected max!: number;

    /** For showing the remaining filters. */
    public showMoreFilters = true;

    /**
     * Show the buttons template when length filters is greater than property max.
     *
     * @returns Boolean if length filters is greater than property max.
     * @internal
     */
    protected get showButton(): boolean {
      return this.filters.length > this.max;
    }

    /**
     * Sliced the array of filters depends on click button show more.
     *
     * @returns Array of sliced filters or all filters.
     * @internal
     */
    protected get slicedFilters(): Filter[] {
      return this.showMoreFilters ? this.filters.slice(0, this.max) : this.filters;
    }

    /**
     * The difference between length filters and max to show.
     *
     * @returns Number of remaining filters to show.
     * @internal
     */
    protected get difference(): number {
      return this.filters.length - this.max;
    }

    /**
     * Show or hide the remaining filters.
     *
     * @internal
     */
    protected toggleShowMoreFilters(): void {
      this.showMoreFilters = !this.showMoreFilters;
    }

    /**
     * Adds the dynamic css classes to the component.
     *
     * @returns The classes to be added to the component.
     * @internal
     */
    protected get cssClasses(): VueCSSClasses {
      return {
        'x-sliced-filters--is-sliced': this.showButton
      };
    }
  }
</script>

<docs>
  # Example

  The sliced filters component, takes a list of filters, and the maximum number of filters to
  render as prop. Then, it slices the list of filters using the `max` prop, and returns this new
  filters list using the default scoped slot.

  The user can click the show more button if he wants to see the full list of filters, or the show
  less button when he wants to reset the filters. This buttons text or icons can be configured
  via slot too. They receive a `difference` prop which can be useful for writing friendlier
  messages.

  This component is usually integrated with the `Facets` and `Filters` component. It is useful
  when there are lots of available filters for a single facet, helping to improve the
  app performance, as less nodes are rendered.

  ## Basic usage

  ```vue
  <template>
    <Facets v-slot="{ facet }">
      <BaseShowMoreFilters :filters="facet.filters" :max="4">
        <template #default="{ slicedFilters }">
          <Filters :filters="slicedFilters" v-slot="{ filter }">
            <SimpleFilter :filter="filter"/>
          </Filters>
        </template>
        <template #show-more="{ difference }">Show {{ difference }} more filters</template>
        <template #show-less="{ difference }">Show {{ difference }} less filters</template>
      </BaseShowMoreFilters>
    </Facets>
  </template>
  <script>
    import { BaseShowMoreFilters} from "@empathy/x-components";
    import { Facets, SimpleFilter, Filters } from "@empathy/x-components";

    export default {
      components: {
        Facets,
        BaseShowMoreFilters,
        Filters,
        SimpleFilter
      }
    }
  </script>
  ```
</docs>
