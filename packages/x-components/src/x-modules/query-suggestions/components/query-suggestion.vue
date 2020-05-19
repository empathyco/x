<template>
  <BaseSuggestion
    v-bind="{ query, suggestion, suggestionSelectedEvents: event }"
    :aria-label="suggestion.query"
    class="x-query-suggestion"
    data-test="query-suggestion"
  >
    <template #default="{ suggestion, queryHTML }">
      <!-- @slot Default slot with the suggestion and the queryHTML to customise the output -->
      <!-- @binding {Suggestion} suggestion - The data of the suggestion -->
      <!-- @binding {string} queryHTML - The suggestion's query with the matching part inside a
      <span> tag -->
      <slot v-bind="{ suggestion, queryHTML }" />
    </template>
  </BaseSuggestion>
</template>

<script lang="ts">
  import { Suggestion } from '@empathy/search-types';
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import BaseSuggestion from '../../../components/base-suggestion.vue';
  import { Getter } from '../../../components/decorators';
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
     * The normalized query of the query-suggestions module.
     *
     * @public
     */
    @Getter('querySuggestions', 'normalizedQuery')
    public query!: string;

    /**
     * The suggestion to render.
     *
     * @public
     */
    @Prop({ required: true })
    protected suggestion!: Suggestion;

    /**
     * Emits {@link QuerySuggestionsXEvents.UserSelectedAQuerySuggestion} with the suggestion as
     * payload when selecting the query suggestion.
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
  <QuerySuggestion :suggestion="suggestion"/>
  ```

  With an icon overriding the default slot, which has binded the suggestion and the
  queryHTML.

  ```vue
  <QuerySuggestion :suggestion="suggestion">
    <template #default="{ suggestion, queryHTML }">
      <img src="./query-suggestion-icon.svg" class="x-query-suggestion__icon"/>
      <span v-html="queryHTML" class="x-query-suggestion__query"/>
    </template>
  </QuerySuggestion>
  ```
</docs>
