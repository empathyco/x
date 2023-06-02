<template>
  <NoElement v-if="$x.semanticQueries.length">
    <slot name="default" :queries="queries">
      <ul class="x-semantic-queries">
        <li
          v-for="semanticQuery in $x.semanticQueries"
          :key="semanticQuery.query"
          data-test="semantic-query-item"
        >
          <slot name="item" :query="semanticQuery">
            <SemanticQuery :suggestion="semanticQuery">
              {{ semanticQuery.query }} - {{ semanticQuery.distance }}
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
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { semanticQueriesXModule } from '../x-module';
  import { NoElement } from '../../../components/no-element';
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
     * Maps the list of semantic queries to a list of queries, to make it compatible with
     * other components.
     *
     * @returns A list of queries.
     * @internal
     */
    protected get queries(): string[] {
      return this.$x.semanticQueries.map(semanticQuery => semanticQuery.query);
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

### Play with the item slot

The item slot can be used to override only the content of each semantic query item.

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
</docs>
