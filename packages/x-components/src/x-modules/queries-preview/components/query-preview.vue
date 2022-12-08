<template>
  <NoElement v-if="queryPreviewResults && queryPreviewResults.totalResults">
    <!--
      @slot Query Preview default slot.
          @binding {string} query - query
          @binding {Result[]} results - The results preview of the query preview
          @binding {number} totalResults - The total results of the search request
    -->
    <slot
      :query="query"
      :results="queryPreviewResults.results"
      :totalResults="queryPreviewResults.totalResults"
    >
      <ul data-test="query-preview" class="x-query-preview">
        <li
          v-for="result in queryPreviewResults.results"
          :key="result.id"
          class="x-query-preview__item"
          data-test="query-preview-item"
        >
          <!--
          @slot Query Preview result slot.
              @binding {Result} result - A Query Preview result
        -->
          <slot name="result" :result="result">
            <span data-test="result-name">{{ result.name }}</span>
          </slot>
        </li>
      </ul>
    </slot>
  </NoElement>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop, Inject, Watch } from 'vue-property-decorator';
  import { Dictionary } from '@empathyco/x-utils';
  import { SearchRequest, Result } from '@empathyco/x-types';
  import { State } from '../../../components/decorators/store.decorators';
  import { LIST_ITEMS_KEY } from '../../../components/decorators/injection.consts';
  import { XProvide } from '../../../components/decorators/injection.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { NoElement } from '../../../components/no-element';
  import { QueryFeature, FeatureLocation } from '../../../types/origin';
  import { QueryPreviewItem } from '../store/types';
  import { QueriesPreviewConfig } from '../config.types';
  import { queriesPreviewXModule } from '../x-module';
  import { createOrigin } from '../../../utils/origin';
  import { debounce } from '../../../utils/debounce';
  import { DebouncedFunction } from '../../../utils';

  /**
   * Retrieves a preview of the results of a query and exposes them in the default slot,
   * along with the query preview and the totalResults of the search request.
   * By default, it renders the names of the results.
   *
   * @public
   */
  @Component({
    components: {
      NoElement
    },
    mixins: [xComponentMixin(queriesPreviewXModule)]
  })
  export default class QueryPreview extends Vue {
    /**
     * The query to retrieve the results preview.
     *
     * @public
     */
    @Prop({
      required: true
    })
    protected query!: string;

    /**
     * The origin property for the request.
     *
     * @public
     */
    @Prop()
    protected queryFeature?: QueryFeature;

    /**
     * Number of query preview results to be rendered.
     *
     * @public
     */
    @Prop()
    protected maxItemsToRender?: number;

    /**
     * Debounce time in milliseconds for triggering the search requests.
     * It will default to 0 to fit the most common use case (pre-search),
     * and it would work properly with a 250 value inside empathize.
     */
    @Prop({ default: 0 })
    public debounceTimeMs!: number;

    /**
     * The results preview of the queries preview mounted.
     * It is a dictionary, indexed by the query preview query.
     */
    @State('queriesPreview', 'queriesPreview')
    public previewResults!: Dictionary<QueryPreviewItem>;

    /**
     * As the request is handled in this component, we need
     * the extra params that will be used in the request.
     */
    @State('queriesPreview', 'params')
    public params!: Dictionary<unknown>;

    /**
     * As the request is handled in this component, we need
     * the config that will be used in the request.
     */
    @State('queriesPreview', 'config')
    public config!: QueriesPreviewConfig;

    /**
     * The results to render from the state.
     *
     * @remarks The results list are provided with `items` key. It can be
     * concatenated with list items from components such as `BannersList`, `PromotedsList`,
     * `BaseGrid` or any component that injects the list.
     *
     * @returns A list of results.
     * @public
     */
    @XProvide(LIST_ITEMS_KEY)
    public get results(): Result[] | undefined {
      return this.queryPreviewResults?.results;
    }

    /**
     * It injects the provided {@link FeatureLocation} of the selected query in the search request.
     *
     * @internal
     */
    @Inject({ default: undefined })
    protected location?: FeatureLocation;

    /**
     * The computed request object to be used to retrieve the query preview results.
     *
     * @returns The search request object.
     * @internal
     */
    protected get queryPreviewRequest(): SearchRequest {
      const origin = createOrigin({
        feature: this.queryFeature,
        location: this.location
      });

      return {
        query: this.query,
        rows: this.config.maxItemsToRequest,
        extraParams: this.params,
        ...(origin && { origin })
      };
    }

    /**
     * The debounce method to trigger the request after the debounceTimeMs defined.
     *
     * @returns The search request object.
     * @internal
     */
    protected get emitQueryPreviewRequestChanged(): DebouncedFunction<[SearchRequest]> {
      return debounce(request => {
        this.$x.emit('QueryPreviewRequestChanged', request);
      }, this.debounceTimeMs);
    }

    /**
     * Initialises watcher to emit debounced requests, and first value for the requests.
     *
     * @internal
     */
    protected created(): void {
      this.$watch(
        () => this.queryPreviewRequest,
        request => this.emitQueryPreviewRequestChanged(request)
      );
      this.emitQueryPreviewRequestChanged(this.queryPreviewRequest);
    }

    /**
     * Cancels the (remaining) requests when the component is destroyed
     * via the `debounce.cancel()` method.
     *
     * @internal
     */
    protected beforeDestroy(): void {
      this.emitQueryPreviewRequestChanged.cancel();
    }

    /**
     * Cancels the previous request when the debounced function changes (e.g: the debounceTimeMs
     * prop changes or there is a request in progress that cancels it).
     *
     * @param _new - The new debounced function.
     * @param old - The previous debounced function.
     * @internal
     */
    @Watch('emitQueryPreviewRequestChanged')
    protected cancelEmitPreviewRequestChanged(
      _new: DebouncedFunction<[SearchRequest]>,
      old: DebouncedFunction<[SearchRequest]>
    ): void {
      old.cancel();
    }

    /**
     * Gets from the state the results preview of the query preview.
     *
     * @returns The results preview of the actual query preview.
     */
    public get queryPreviewResults(): Partial<QueryPreviewItem> | undefined {
      const previewResults = this.previewResults[this.query];
      return previewResults?.results
        ? {
            totalResults: previewResults.totalResults,
            results: previewResults.results.slice(0, this.maxItemsToRender)
          }
        : undefined;
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
