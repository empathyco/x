<template>
  <ul>
    <li v-for="query in renderedQueries" :key="query" data-test="query-preview-item">
      <QueryPreview @load="flagAsLoaded" @error="flagAsFailed" v-bind="$attrs" :query="query">
        <template v-for="(_, slotName) in $scopedSlots" v-slot:[slotName]="scope">
          <slot :name="slotName" v-bind="scope" />
        </template>
      </QueryPreview>
    </li>
  </ul>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop, Watch } from 'vue-property-decorator';
  import StaggeredFadeAndSlide from '../../../components/animations/staggered-fade-and-slide.vue';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { RequestStatus } from '../../../store';
  import { queriesPreviewXModule } from '../x-module';
  import QueryPreview from './query-preview.vue';

  interface QueryPreviewStatusRecord {
    [query: string]: RequestStatus;
  }

  /**
   * Retrieves a preview of the results of a query and exposes them in the default slot,
   * along with the query preview and the totalResults of the search request.
   * By default, it renders the names of the results.
   *
   * @public
   */
  @Component({
    inheritAttrs: false,
    components: {
      QueryPreview,
      StaggeredFadeAndSlide
    },
    mixins: [xComponentMixin(queriesPreviewXModule)]
  })
  export default class QueryPreviewList extends Vue {
    @Prop({ required: true })
    public queries!: string[];
    public queriesStatus: QueryPreviewStatusRecord = {};

    protected get renderedQueries(): string[] {
      return this.queries.filter(
        query => this.queriesStatus[query] === 'success' || this.queriesStatus[query] === 'loading'
      );
    }

    @Watch('queries', { immediate: true })
    protected resetStatusRecord(): void {
      this.queriesStatus = {};
      this.loadNext();
    }

    protected flagAsLoaded(loadedQuery: string): void {
      this.queriesStatus[loadedQuery] = 'success';
      this.loadNext();
    }

    protected flagAsFailed(failedQuery: string): void {
      this.queriesStatus[failedQuery] = 'error';
      this.loadNext();
    }

    protected loadNext(): void {
      const queryToLoad = this.queries.find(query => !(query in this.queriesStatus));
      if (queryToLoad) {
        this.$set(this.queriesStatus, queryToLoad, 'loading');
      }
    }
  }
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- `QueryPreviewRequestChanged`: the event is emitted when the component is mounted and when the
  properties of the request object changes. The event payload is the `queryPreviewRequest` object.

## See it in action

Here you have a basic example of how the QueryPreview is rendered. Keep in mind that this component
is intended to be used overriding its default slot. By default it will only render the names of the
results.

```vue live
<template>
  <QueryPreview :query="query" />
</template>

<script>
  import { QueryPreview } from '@empathyco/x-components/queries-preview';

  export default {
    name: 'QueryPreviewDemo',
    components: {
      QueryPreview
    },
    data() {
      return {
        query: 'sandals'
      };
    }
  };
</script>
```

### Play with the default slot

In this example, the results will be rendered inside a sliding panel.

```vue live
<template>
  <QueryPreview :query="query" #default="{ totalResults, results }">
    <section>
      <p>Total results: {{ totalResults }}</p>

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
    </section>
  </QueryPreview>
</template>

<script>
  import { QueryPreview } from '@empathyco/x-components/queries-preview';
  import { BaseResultImage, BaseResultLink, SlidingPanel } from '@empathyco/x-components';

  export default {
    name: 'QueryPreviewDemoOverridingSlot',
    components: {
      BaseResultImage,
      BaseResultLink,
      QueryPreview,
      SlidingPanel
    },
    data() {
      return {
        query: 'flip-flops'
      };
    }
  };
</script>
```

### Play with the result slot

The component exposes a slot to override the result content, without modifying the list.

In this example, the ID of the results will be rendered along with the name.

```vue
<template>
  <QueryPreview :query="query" #result="{ result }">
    <span>{{ result.id }}</span>

    <span>{{ result.name }}</span>
  </QueryPreview>
</template>

<script>
  import { QueryPreview } from '@empathyco/x-components/queries-preview';

  export default {
    name: 'QueryPreviewDemoOverridingResultSlot',
    components: {
      QueryPreview
    },
    data() {
      return {
        query: 'flips-flops'
      };
    }
  };
</script>
```

### Play with props

In this example, the query preview has been limited to render a maximum of 4 results.

```vue
<template>
  <QueryPreview :maxItemsToRender="maxItemsToRender" :query="query" #default="{ results }">
    <BaseGrid #default="{ item }" :items="results">
      <BaseResultLink :result="item">
        <BaseResultImage :result="item" />
      </BaseResultLink>
    </BaseGrid>
  </QueryPreview>
</template>

<script>
  import { BaseGrid, BaseResultImage, BaseResultLink } from '@empathyco/x-components';
  import { QueryPreview } from '@empathyco/x-components/queries-preview';

  export default {
    name: 'QueryPreviewDemo',
    components: {
      BaseGrid,
      BaseResultImage,
      BaseResultLink,
      QueryPreview
    },
    data() {
      return {
        maxItemsToRender: 4,
        query: 'flips-flops'
      };
    }
  };
</script>
```
</docs>
