<template>
  <BaseSuggestion
    v-bind="{ query, suggestion, suggestionSelectedEvents: event }"
    :aria-label="suggestion.query"
    class="x-query-suggestion"
    data-test="query-suggestion"
  >
    <template #default="{ suggestion, suggestionQueryHighlighted }">
      <slot v-bind="{ suggestion, suggestionQueryHighlighted }">
        <span v-html="suggestionQueryHighlighted" class="x-query-suggestion__query" />
      </slot>
    </template>
  </BaseSuggestion>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { Suggestion } from '@empathy/search-types';
  import { State } from '../../../components/decorators';
  import BaseSuggestion from '../../../components/pure/base-suggestion.vue';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { XEventsTypes } from '../../../wiring/events.types';
  import { querySuggestionsXModule } from '../x-module';

  /**
   * Simple query-suggestion component that renders a suggestion.
   *
   * @remarks
   * A query suggestion is just a query that contains the user query, and that can have associated
   * a set of filters. I.e. If you are searching for `shirt`, a query suggestion could be
   * `long sleeve shirt`.
   *
   * @public
   */
  @Component({
    components: { BaseSuggestion },
    mixins: [xComponentMixin(querySuggestionsXModule)]
  })
  export default class QuerySuggestion extends Vue {
    /**
     * The query-suggestions module query.
     * TODO: This should be the normalized query obtained from a getter instead of the state.
     *
     * @public
     */
    @State('querySuggestions', 'query')
    public query!: string;

    /**
     * The suggestion to render.
     *
     * @public
     */
    @Prop({ required: true })
    protected suggestion!: Suggestion;

    /**
     * Emits {@link XEventsTypes.UserSelectedAQuerySuggestion} with the suggestion as payload when
     * selecting the query suggestion.
     *
     * @internal
     */
    protected event: Partial<XEventsTypes> = {
      UserSelectedAQuerySuggestion: this.suggestion
    };
  }
</script>

<docs>
  #Example

  The query suggestion component expects to receive a suggestion as a prop. When clicked, emits a
  UserSelectedAQuerySuggestion event.

  ```vue
  <QuerySuggestion :suggestion="suggestion" />
  ```

  With an icon overriding the default slot, which has binded the suggestion and the
  suggestionQueryHighlighted.

  ```vue
  <QuerySuggestion :suggestion="suggestion">
    <template #default="{ suggestion, suggestionQueryHighlighted }">
      <img src="./query-suggestion-icon.svg" class="x-query-suggestion__icon" />
      <span v-html="suggestionQueryHighlighted" class="x-query-suggestion__query" />
    </template>
  </QuerySuggestion>
  ```
</docs>
