<template>
  <div class="x-history-query">
    <BaseSuggestion
      class="x-history-query__suggestion"
      v-bind="{ suggestion, suggestionSelectedEvents, query }"
      data-test="history-query-suggestion"
    >
      <template #default="{ suggestion, suggestionQueryHighlighted }">
        <slot v-bind="{ suggestion, suggestionQueryHighlighted }" />
      </template>
    </BaseSuggestion>
    <RemoveHistoryQuery :historyQuery="suggestion" data-test="remove-history-query">
      <template #default>
        <slot name="remove-button-content" v-bind="{ suggestion }" />
      </template>
    </RemoveHistoryQuery>
  </div>
</template>

<script lang="ts">
  import { HistoryQuery as HistoryQueryModel } from '@empathy/search-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { State } from '../../../components/decorators';
  import BaseSuggestion from '../../../components/pure/base-suggestion.vue';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { XEventsTypes } from '../../../wiring/events.types';
  import { historyQueriesXModule } from '../x-module';
  import RemoveHistoryQuery from './remove-history-query.vue';

  /**
   * This component renders a history query suggestion combining two buttons: one for selecting this
   * suggestion as the search query, and another one to remove this query suggestion from the
   * history queries.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(historyQueriesXModule)],
    components: { RemoveHistoryQuery, BaseSuggestion }
  })
  export default class HistoryQuery extends Vue {
    /**
     * The history query suggestion to render.
     *
     * @public
     */
    @Prop({ required: true })
    protected suggestion!: HistoryQueryModel;

    /**
     * The query of the history queries module.
     *
     * @internal
     */
    @State('historyQueries', 'query')
    public query!: string;

    /**
     * The list of events that are going to be emitted when the suggestion button is pressed.
     *
     * @internal
     * @returns The {@link XEvent | XEvents} to emit.
     */
    protected get suggestionSelectedEvents(): Partial<XEventsTypes> {
      return {
        UserSelectedAHistoryQuery: this.suggestion
      };
    }
  }
</script>

<docs>
  # Examples

  ## Basic usage

  This component only requires a prop called `suggestion`

  ```vue
  <HistoryQuery :suggestion="historyQuery"/>
  ```

  ## Customizing slots content

  Suggestion and remove buttons contents can be customized.

  The default slot allows you to replace the content of the suggestion button. It has two
  properties, the suggestion itself, and a `string` of HTML with the highlighted query.

  The other slot is called `remove-button-content`, and allows you to set the content of the
  button that serves to remove this query from the history. This slot only has one property, the
  suggestion.

  ```vue
  <HistoryQuery :suggestion="historyQuery">
    <template #default="{ suggestion, suggestionQueryHighlighted }">
      <img src="./history-icon.svg" />
      <span v-html="suggestionQueryHighlighted" />
    </template>

    <template #remove-button-content="{ suggestion }">
      <img src="./remove-icon.svg" />
    </template>
  </HistoryQuery>
  ```
</docs>
