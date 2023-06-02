<template>
  <BaseSuggestion
    :suggestionSelectedEvents="suggestionSelectedEvents"
    :suggestion="suggestion"
    data-test="semantic-query"
  >
    <slot :suggestion="suggestion" />
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
    public suggestion!: SemanticQueryModel;

    protected get suggestionSelectedEvents(): Partial<XEventsTypes> {
      return {
        UserSelectedASemanticQuery: this.suggestion
      };
    }
  }
</script>
