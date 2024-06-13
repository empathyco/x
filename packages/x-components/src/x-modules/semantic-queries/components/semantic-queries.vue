<template>
  <NoElement v-if="suggestions.length">
    <!-- eslint-disable max-len -->
    <!--
      @slot Semantic Query content
        @binding {string[]} queries - SemanticQueries mapped to strings
        @binding {SemanticQuery[]} suggestions - The SemanticQueries
        @binding {(query: string) => SemanticQuery} findSemanticQuery - Method to find a semantic query given a query
    -->
    <!-- eslint-enable max-len -->
    <slot name="default" v-bind="{ queries, suggestions, findSemanticQuery }">
      <BaseSuggestions
        v-bind="$attrs"
        class="x-semantic-queries"
        :suggestions="suggestions"
        #default="baseSuggestionsScope"
      >
        <!-- eslint-disable max-len -->
        <!--
          @slot Semantic Query content
              @binding {{suggestion: object - Suggestion data, index: number - Suggestion index}} v-bind BaseSuggestion bindings
        -->
        <!-- eslint-enable max-len -->
        <slot name="suggestion" v-bind="baseSuggestionsScope">
          <SemanticQuery
            :suggestion="baseSuggestionsScope.suggestion"
            #default="baseSuggestionScope"
          >
            <!-- eslint-disable max-len -->
            <!--
              @slot Semantic Query content
                  @binding {{suggestion: object - Suggestion data, query: string - The query that the suggestion belongs to}} v-bind SemanticQuery bindings
            -->
            <!-- eslint-enable max-len -->
            <slot name="suggestion-content" v-bind="baseSuggestionScope" />
          </SemanticQuery>
        </slot>
      </BaseSuggestions>
    </slot>
  </NoElement>
</template>

<script lang="ts">
  import { computed, ComputedRef, defineComponent } from 'vue';
  import { SemanticQuery as SemanticQueryModel } from '@empathyco/x-types';
  import { semanticQueriesXModule } from '../x-module';
  import { NoElement } from '../../../components/no-element';
  import BaseSuggestions from '../../../components/suggestions/base-suggestions.vue';
  import { useState } from '../../../composables/use-state';
  import SemanticQuery from './semantic-query.vue';

  /**
   * Retrieves a list of semantic queries from the state and exposes them in the slots.
   *
   * @public
   */
  export default defineComponent({
    name: 'SemanticQueries',
    xModule: semanticQueriesXModule.name,
    components: { BaseSuggestions, NoElement, SemanticQuery },
    inheritAttrs: false,
    setup() {
      /** The semantic queries from the state. */
      const suggestions: ComputedRef<SemanticQueryModel[]> = useState('semanticQueries', [
        'semanticQueries'
      ]).semanticQueries;

      /**
       * Maps the list of semantic queries to a list of queries, to make it compatible with
       * other components.
       */
      const queries = computed(() => suggestions.value.map(suggestion => suggestion.query));

      /**
       * Finds a {@link @empathyco/x-types#SemanticQuery} given a query.
       *
       * @param query - The query to search.
       * @returns The {@link @empathyco/x-types#SemanticQuery} or undefined if not found.
       */
      const findSemanticQuery = (query: string) =>
        suggestions.value.find(suggestion => suggestion.query === query);

      return { suggestions, queries, findSemanticQuery };
    }
  });
</script>

<docs lang="mdx">
## Events

This component doesn't emit events.

## See it in action

By default, the `SemanticQueries` component will render a list of semantic queries.

```vue
<template>
  <SemanticQueries />
</template>

<script>
  import { SemanticQueries } from '@empathyco/x-components/semantic-queries';

  export default {
    name: 'SemanticQueriesDemo',
    components: {
      SemanticQueries
    }
  };
</script>
```

### Play with props

The component has the following props:

- maxItemsToRender to limit the number of semantic queries to render.
- animation to specify the animation to be used to animate the semantic queries.

```vue live
<template>
  <SemanticQueries :animation="animation" :maxItemsToRender="3" />
</template>

<script>
  import { FadeAndSlide } from '@empathyco/x-components';

  export default {
    name: 'SemanticQueriesPropsDemo',
    data() {
      return {
        animation: FadeAndSlide
      };
    }
  };
</script>
```

### Play with the default slot

The default slot is used to overwrite the whole content of the component.

```vue live
<template>
  <SemanticQueries #default="{ suggestions }">
    <section>
      <SlidingPanel>
        <div v-for="suggestion in suggestions">
          {{ suggestion.query }}
          {{ suggestion.distance }}
        </div>
      </SlidingPanel>
    </section>
  </SemanticQueries>
</template>

<script>
  import { SemanticQueries } from '@empathyco/x-components/semantic-queries';
  import { SlidingPanel } from '@empathyco/x-components';

  export default {
    name: 'SemanticQueriesDefaultSlotDemo',
    components: {
      SemanticQueries,
      SlidingPanel
    }
  };
</script>
```

The default slot also exposes an array of semantic queries mapped to strings, and a method to find a
semantic query given a string query.

This is useful if you need an array of string queries, but also need to retrieve the original
semantic query to use it in another element.

```vue live
<template>
  <SemanticQueries #default="{ queries, findSemanticQuery }">
    <section>
      <QueryPreviewList :queries="queries" #slot="{ query, results }">
        <div>
          <SemanticQuery :semanticQuery="findSemanticQuery(query)" #default="{ query }">
            {{ query.query }} ({{ query.distance }})
          </SemanticQuery>
          <ul>
            <li v-for="result in results" :key="result.id">
              {{ result.name }}
            </li>
          </ul>
        </div>
      </QueryPreviewList>
    </section>
  </SemanticQueries>
</template>

<script>
  import { SemanticQueries, SemanticQuery } from '@empathyco/x-components/semantic-queries';
  import { QueryPreviewList } from '@empathyco/x-components/queries-preview';

  export default {
    name: 'SemanticQueriesDefaultSlotDemo2',
    components: {
      SemanticQueries,
      SemanticQuery,
      QueryPreviewList
    }
  };
</script>
```

### Play with the suggestion slot

The suggestion slot can be used to override each semantic query item.

In this example, the query will be rendered along with the distance.

```vue live
<template>
  <SemanticQueries #suggestion="{ suggestion: { query, distance } }">
    <span>
      ({{ distance }})
      {{ query }}
    </span>
  </SemanticQueries>
</template>

<script>
  import { SemanticQueries } from '@empathyco/x-components/semantic-queries';
  export default {
    name: 'SemanticQueriesItemSlotDemo',
    components: {
      SemanticQueries
    }
  };
</script>
```

### Play with the suggestion content slot

The suggsetion content slot can be used to override only the content, but keep using the
SemanticQuery component internally.

```vue live
<template>
  <SemanticQueries #suggestion-content="{ suggestion: { query, distance } }">
    <span>
      ({{ distance }})
      {{ query }}
    </span>
  </SemanticQueries>
</template>

<script>
  import { SemanticQueries } from '@empathyco/x-components/semantic-queries';
  export default {
    name: 'SemanticQueriesItemSlotDemo',
    components: {
      SemanticQueries
    }
  };
</script>
```
</docs>
