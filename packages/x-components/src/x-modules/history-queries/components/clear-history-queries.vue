<template>
  <BaseEventButton
    class="x-clear-history-queries xds:button"
    :class="dynamicClasses"
    :disabled="isHistoryQueriesEmpty"
    :events="clearHistoryQueriesEvents"
    data-test="clear-history-queries"
    aria-label="Clear all"
  >
    <!-- @slot (Required) Button content with a message, an icon or both -->
    <slot>✕</slot>
  </BaseEventButton>
</template>

<script lang="ts">
import type { VueCSSClasses } from '../../../utils/types'
import type { XEventsTypes } from '../../../wiring/events.types'
import { computed, defineComponent } from 'vue'
import BaseEventButton from '../../../components/base-event-button.vue'
import { useState } from '../../../composables/use-state'
import { historyQueriesXModule } from '../x-module'

/**
 * A button that when is pressed, emits the
 * {@link HistoryQueriesXEvents.UserPressedClearHistoryQueries} event, expressing the user
 * intention to clear the whole history of queries.
 *
 * @public
 */
export default defineComponent({
  name: 'ClearHistoryQueries',
  xModule: historyQueriesXModule.name,
  components: {
    BaseEventButton,
  },
  setup() {
    /**
     * The whole history queries.
     *
     * @internal
     */
    const { historyQueries } = useState('historyQueries')

    /**
     * Returns if the array of history queries is empty.
     *
     * @returns `true` if the {@link historyQueries} array is empty, `false` otherwise.
     * @internal
     */
    const isHistoryQueriesEmpty = computed(() => historyQueries.value.length === 0)

    /**
     * Dynamic CSS classes to add to the root element of this component.
     *
     * @returns A booleans dictionary where each key is the class name to add, and the boolean value
     * tells if it should be added or not.
     * @internal
     */
    const dynamicClasses = computed(
      (): VueCSSClasses => ({
        'x-clear-history-queries--is-empty': isHistoryQueriesEmpty.value,
      }),
    )

    /**
     * The list of events that are going to be emitted when the button is pressed.
     *
     * @internal
     */
    const clearHistoryQueriesEvents: Partial<XEventsTypes> = {
      UserPressedClearHistoryQueries: undefined,
    }

    return {
      dynamicClasses,
      clearHistoryQueriesEvents,
      isHistoryQueriesEmpty,
    }
  },
})
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`UserPressedClearHistoryQueries`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the button.

## Examples

### Basic example

The component exposes a single default slot, where you can add icons or text.

```vue live
<template>
  <div>
    <SearchInput />
    <ClearHistoryQueries>Clear history queries</ClearHistoryQueries>
    <HistoryQueries :animation="'FadeAndSlide'" :maxItemsToRender="10" />
  </div>
</template>

<script>
import Vue from 'vue'
import { SearchInput } from '@empathyco/x-components/search-box'
import { HistoryQueries, ClearHistoryQueries } from '@empathyco/x-components/history-queries'
import { FadeAndSlide } from '@empathyco/x-components'

// Registering the animation as a global component
Vue.component('FadeAndSlide', FadeAndSlide)
export default {
  name: 'ClearHistoryQueriesDemo',
  components: {
    SearchInput,
    HistoryQueries,
    ClearHistoryQueries,
  },
}
</script>
```
</docs>
