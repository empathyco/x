<template>
  <div v-if="suggestionResults" data-test="next-query-preview" class="x-next-query-preview">
    <!--
      @slot Next Query Preview default slot.
          @binding {NextQuery} suggestion - Next Query suggestion data
          @binding {Result[]} results - The results preview of the next query
          @binding {number} totalResults - The total results of the search request
    -->
    <slot
      :suggestion="suggestion"
      :results="suggestionResults.items"
      :totalResults="suggestionResults.totalResults"
    >
      <div v-for="result in suggestionResults.items" :key="result.id">
        <span data-test="result-name">{{ result.name }}</span>
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { NextQuery, NextQueryPreviewResults } from '@empathyco/x-types';
  import { Dictionary } from '@empathyco/x-utils';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { nextQueriesXModule } from '../x-module';
  import { State } from '../../../components/decorators/store.decorators';

  /**
   * Retrieves a preview of the results of a next query and exposes them in the default slot,
   * along with the next query and the totalResults of the search request.
   * By default, it renders the names of the results.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(nextQueriesXModule)]
  })
  export default class NextQueryPreview extends Vue {
    /**
     * The next query to retrieve the results preview.
     *
     * @public
     */
    @Prop({
      required: true
    })
    protected suggestion!: NextQuery;

    /**
     * The results preview of the next queries mounted.
     * It is a dictionary, indexed by the next query query.
     */
    @State('nextQueries', 'resultsPreview')
    public results!: Dictionary<NextQueryPreviewResults>;

    /**
     * The component emits the NextQueryPreviewMounted event to retrieve the results preview
     * of the next query.
     */
    mounted(): void {
      this.$x.emit('NextQueryPreviewMounted', this.suggestion.query);
    }

    /**
     * Gets from the state the results preview of the next query.
     *
     * @returns The results preview of the actual next query.
     */
    public get suggestionResults(): NextQueryPreviewResults {
      return this.results[this.suggestion.query];
    }
  }
</script>
