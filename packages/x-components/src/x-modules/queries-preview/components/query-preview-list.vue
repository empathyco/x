<template>
  <component :is="animation" class="x-query-preview-list" tag="ul">
    <li v-for="(queryPreview, index) in renderedQueryPreviews" :key="index" data-test="query-preview-item">
      <QueryPreview
        @load="flagAsLoaded"
        @error="flagAsFailed"
        v-bind="$attrs"
        :queryPreviewInfo="queryPreview"
      >
        <template v-for="(_, slotName) in $scopedSlots" v-slot:[slotName]="scope">
          <slot :name="slotName" v-bind="scope" />
        </template>
      </QueryPreview>
    </li>
  </component>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop, Watch } from 'vue-property-decorator';
  import { Dictionary } from '@empathyco/x-utils';
  import StaggeredFadeAndSlide from '../../../components/animations/staggered-fade-and-slide.vue';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { RequestStatus } from '../../../store';
  import { queriesPreviewXModule } from '../x-module';
  import QueryPreview from './query-preview.vue';
  import {QueryPreviewInfo} from "../../../x-installer";

  interface QueryPreviewStatusRecord {
    [query: string]: RequestStatus;
  }

  /**
   * Renders the results previews of a list of queries, and exposes the {@link QueryPreview} slots
   * to modify the content.
   * The requests are made in sequential order.
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
    /**
     * Animation component that will be used to animate the elements.
     *
     * @public
     */
    @Prop({ default: 'ul' })
    public animation!: Vue | string;

    @Prop({required: true})
    public queriesPreviewInfo!: QueryPreviewInfo[];

    /**
     * Contains the status of the preview requests, indexed by query.
     */
    public queriesStatus: QueryPreviewStatusRecord = {};

    protected get queries(): string[] {
      return this.queriesPreviewInfo.map(item => item.query);
    }

    /**
     * Gets all the queries to render, that are those that don't have an `error` status.
     *
     * @returns A list of queries.
     * @internal
     */
    protected get renderedQueryPreviews(): QueryPreviewInfo[] {
      return this.queriesPreviewInfo.filter(
        ({ query }) => this.queriesStatus[query] === 'success' || this.queriesStatus[query] === 'loading'
      );
    }

    /**
     * Resets the status of all queries if they change.
     *
     * @internal
     */
    @Watch('queries', { immediate: true })
    protected resetStatusRecord(newQueries: string[], oldQueries: string[]): void {
      this.queriesStatus = {};
      this.loadNext();
    }

    /**
     * Sets the status of a given query to `success`.
     *
     * @param loadedQuery - The query to flag as loaded.
     * @internal
     */
    protected flagAsLoaded(loadedQuery: string): void {
      this.queriesStatus[loadedQuery] = 'success';
      this.loadNext();
    }

    /**
     * Sets the status of a given query to `error`.
     *
     * @param failedQuery - The query to flag as failed.
     * @internal
     */
    protected flagAsFailed(failedQuery: string): void {
      this.queriesStatus[failedQuery] = 'error';
      this.loadNext();
    }

    /**
     * Tries to load the next query.
     *
     * @internal
     */
    protected loadNext(): void {
      const queryToLoad = this.queries.find(query => !(query in this.queriesStatus));
      if (queryToLoad) {
        this.$set(this.queriesStatus, queryToLoad, 'loading');
      }
    }
  }
</script>

<docs lang="mdx">
## See it in action

Here you have a basic example of how the QueryPreviewList is rendered. Keep in mind that this
component is intended to be used overriding its default slot. By default it will only render the
names of the results.

```vue live
<template>
  <QueryPreviewList :queries="queries" />
</template>

<script>
  import { QueryPreviewList } from '@empathyco/x-components/queries-preview';

  export default {
    name: 'QueryPreviewListDemo',
    components: {
      QueryPreviewList
    },
    data() {
      return {
        queries: ['sandals', 'tshirt', 'jacket']
      };
    }
  };
</script>
```

### Play with the default slot

In this example, the results will be rendered inside a sliding panel.

```vue live
<template>
  <QueryPreviewList :queries="queries" #default="{ query, totalResults, results }">
    <div class="x-flex x-flex-col x-gap-8 x-mb-16">
      <h1 class="x-title2">{{ query }} ({{ totalResults }})</h1>
      <SlidingPanel :resetOnContentChange="false">
        <div class="x-flex x-gap-8">
          <Result
            v-for="result in results"
            :key="result.id"
            :result="result"
            style="max-width: 180px"
          />
        </div>
      </SlidingPanel>
    </div>
  </QueryPreviewList>
</template>

<script>
  import { QueryPreviewList } from '@empathyco/x-components/queries-preview';
  import { BaseResultImage, BaseResultLink, SlidingPanel } from '@empathyco/x-components';

  export default {
    name: 'QueryPreviewListDemoOverridingSlot',
    components: {
      BaseResultImage,
      BaseResultLink,
      QueryPreviewList,
      SlidingPanel
    },
    data() {
      return {
        queries: ['sandals', 'tshirt', 'jacket']
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
  <QueryPreviewList class="x-flex x-gap-8" :queries="queries" #result="{ result }">
    <span class="x-font-bold">{{ result.id }}:</span>
    <span>{{ result.name }}</span>
  </QueryPreviewList>
</template>

<script>
  import { QueryPreviewList } from '@empathyco/x-components/queries-preview';

  export default {
    name: 'QueryPreviewListDemoOverridingResultSlot',
    components: {
      QueryPreviewList
    },
    data() {
      return {
        queries: ['sandals', 'tshirt', 'jacket']
      };
    }
  };
</script>
```
</docs>
