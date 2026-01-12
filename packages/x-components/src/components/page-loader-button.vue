<template>
  <div class="x-page-loader" data-test="page-loader">
    <!--
      @slot default
          @binding {number} resultsLength - The search result's length
          @binding {number} totalResults - The totalResults of a searched query
      -->
    <slot v-bind="{ resultsLength, totalResults }">
      <!-- @slot Rendered count with a text and the number of results displayed & remaining. -->
      <slot name="textContent" :results-length="resultsLength" :total-results="totalResults">
        <p class="x-page-loader__text-content" data-test="text-content">
          You are seeing {{ resultsLength }} of {{ totalResults }} results
        </p>
      </slot>
      <BaseEventButton
        class="xds:button"
        :class="buttonClasses"
        :events="events"
        data-test="load-content"
        aria-label="Load"
      >
        <!-- @slot Button content with a text, an icon or both -->
        <slot name="buttonContent">Load</slot>
      </BaseEventButton>
    </slot>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { VueCSSClasses } from '../utils/types'
import type { XEventsTypes } from '../wiring'
import { computed, defineComponent } from 'vue'
import { use$x } from '../composables'
import BaseEventButton from './base-event-button.vue'

/**
 * Component that renders a text with the number of rendered results and
 * the remaining ones and a `<BaseEventButton>` with the logic of emitting
 * the event "UserReachedResultsListEnd" to load more results on click.
 *
 * @public
 */
export default defineComponent({
  name: 'PageLoaderButton',
  components: { BaseEventButton },
  props: {
    /**
     * CSS classes to customize the loader button.
     *
     * @internal
     */
    buttonClasses: {
      type: String as PropType<VueCSSClasses>,
      default: '',
    },
    /**
     * Events to customize what will be emitted by the loader button.
     *
     * @internal
     */
    buttonEvents: {
      type: Object as PropType<Partial<XEventsTypes>>,
    },
  },
  setup(props) {
    const $x = use$x()
    const resultsLength = computed(() => $x.results.length)
    const totalResults = computed(() => $x.totalResults)

    /**
     * The events that will be emitted when clicking on the loader button.
     *
     * @returns The {@link XEvent} to emit.
     * @public
     */
    const events = computed<Partial<XEventsTypes>>(() => {
      return { UserReachedResultsListEnd: undefined, ...props.buttonEvents }
    })

    return {
      resultsLength,
      totalResults,
      events,
    }
  },
})
</script>

<style scoped>
.x-page-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 0;
}

.x-page-loader__text-content {
  padding: 16px 0;
}
</style>

<docs lang="mdx">
## Events

This component emits the "UserReachedResultsListEnd" event by default. This can be changed using the
buttonEvents prop:

```vue live
<template>
  <PageLoaderButton :buttonEvents="{ UserClickedCloseX: undefined }" />
</template>

<script>
import { PageLoaderButton } from '@empathyco/x-components'

export default {
  name: 'PageLoaderButtonDemo',
  components: {
    PageLoaderButton,
  },
}
</script>
```

## See it in action

Here you have a basic example of how the page loader component is rendered.

```vue live
<template>
  <PageLoaderButton />
</template>

<script>
import { PageLoaderButton } from '@empathyco/x-components'

export default {
  name: 'PageLoaderButtonDemo',
  components: {
    PageLoaderButton,
  },
}
</script>
```

### Customise the default layout

This component has a default slot which allows to customise the entire layout.

```vue live
<template>
  <PageLoaderButton>
    <template #default="{ resultsLength, totalResults }">
      <div class="xds:flex xds:flex-col">
        <div class="xds:flex xds:gap-4 xds:text">
          <span class="xds:text-accent-50 xds:font-bold">{{ resultsLength }}</span>
          <span>of</span>
          <span class="xds:text-accent-50">{{ totalResults }}</span>
        </div>
        <button
          @click="$x.emit('UserReachedResultsListEnd', undefined)"
          class="xds:button xds:button-ghost"
        >
          Load more
        </button>
      </div>
    </template>
  </PageLoaderButton>
</template>

<script>
import { PageLoaderButton } from '@empathyco/x-components'

export default {
  name: 'PageLoaderButtonDemo',
  components: {
    PageLoaderButton,
  },
}
</script>
```

### Customise the slots

This component allows to customise both the textContent and the buttonContent slots. The
textContent's slot layout can be replaced entirely, while the buttonContent's slot enables wrapping
content inside and customizing its style using the buttonClasses prop.

```vue live
<template>
  <PageLoaderButton :buttonClasses="buttonClasses">
    <template #textContent="{ resultsLength, totalResults }">
      <div class="xds:flex xds:gap-4 xds:text">
        <span class="xds:text-accent-50 xds:font-bold">{{ resultsLength }}</span>
        <span>of</span>
        <span class="xds:text-accent-50">{{ totalResults }}</span>
      </div>
    </template>
    <template #buttonContent>Load more results</template>
  </PageLoaderButton>
</template>

<script>
import { PageLoaderButton } from '@empathyco/x-components'

export default {
  name: 'PageLoaderButtonDemo',
  components: {
    PageLoaderButton,
  },
  data() {
    return {
      buttonClasses: 'xds:rounded-full',
    }
  },
}
</script>
```
</docs>
