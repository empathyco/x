<template>
  <component :is="animation" class="x-query-preview-list" tag="ul">
    <li
      v-for="(queryPreview, index) in renderedQueryPreviews"
      :key="index"
      data-test="query-preview-item"
    >
      <QueryPreview
        :debounce-time-ms="debounceTimeMs"
        :load-when-visible="loadWhenVisible"
        :max-items-to-render="maxItemsToRender"
        :persist-in-cache="persistInCache"
        :query-feature="queryFeature"
        :query-preview-info="queryPreview"
        @load="flagAsLoaded"
        @error="flagAsFailed"
      >
        <template v-for="(_, slotName) in $slots" #[slotName]="scope">
          <slot :name="slotName" v-bind="scope" />
        </template>
      </QueryPreview>
    </li>
  </component>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { RequestStatus } from '../../../store'
import type { QueryFeature } from '../../../types'
import type { QueryPreviewInfo } from '../store/types'
import { computed, defineComponent, ref, watch } from 'vue'
import { useState } from '../../../composables/index'
import { AnimationProp } from '../../../types'
import { getHashFromQueryPreviewInfo } from '../utils/get-hash-from-query-preview'
import { queriesPreviewXModule } from '../x-module'
import QueryPreview from './query-preview.vue'

interface QueryPreviewStatusRecord {
  [query: string]: RequestStatus
}

/**
 * Renders the results previews of a list of objects with the information about the query preview,
 * and exposes the {@link QueryPreview} slots to modify the content.
 * The requests are made in sequential order.
 *
 * @public
 */
export default defineComponent({
  name: 'QueryPreviewList',
  xModule: queriesPreviewXModule.name,
  components: { QueryPreview },
  props: {
    /**
     * The list of queries preview to render.
     *
     * @public
     */
    queriesPreviewInfo: {
      type: Array as PropType<QueryPreviewInfo[]>,
      required: true,
    },
    /**
     * The origin property for the request on each query preview.
     *
     * @public
     */
    queryFeature: {
      type: String as PropType<QueryFeature>,
    },
    /**
     * Number of query preview results to be rendered on each query preview.
     *
     * @public
     */
    maxItemsToRender: {
      type: Number,
    },
    /**
     * Controls whether the query preview requests should be triggered when the component is visible in the viewport.
     *
     * @public
     */
    loadWhenVisible: {
      type: Boolean,
      default: false,
    },
    /**
     * Debounce time in milliseconds for triggering the search requests
     * on each query preview.
     *
     * It will default to 0 to fit the most common use case (pre-search),
     * and it would work properly with a 250 value inside empathize.
     */
    debounceTimeMs: {
      type: Number,
      default: 0,
    },
    /**
     * Controls whether all the QueryPreview should be removed from the state
     * when the component is destroyed.
     *
     * @public
     */
    persistInCache: Boolean,
    /**
     * Animation component that will be used to animate the elements.
     *
     * @public
     */
    animation: {
      type: AnimationProp,
      default: 'ul',
    },
  },
  setup(props) {
    const { params } = useState('queriesPreview')

    /**
     * Contains the status of the preview requests, indexed by query.
     */
    const queriesStatus = ref<QueryPreviewStatusRecord>({})

    /**
     * The list of queries to preview.
     *
     * @returns The list of queries in the queriesPreviewInfo list.
     * @internal
     */
    const queries = computed((): string[] =>
      props.queriesPreviewInfo.map(item =>
        getHashFromQueryPreviewInfo(item, { ...params.value, ...item.extraParams }),
      ),
    )

    /**
     * Gets all the queries to render, that are those that don't have an `error` status.
     *
     * @returns A list of queries.
     * @internal
     */
    const renderedQueryPreviews = computed((): QueryPreviewInfo[] => {
      return props.queriesPreviewInfo.filter(item => {
        const queryPreviewHash = getHashFromQueryPreviewInfo(item, {
          ...params.value,
          ...item.extraParams,
        })
        return (
          queriesStatus.value[queryPreviewHash] === 'success' ||
          queriesStatus.value[queryPreviewHash] === 'loading'
        )
      })
    })

    /**
     * Tries to load the next query.
     *
     * @internal
     */
    const loadNext = (): void => {
      const queryToLoad = queries.value.find(query => !(query in queriesStatus.value))
      if (queryToLoad) {
        queriesStatus.value[queryToLoad] = 'loading'
      }
    }

    /**
     * Resets the status of all queries if they change.
     *
     * @param newQueries - The new queries.
     * @param oldQueries - The old queries.
     * @internal
     */
    watch(
      queries,
      (newQueries: string[], oldQueries: string[] | undefined) => {
        if (newQueries.toString() !== oldQueries?.toString()) {
          for (const key of Object.keys(queriesStatus.value)) {
            if (!newQueries.includes(key)) {
              delete queriesStatus.value[key]
            }
          }
          loadNext()
        }
      },
      { immediate: true, deep: true },
    )

    /**
     * Sets the status of a given query to `success`.
     *
     * @param loadedQuery - The query to flag as loaded.
     * @internal
     */
    const flagAsLoaded = (loadedQuery: string): void => {
      queriesStatus.value[loadedQuery] = 'success'
      loadNext()
    }

    /**
     * Sets the status of a given query to `error`.
     *
     * @param failedQuery - The query to flag as failed.
     * @internal
     */
    const flagAsFailed = (failedQuery: string): void => {
      queriesStatus.value[failedQuery] = 'error'
      loadNext()
    }

    return {
      renderedQueryPreviews,
      flagAsFailed,
      flagAsLoaded,
    }
  },
})
</script>

<docs lang="mdx">
## See it in action

Here you have a basic example of how the QueryPreviewList is rendered. Keep in mind that this
component is intended to be used overriding its default slot. By default it will only render the
names of the results.

```vue live
<template>
  <QueryPreviewList :queriesPreviewInfo="queriesPreviewInfo" />
</template>

<script setup>
import { QueryPreviewList } from '@empathyco/x-components/queries-preview'
import { reactive } from 'vue'
const queriesPreviewInfo = reactive([
  { query: 'sandals' },
  { query: 'tshirt' },
  { query: 'jacket' },
])
</script>
```

### Play with the default slot

In this example, the results will be rendered inside a sliding panel.

```vue live
<template>
  <QueryPreviewList
    :queriesPreviewInfo="queriesPreviewInfo"
    #default="{ queryPreviewInfo, totalResults, results }"
  >
    <div class="x-flex x-flex-col x-gap-8 x-mb-16">
      <h1 class="x-title2">{{ queryPreviewInfo.query }} ({{ totalResults }})</h1>
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

<script setup>
import { QueryPreviewList } from '@empathyco/x-components/queries-preview'
import SlidingPanel from '@empathyco/x-components/sliding-panel.vue'
import Result from '@empathyco/x-components/result.vue'
import { reactive } from 'vue'
const queriesPreviewInfo = reactive([
  { query: 'sandals' },
  { query: 'tshirt' },
  { query: 'jacket' },
])
</script>
```

### Play with the result slot

The component exposes a slot to override the result content, without modifying the list.

In this example, the ID of the results will be rendered along with the name.

```vue
<template>
  <QueryPreviewList
    class="x-flex x-gap-8"
    :queriesPreviewInfo="queriesPreviewInfo"
    #result="{ result }"
  >
    <span class="x-font-bold">{{ result.id }}:</span>
    <span>{{ result.name }}</span>
  </QueryPreviewList>
</template>

<script setup>
import { QueryPreviewList } from '@empathyco/x-components/queries-preview'
import { reactive } from 'vue'
const queriesPreviewInfo = reactive([
  { query: 'sandals' },
  { query: 'tshirt' },
  { query: 'jacket' },
])
</script>
```
</docs>
