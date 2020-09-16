<template>
  <BaseSuggestions
    :suggestions="suggestions"
    class="x-query-suggestions"
    data-test="query-suggestions"
    :animation="animation"
  >
    <template #default="{ suggestion, index }">
      <!--
        @slot Query Suggestion item
            @binding {Suggestion} suggestion - Query Suggestion data
            @binding {number} index - Query Suggestion index
      -->
      <slot name="suggestion" v-bind="{ suggestion, index }">
        <QuerySuggestion :suggestion="suggestion" class="x-query-suggestions__suggestion">
          <template #default="{ queryHTML }">
            <!-- eslint-disable max-len -->
            <!--
              @slot Query Suggestion content
                  @binding {Suggestion} suggestion - Query Suggestion data
                  @binding {string} queryHTML - Suggestion's query with the matching part inside a span tag
                  @binding {number} index - Query Suggestion index
            -->
            <!-- eslint-enable max-len -->
            <slot name="suggestion-content" v-bind="{ suggestion, index, queryHTML }" />
          </template>
        </QuerySuggestion>
      </slot>
    </template>
  </BaseSuggestions>
</template>

<script lang="ts">
  import { Suggestion } from '@empathy/search-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import BaseSuggestions from '../../../components/base-suggestions.vue';
  import { State } from '../../../components/decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { querySuggestionsXModule } from '../x-module';
  import QuerySuggestion from './query-suggestion.vue';

  /**
   * Simple query-suggestions component that renders a list of query suggestions.
   *
   * @remarks
   * A query suggestion is just a query that contains the user query, and that can have associated
   * a set of filters. I.e. If you are searching for `shirt`, a query suggestion could be
   * `long sleeve shirt`.
   *
   * @public
   */
  @Component({
    components: { BaseSuggestions, QuerySuggestion },
    mixins: [xComponentMixin(querySuggestionsXModule)]
  })
  export default class QuerySuggestions extends Vue {
    /**
     * The module's list of suggestions.
     *
     * @public
     */
    @State('querySuggestions', 'suggestions')
    public suggestions!: Suggestion[];

    /**
     * Animation component that will be used to animate the suggestions.
     *
     * @public
     */
    @Prop()
    protected animation!: Vue;
  }
</script>
<!--eslint-disable-->
<docs>
  import { ReactQuerySuggestions, ReactSearchInput } from '../react-components/ReactComponents';
  import { NextItem } from '../react-components/Utils';
  import Tabs from '@theme/Tabs';
  import TabItem from '@theme/TabItem';

  This component renders a list of query suggestions.
  A query suggestion is just a query that contains the user query and can have associated
  a set of filters. I.e. If you are searching for `shirt`, a query suggestion could be
  `long sleeve shirt`.

  ## Usage

  <Tabs
    defaultValue="vue"
    values={[
    {label: 'Vue', value: 'vue'}
  ]}>
  <TabItem value="vue">

    ```jsx
    <QuerySuggestions />
    ```

  </TabItem>
  </Tabs>


  ## Overriding slots

  ### Overriding Query Suggestion slot

  The default `QuerySuggestion` component that is used in every suggestion can be replaced.
  To do so, the `suggestion` slot is available, containing the query suggestion data under the
  `suggestion` property. Remember that if QuerySuggestion component isn't used, the
  `handleQuerySuggestionSelection` method needs to be implemented emitting the needed events.

  ```jsx
  <QuerySuggestions>
    <template #suggestion="{ suggestion }">
      <img class="x-query-suggestion__icon" src="./query-suggestion-extra-icon.svg"/>
      <QuerySuggestion :suggestion="suggestion"/>
    </template>
  </QuerySuggestions>
  ```

  ### Overriding Query Suggestion's content slot

  The content of the `QuerySuggestion` component can be overridden. For replacing the default
  suggestion content, the `suggestion-content` slot is available, containing the query suggestion
  data (in the `suggestion` property), and the matching query part HTML (in the
  `queryHTML` property).

  ```jsx
  <QuerySuggestions>
    <template #suggestion-content="{ suggestion, queryHTML }">
      <img class="x-query-suggestion__icon" src="./query-suggestion-icon.svg"/>
      <span
        :aria-label="`Select ${suggestion.query}`"
        class="x-query-suggestion__query"
        v-html="queryHTML"
      />
    </template>
  </QuerySuggestions>
  ```

  ## Used with other components

  If you want to use this component with another one, you can add other components and they will communicate with each other.

  This example shows how the query suggestions communicates with the `Search Input`:

  <Tabs
    defaultValue="live"
    values={[
    {label: 'Vue', value: 'vue'},
    {label: 'Live', value: 'live'}
  ]}>
  <TabItem value="vue">

    ```jsx
    <SearchInput />
    <QuerySuggestions />
    ```

  </TabItem>
    <TabItem value="live">
    <ReactSearchInput></ReactSearchInput><ReactQuerySuggestions />
  </TabItem>
  </Tabs>


  ## Up next

  Ready for more? Continue reading with:

  <NextItem color="#e77962" font='white' next="x-components.nextqueries">Next queries</NextItem>

  ---
  id: x-components.querysuggestions
  title: Query Suggestions
  sidebar_label: Query Suggestions
  ---
</docs>
