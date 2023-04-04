<template>
  <div v-if="isNoResultsWithFilters" class="x-fallback-disclaimer" data-test="fallback-disclaimer">
    <slot v-bind="{ query }">
      No results found for {{ query }} with the selected filters. The filters have been unselected.
    </slot>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { State, xComponentMixin, XOn } from '../../../components';
  import { searchXModule } from '../x-module';

  /**
   * The `FallbackDisclaimer` component.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(searchXModule)]
  })
  export default class FallbackDisclaimer extends Vue {
    /**
     * Flag to indicate if there is no results with filters.
     *
     */
    protected isNoResultsWithFilters = false;
    /**
     * The query from the search state.
     *
     * @public
     */
    @State('search', 'query')
    public query!: string;

    /**
     * Handler to update the flag `isNoResultsWithFilters` when there is a no results with filters
     * situation.
     *
     * @param isNoResultsWithFilters - The new flag status.
     *
     * @internal
     */
    @XOn('NoResultsWithFiltersChanged')
    setNoResultsWithFilters(isNoResultsWithFilters: boolean): void {
      this.isNoResultsWithFilters = isNoResultsWithFilters;
    }
  }
</script>

<docs lang="mdx"></docs>
