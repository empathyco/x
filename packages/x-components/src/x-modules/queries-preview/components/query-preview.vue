<template>
  <!-- eslint-disable-next-line vue/no-unused-refs -->
  <section ref="queryPreviewElement" class="x-query-preview-wrapper__default-content">
    <ul v-if="hasResults" data-test="query-preview" class="x-query-preview">
      <li
        v-for="result in queryPreviewResults?.results"
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
  </section>
</template>

<script lang="ts">
import type { Filter, SearchRequest } from '@empathyco/x-types'
import type { PropType, Ref } from 'vue'
import type { FeatureLocation, QueryFeature } from '../../../types'
import type { DebouncedFunction } from '../../../utils'
import type { QueryPreviewInfo } from '../store/types'
import { deepEqual } from '@empathyco/x-utils'
import { computed, defineComponent, h, inject, onBeforeUnmount, provide, ref, watch } from 'vue'
import { LIST_ITEMS_KEY } from '../../../components'
import { useOnDisplay, useState, useXBus } from '../../../composables'
import { createOrigin, createRawFilters, debounceFunction } from '../../../utils'
import { getHashFromQueryPreviewInfo } from '../utils/get-hash-from-query-preview'
import { queriesPreviewXModule } from '../x-module'

/**
 * Retrieves a preview of the results of a query and exposes them in the default slot,
 * along with the query preview and the totalResults of the search request.
 * By default, it renders the names of the results.
 *
 * @public
 */
export default defineComponent({
  name: 'QueryPreview',
  xModule: queriesPreviewXModule.name,
  props: {
    /** The information about the request of the query preview. */
    queryPreviewInfo: {
      type: Object as PropType<QueryPreviewInfo>,
      required: true,
    },
    /** The origin property for the request. */
    queryFeature: {
      type: String as PropType<QueryFeature>,
    },
    /** Number of query preview results to be rendered. */
    maxItemsToRender: {
      type: Number,
    },
    /**
     * Controls whether the query preview requests should be triggered when the component is visible in the viewport.
     */
    loadWhenVisible: {
      type: Boolean,
      default: false,
    },
    /**
     * Debounce time in milliseconds for triggering the search requests.
     * It will default to 0 to fit the most common use case (pre-search),
     * and it would work properly with a 250 value inside empathize.
     */
    debounceTimeMs: {
      type: Number,
      default: 0,
    },
    /**
     * Controls whether the QueryPreview should be removed from the state
     * when the component is destroyed.
     */
    persistInCache: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['load', 'error'],
  setup(props, { emit, slots }) {
    const xBus = useXBus()

    /**
     * previewResults: The results preview of the queries preview cacheable mounted.
     * It is a dictionary, indexed by the query preview query.
     *
     * params: As the request is handled in this component, we need
     * the extra params that will be used in the request.
     *
     * config: As the request is handled in this component, we need
     * the config that will be used in the request.
     */
    const { queriesPreview: previewResults, params, config } = useState('queriesPreview')

    /**
     * Template ref for the root element to track visibility.
     */
    const queryPreviewElement = ref<HTMLElement | null>(null)

    /**
     * Query Preview key converted into a unique id.
     *
     * @returns The query hash.
     */
    const queryPreviewHash = computed(() =>
      getHashFromQueryPreviewInfo(props.queryPreviewInfo, {
        ...params.value,
        ...props.queryPreviewInfo.extraParams,
      }),
    )

    provide('queryPreviewHash', queryPreviewHash)

    /**
     * Gets from the state the results preview of the query preview.
     *
     * @returns The results preview of the actual query preview.
     */
    const queryPreviewResults = computed(() => {
      const resultsPreview = previewResults.value[queryPreviewHash.value]
      return resultsPreview?.results
        ? {
            ...resultsPreview,
            results: resultsPreview.results.slice(0, props.maxItemsToRender),
          }
        : undefined
    })

    /**
     * The results to render from the state.
     *
     * @remarks The results list are provided with `items` key. It can be
     * concatenated with list items from components such as `BannersList`, `PromotedsList`,
     * `BaseGrid` or any component that injects the list.
     *
     * @returns A list of results.
     */
    const results = computed(() => queryPreviewResults.value?.results)
    provide(LIST_ITEMS_KEY as string, results)

    /**
     * It injects the provided {@link FeatureLocation} of the selected query in the search request.
     *
     * @internal
     */
    const injectedLocation = inject<Ref<FeatureLocation> | FeatureLocation>('location', 'none')
    const location =
      typeof injectedLocation === 'object' && 'value' in injectedLocation
        ? injectedLocation.value
        : injectedLocation

    /**
     * The computed request object to be used to retrieve the query preview results.
     *
     * @returns The search request object.
     */
    const queryPreviewRequest = computed<SearchRequest>(() => {
      const origin = createOrigin({
        feature: props.queryFeature,
        location,
      })
      const filters = props.queryPreviewInfo.filters?.reduce(
        (filtersList, filterId) => {
          const facetId = filterId.split(':')[0]
          const rawFilter = createRawFilters([filterId])[0]
          filtersList[facetId] = filtersList[facetId]
            ? filtersList[facetId].concat(rawFilter)
            : [rawFilter]

          return filtersList
        },
        {} as Record<string, Filter[]>,
      )

      return {
        query: props.queryPreviewInfo.query,
        rows: config.value.maxItemsToRequest,
        extraParams: {
          ...params.value,
          ...props.queryPreviewInfo.extraParams,
        },
        filters,
        ...(origin && { origin }),
      }
    })

    /**
     * The debounce method to trigger the request after the debounceTimeMs defined
     * for cacheable queries.
     *
     * @returns The search request object.
     */
    const emitQueryPreviewRequestUpdated = computed<DebouncedFunction<[SearchRequest]>>(() =>
      debounceFunction(request => {
        xBus.emit('QueryPreviewRequestUpdated', request, { priority: 0, replaceable: false })
      }, props.debounceTimeMs),
    )

    /**
     * Initialises watcher to emit debounced requests, and first value for the requests.
     *
     * @internal
     */
    watch(queryPreviewRequest, (newRequest, oldRequest) => {
      if (!deepEqual(newRequest, oldRequest) && !props.loadWhenVisible) {
        emitQueryPreviewRequestUpdated.value(newRequest)
      }
    })

    const cachedQueryPreview = previewResults.value[queryPreviewHash.value]

    // If the query has been saved it will emit load instead of the emitting the updated request.
    if (cachedQueryPreview?.status === 'success') {
      emit('load', queryPreviewHash.value)
      xBus.emit('QueryPreviewMounted', queryPreviewHash.value, {
        priority: 0,
        replaceable: false,
      })
    } else if (!props.loadWhenVisible) {
      emitQueryPreviewRequestUpdated.value(queryPreviewRequest.value)
    }

    /**
     * Watch element visibility and emit request when it becomes visible for the first time
     * (only when loadWhenVisible is true).
     */
    const { unwatchDisplay } = useOnDisplay({
      element: queryPreviewElement,
      callback: () => {
        if (props.loadWhenVisible && cachedQueryPreview?.status !== 'success') {
          emitQueryPreviewRequestUpdated.value(queryPreviewRequest.value)
        }
      },
    })

    /**
     * Cancels the (remaining) requests when the component is destroyed
     * via the `debounce.cancel()` method.
     * If the prop 'persistInCache' is set to false, it also removes the QueryPreview
     * from the state when the component is destroyed.
     */
    onBeforeUnmount(() => {
      unwatchDisplay?.()
      emitQueryPreviewRequestUpdated.value.cancel()
      xBus.emit(
        'QueryPreviewUnmounted',
        { queryPreviewHash: queryPreviewHash.value, cache: props.persistInCache },
        {
          priority: 0,
          replaceable: false,
        },
      )
    })

    /**
     * Cancels the previous request when the debounced function changes (e.g: the debounceTimeMs
     * prop changes or there is a request in progress that cancels it).
     *
     * @param _new - The new debounced function.
     * @param old - The previous debounced function.
     * @internal
     */
    watch(
      emitQueryPreviewRequestUpdated,
      (_new: DebouncedFunction<[SearchRequest]>, old: DebouncedFunction<[SearchRequest]>) => {
        old.cancel()
      },
    )

    const queryPreviewResultsStatus = computed(() => queryPreviewResults.value?.status)

    /**
     * Emits an event when the query results are loaded or fail to load.
     *
     * @param status - The status of the query preview request.
     */
    watch(queryPreviewResultsStatus, () => {
      if (queryPreviewResultsStatus.value === 'success') {
        emit(results.value?.length ? 'load' : 'error', queryPreviewHash.value)
      } else if (queryPreviewResultsStatus.value === 'error') {
        emit('error', queryPreviewHash.value)
      }
    })

    const hasResults = computed(() => (queryPreviewResults.value?.totalResults ?? 0) > 0)

    /**
     * Render function to execute the `default` slot, binding `slotsProps` and getting only the
     * first `vNode` to avoid Fragments and Text root nodes.
     *
     * @remarks `slotProps` must be values without Vue reactivity and located inside the
     * render-function to update the binding data properly.
     *
     * @returns The root `vNode` of the `default` slot or empty string if there are no results. Always wrapped in a section
     * element with the `x-query-preview-wrapper__slot-content` class.
     */
    function renderDefaultSlot() {
      const slotProps = {
        queryPreviewInfo: props.queryPreviewInfo,
        results: queryPreviewResults.value?.results,
        totalResults: queryPreviewResults.value?.totalResults,
        displayTagging: queryPreviewResults.value?.displayTagging,
        queryTagging: queryPreviewResults.value?.queryTagging,
      }

      const slotContent = hasResults.value ? slots.default?.(slotProps)[0] : ''

      return h(
        'section',
        { ref: queryPreviewElement, class: 'x-query-preview-wrapper__slot-content' },
        [slotContent],
      )
    }

    /* Hack to render through a render-function, the `default` slot or, in its absence,
       the component itself. It is the alternative for the NoElement antipattern. */
    const componentProps = { hasResults, queryPreviewResults, queryPreviewElement }
    return (slots.default ? renderDefaultSlot : componentProps) as typeof componentProps
  },
})
</script>
<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`QueryPreviewRequestUpdated`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted when the component is mounted and when the properties of the request object
  changes. The event payload is the `queryPreviewRequest` object.

## Vue Events

A list of vue events that the component will emit:

- `load`: the event is emitted when the query results have been loaded.
- `error`: the event is emitted if there is some error when retrieving the query results.

## See it in action

Here you have a basic example of how the QueryPreview is rendered. Keep in mind that this component
is intended to be used overriding its default slot. By default it will only render the names of the
results.

```vue live
<template>
  <QueryPreview :queryPreviewInfo="queryPreviewInfo" />
</template>

<script setup>
import { QueryPreview } from '@empathyco/x-components/queries-preview'
import { reactive } from 'vue'
const queryPreviewInfo = reactive({ query: 'sandals' })
</script>
```

### Play with the default slot

In this example, the results will be rendered inside a sliding panel.

```vue live
<template>
  <QueryPreview :queryPreviewInfo="queryPreviewInfo" #default="{ totalResults, results }">
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

<script setup>
import { QueryPreview } from '@empathyco/x-components/queries-preview'
import { BaseResultImage, BaseResultLink, SlidingPanel } from '@empathyco/x-components'
import { reactive } from 'vue'
const queryPreviewInfo = reactive({ query: 'flip-flops' })
</script>
```

### Play with the result slot

The component exposes a slot to override the result content, without modifying the list.

In this example, the ID of the results will be rendered along with the name.

```vue
<template>
  <QueryPreview :queryPreviewInfo="queryPreviewInfo" #result="{ result }">
    <span>{{ result.id }}</span>
    <span>{{ result.name }}</span>
  </QueryPreview>
</template>

<script setup>
import { QueryPreview } from '@empathyco/x-components/queries-preview'
import { reactive } from 'vue'
const queryPreviewInfo = reactive({ query: 'flip-flops' })
</script>
```

### Play with props

In this example, the query preview has been limited to render a maximum of 4 results.

```vue
<template>
  <QueryPreview
    :maxItemsToRender="maxItemsToRender"
    :queryPreviewInfo="queryPreviewInfo"
    #default="{ results }"
  >
    <BaseGrid #default="{ item }" :items="results">
      <BaseResultLink :result="item">
        <BaseResultImage :result="item" />
      </BaseResultLink>
    </BaseGrid>
  </QueryPreview>
</template>

<script setup>
import { BaseGrid, BaseResultImage, BaseResultLink } from '@empathyco/x-components'
import { QueryPreview } from '@empathyco/x-components/queries-preview'
import { reactive } from 'vue'
const maxItemsToRender = 4
const queryPreviewInfo = reactive({ query: 'flip-flops' })
</script>
```
</docs>
