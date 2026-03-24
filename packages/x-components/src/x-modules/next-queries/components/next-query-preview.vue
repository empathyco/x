<template>
  <ul v-if="suggestionResults" data-test="next-query-preview" class="x-next-query-preview">
    <!--
      @slot Next Query Preview default slot.
          @binding {NextQuery} suggestion - Next Query suggestion data
          @binding {Result[]} results - The results preview of the next query
          @binding {number} totalResults - The total results of the search request
    -->
    <slot
      :suggestion="suggestion"
      :results="suggestionResults.items"
      :total-results="suggestionResults.totalResults"
    >
      <li
        v-for="result in suggestionResults.items"
        :key="result.id"
        class="x-next-query-preview__item"
        data-test="next-query-preview-item"
      >
        <!--
          @slot Next Query Preview result slot.
              @binding {Result} result - A Next Query Preview result
        -->
        <slot name="result" :result="result">
          <span data-test="result-name">{{ result.name }}</span>
        </slot>
      </li>
    </slot>
  </ul>
</template>

<script lang="ts">
import type { NextQuery, PreviewResults } from '@empathyco/x-types'
import type { PropType } from 'vue'
import { computed, defineComponent, onMounted } from 'vue'
import { use$x } from '../../../composables/use-$x'
import { useState } from '../../../composables/use-state'
import { nextQueriesXModule } from '../x-module'

/**
 * Retrieves a preview of the results of a next query and exposes them in the default slot,
 * along with the next query and the totalResults of the search request.
 * By default, it renders the names of the results.
 *
 * @public
 */
export default defineComponent({
  name: 'NextQueryPreview',
  xModule: nextQueriesXModule.name,
  props: {
    /**
     * The next query to retrieve the results preview.
     *
     * @public
     */
    suggestion: {
      type: Object as PropType<NextQuery>,
      required: true,
    },
    /**
     * Number of suggestion results to be rendered.
     *
     * @public
     */
    maxItemsToRender: Number,
  },
  setup(props) {
    const $x = use$x()
    /**
     * The results preview of the next queries mounted.
     * It is a dictionary, indexed by the next query query.
     */
    const { resultsPreview } = useState('nextQueries')

    /**
     * The component emits the NextQueryPreviewMountedHook event to retrieve the results preview
     * of the next query.
     */
    onMounted(() => $x.emit('NextQueryPreviewMountedHook', props.suggestion.query))

    /**
     * Gets from the state the results preview of the next query.
     *
     * @returns The results preview of the actual next query.
     */
    const suggestionResults = computed((): PreviewResults | undefined => {
      const previewResults = resultsPreview.value[props.suggestion.query] as PreviewResults

      return previewResults
        ? {
            ...previewResults,
            items: previewResults.items.slice(0, props.maxItemsToRender),
          }
        : undefined
    })

    return { suggestionResults }
  },
})
</script>

<docs lang="mdx">
## Events

This component emits the
[`NextQueryPreviewMountedHook`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)
when it is mounted.

## See it in action

Here you have a basic example of how the NextQueryPreview is rendered. Keep in mind that this
component is intended to be used overriding its default slot. By default it will only render the
names of the results.

```vue live
<template>
  <NextQueryPreview :suggestion="suggestion" />
</template>

<script setup>
import { NextQueryPreview } from '@empathyco/x-components/next-queries'
import { ref } from 'vue'

const suggestion = ref({
  modelName: 'NextQuery',
  query: 'tshirt',
  facets: [],
})
</script>
```

### Play with the default slot

In this example, the results will be rendered inside a sliding panel.

```vue live
<template>
  <NextQueryPreview :suggestion="suggestion" #default="{ totalResults, results }">
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
  </NextQueryPreview>
</template>

<script setup>
import { NextQueryPreview } from '@empathyco/x-components/next-queries'
import { SlidingPanel, BaseResultLink, BaseResultImage } from '@empathyco/x-components'
import { ref } from 'vue'

const suggestion = ref({
  modelName: 'NextQuery',
  query: 'tshirt',
  facets: [],
})
</script>
```

### Play with the result slot

The component exposes a slot to override the result content, without modifying the list.

In this example, the ID of the results will be rendered along with the name.

```vue
<template>
  <NextQueryPreview :suggestion="suggestion" #result="{ result }">
    <span>{{ result.id }}</span>
    <span>{{ result.name }}</span>
  </NextQueryPreview>
</template>

<script setup>
import { NextQueryPreview } from '@empathyco/x-components/next-queries'
import { ref } from 'vue'

const suggestion = ref({
  modelName: 'NextQuery',
  query: 'tshirt',
  facets: [],
})
</script>
```

### Play with props

In this example, the suggestions have been limited to render a maximum of 4 items.

```vue
<template>
  <NextQueryPreview
    :maxItemsToRender="maxItemsToRender"
    :suggestion="suggestion"
    #default="{ results }"
  >
    <BaseGrid #default="{ item }" :items="results">
      <BaseResultLink :result="item">
        <BaseResultImage :result="item" />
      </BaseResultLink>
    </BaseGrid>
  </NextQueryPreview>
</template>

<script setup>
import { BaseGrid, BaseResultImage, BaseResultLink } from '@empathyco/x-components'
import { NextQueryPreview } from '@empathyco/x-components/next-queries'
import { ref } from 'vue'

const maxItemsToRender = ref(4)
const suggestion = ref({
  modelName: 'NextQuery',
  query: 'tshirt',
  facets: [],
})
</script>
```
</docs>
