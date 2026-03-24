<template>
  <BaseSuggestion
    v-slot="baseScope"
    v-bind="{ query, suggestion, suggestionSelectedEvents }"
    class="x-query-suggestion"
    data-test="query-suggestion"
    feature="query_suggestion"
  >
    <!-- eslint-disable max-len -->
    <!--
        @slot Query Suggestion content
          @binding {Object} v-bind - `BaseSuggestion` default slot scope: **suggestion** <code>Suggestion</code> - Suggestion data<br /> **query** <code>string</code> - The query that the suggestion belongs to<br /> **filter** <code>Filter \| undefined</code> - Suggestion's filter
    -->
    <!-- eslint-enable max-len -->
    <slot v-bind="{ ...baseScope }" />
  </BaseSuggestion>
</template>

<script lang="ts">
import type { Suggestion } from '@empathyco/x-types'
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import BaseSuggestion from '../../../components/suggestions/base-suggestion.vue'
import { useGetter } from '../../../composables'
import { querySuggestionsXModule } from '../x-module'

/**
 * This component renders a suggestion for a query. A query suggestion is a recommended query
 * based on previous search queries. It contains the query itself and a set of filters associated.
 * For example, if you're searching for _shirt_, a query suggestion could be _long sleeve shirt_.
 *
 * @public
 */
export default defineComponent({
  name: 'QuerySuggestion',
  xModule: querySuggestionsXModule.name,
  components: { BaseSuggestion },
  props: {
    /** The suggestion to render. */
    suggestion: {
      type: Object as PropType<Suggestion>,
      required: true,
    },
  },
  setup(props) {
    /** The normalized query of the query-suggestions module. */
    const query = useGetter('querySuggestions').normalizedQuery

    /**
     * Emits {@link QuerySuggestionsXEvents.UserSelectedAQuerySuggestion} with the suggestion as
     * payload when selecting the query suggestion.
     */
    const suggestionSelectedEvents = {
      UserSelectedAQuerySuggestion: props.suggestion,
    }

    return {
      query,
      suggestionSelectedEvents,
    }
  },
})
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`UserSelectedAQuerySuggestion`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the button. The event payload is the query suggestion
  data.

## See it in action

<!-- prettier-ignore-start -->
:::warning Backend microservice required
To use this component, the <b>Empathize</b> microservice must be
implemented.
:::
<!-- prettier-ignore-end -->

Here you can see how a single query suggestion is rendered using the `suggestion` prop.

```vue live
<template>
  <QuerySuggestion :suggestion="suggestion" />
</template>

<script setup>
import { QuerySuggestion } from '@empathyco/x-components/query-suggestions'
import { ref } from 'vue'
const suggestion = ref({
  modelName: 'QuerySuggestion',
  query: 'tshirt',
  facets: [],
})
</script>
```

### Play with default slot

In this example, we are adding an emoji next to the suggestion.

```vue live
<template>
  <QuerySuggestion :suggestion="suggestion" #default="{ suggestion }">
    <span>🔍</span>
    <span>{{ suggestion.query }}</span>
  </QuerySuggestion>
</template>

<script setup>
import { QuerySuggestion } from '@empathyco/x-components/query-suggestions'
import { ref } from 'vue'
const suggestion = ref({
  modelName: 'QuerySuggestion',
  query: 'tshirt',
  facets: [],
})
</script>
```

### Play with events

In this example, when you click on the query suggestion, a message is displayed to illustrate that
the `UserSelectedAQuerySuggestion` event has been triggered.

```vue live
<template>
  <QuerySuggestion :suggestion="suggestion" @UserSelectedAQuerySuggestion="alertSuggestion" />
</template>

<script setup>
import { QuerySuggestion } from '@empathyco/x-components/query-suggestions'
import { ref } from 'vue'
const suggestion = ref({
  modelName: 'QuerySuggestion',
  query: 'tshirt',
  facets: [],
})
function alertSuggestion(querySuggestion) {
  alert(`You have clicked the query suggestion: ${querySuggestion.query}`)
}
</script>
```
</docs>
