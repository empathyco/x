<template>
  <BaseSuggestion
    :suggestionSelectedEvents="suggestionSelectedEvents"
    :suggestion="semanticQuery"
    data-test="semantic-query"
  >
    <slot :query="semanticQuery" />
  </BaseSuggestion>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { SemanticQuery as SemanticQueryModel } from '@empathyco/x-types';
  import { xComponentMixin } from '../../../components';
  import { semanticQueriesXModule } from '../x-module';
  import BaseSuggestion from '../../../components/suggestions/base-suggestion.vue';
  import { XEventsTypes } from '../../../wiring';

  @Component({
    components: { BaseSuggestion },
    mixins: [xComponentMixin(semanticQueriesXModule)]
  })
  export default class SemanticQuery extends Vue {
    @Prop()
    public semanticQuery!: SemanticQueryModel;

    protected get suggestionSelectedEvents(): Partial<XEventsTypes> {
      return {
        UserSelectedASemanticQuery: this.semanticQuery
      };
    }
  }
</script>
