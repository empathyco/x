<template>
  <div v-if="suggestionResults" data-test="next-query-preview" class="x-next-query-preview">
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

  @Component({
    mixins: [xComponentMixin(nextQueriesXModule)]
  })
  export default class NextQueryPreview extends Vue {
    @Prop({
      required: true
    })
    protected suggestion!: NextQuery;

    @State('nextQueries', 'resultsPreview')
    public results!: Dictionary<NextQueryPreviewResults>;

    mounted(): void {
      this.$x.emit('NextQueryPreviewMounted', this.suggestion.query);
    }

    public get suggestionResults(): NextQueryPreviewResults {
      return this.results[this.suggestion.query];
    }
  }
</script>
