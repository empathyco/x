<template>
  <NoElement v-if="semanticQueries.length">
    <slot name="default" v-bind="{ queries, semanticQueries, findSemanticQuery }">
      <ul class="x-semantic-queries">
        <li
          v-for="semanticQuery in semanticQueries"
          :key="semanticQuery.query"
          data-test="semantic-query-item"
        >
          <slot name="item" :query="semanticQuery">
            <SemanticQuery :suggestion="semanticQuery" #default="{ suggestion }">
              <slot name="item-content" :query="suggestion">
                {{ suggestion.query }} - {{ suggestion.distance }}
              </slot>
            </SemanticQuery>
          </slot>
        </li>
      </ul>
    </slot>
  </NoElement>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { SemanticQuery as SemanticQueryModel } from '@empathyco/x-types';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { semanticQueriesXModule } from '../x-module';
  import { NoElement } from '../../../components/no-element';
  import { State } from '../../../components';
  import SemanticQuery from './semantic-query.vue';

  /**
   * Retrieves a list of semantic queries from the state and exposes them in the slots.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(semanticQueriesXModule)],
    components: { SemanticQuery, NoElement }
  })
  export default class SemanticQueries extends Vue {
    /**
     * The semantic queries from the state.
     */
    @State('semanticQueries', 'semanticQueries')
    public semanticQueries!: SemanticQueryModel[];

    /**
     * Maps the list of semantic queries to a list of queries, to make it compatible with
     * other components.
     *
     * @returns A list of queries.
     * @internal
     */
    public get queries(): string[] {
      return this.$x.semanticQueries.map(semanticQuery => semanticQuery.query);
    }

    /**
     * Finds a {@link @empathyco/x-types#SemanticQuery} given a query.
     *
     * @param query - The query to search.
     * @returns The {@link @empathyco/x-types#SemanticQuery} or undefined if not found.
     */
    findSemanticQuery(query: string): SemanticQueryModel | undefined {
      return this.semanticQueries.find(semanticQuery => semanticQuery.query === query);
    }
  }
</script>

<docs lang="mdx">
## Events

This component doesn't emit events.

## See it in action

Here you have a basic example of how the `SemanticQueries` component is rendered. Keep in mind that
this component is intended to be used overriding one of its slots, by default it will only render a
list of queries with their distance.

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

### Play with the default slot

The default slot is used to overwrite the whole content of the component.

In this example, the `QueryPreviewList` component will be used to retrieve the results of the
queries and display them.

```vue live
<template>
  <SemanticQueries #default="{ queries }">
    <section>
      <QueryPreviewList :queries="queries" #default="{ query, results }">
        <div
          class="x-flex x-flex-col x-gap-8 x-mb-16"
          data-test="semantic-query-preview"
          :data-query="query"
        >
          <h1 class="x-title2" data-test="semantic-queries-query">{{ query }}</h1>
          <SlidingPanel :resetOnContentChange="false">
            <article
              v-for="result in results"
              :key="result.id"
              class="x-result"
              style="max-width: 300px; overflow: hidden"
            >
              <BaseResultLink :result="result">
                <BaseResultImage :result="result" class="x-result__picture" />
              </BaseResultLink>
              <div class="x-result__description">
                <BaseResultLink :result="result">
                  <h1 class="x-title3">{{ result.name }}</h1>
                </BaseResultLink>
              </div>
            </article>
          </SlidingPanel>
        </div>
      </QueryPreviewList>
    </section>
  </SemanticQueries>
</template>

<script>
  import { SemanticQueries } from '@empathyco/x-components/semantic-queries';
  import { QueryPreviewList } from '@empathyco/x-components/queries-preview';
  import { SlidingPanel, BaseResultImage, BaseResultLink } from '@empathyco/x-components';

  export default {
    name: 'SemanticQueriesDefaultSlotDemo',
    components: {
      SemanticQueries,
      QueryPreviewList,
      SlidingPanel,
      BaseResultImage,
      BaseResultLink
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

### Play with the item slot

The item slot can be used to override each semantic query item.

In this example, the query will be rendered along with the distance.

```vue live
<template>
  <SemanticQueries #item="{ query: { query, distance } }">
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

### Play with the item content slot

The item content slot can be used to override only the content, but keep using the SemanticQuery
component internally.

```vue live
<template>
  <SemanticQueries #item-content="{ query: { query, distance } }">
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
