---
id: query-suggestions
title: Query Suggestions
sidebar_label: Query Suggestions
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { ReactQuerySuggestions, ReactSearchInput, ReactSearchButton, ReactClearSearchInput } from '../../../react-components/ReactComponents';
import { NextItem } from '../../../react-components/Utils';

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

 ## Up next

Ready for more? Continue reading with:

<NextItem color="#e77962" font="white" next="live-examples">Live Examples</NextItem>

