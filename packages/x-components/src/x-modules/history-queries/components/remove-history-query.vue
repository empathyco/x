<template>
  <BaseEventButton
    class="x-remove-history-query"
    :events="removeHistoryQueryEvent"
    aria-label="remove"
  >
    <!--  @slot (Required) Button content with a text, an icon or both -->
    <slot />
  </BaseEventButton>
</template>

<script lang="ts">
import type { HistoryQuery } from '@empathyco/x-types'
import type { PropType } from 'vue'
import type { XEventsTypes } from '../../../wiring/events.types'
import { computed, defineComponent } from 'vue'
import BaseEventButton from '../../../components/base-event-button.vue'
import { historyQueriesXModule } from '../x-module'

/**
 * Button that when it is pressed emits the
 * {@link HistoryQueriesXEvents.UserPressedRemoveHistoryQuery} event, expressing the user
 * intention to remove a query in the history.
 *
 * @public
 */
export default defineComponent({
  name: 'RemoveHistoryQuery',
  xModule: historyQueriesXModule.name,
  components: {
    BaseEventButton,
  },
  props: {
    /**
     * The historyQuery that will be removed when clicking the clear button.
     *
     * @public
     */
    historyQuery: {
      type: Object as PropType<HistoryQuery>,
      required: true,
    },
  },
  setup(props) {
    /**
     * The event handler that will be triggered when clicking on the clear history query button.
     *
     * @remarks
     * {@link HistoryQueriesXEvents.UserPressedRemoveHistoryQuery}: historyQuery
     *
     * @returns The {@link XEvent} to emit.
     * @public
     */
    const removeHistoryQueryEvent = computed(
      (): Partial<XEventsTypes> => ({ UserPressedRemoveHistoryQuery: props.historyQuery }),
    )

    return {
      removeHistoryQueryEvent,
    }
  },
})
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`UserPressedRemoveHistoryQuery`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the button. The event payload is the history query
  data.

## Examples

### Basic Example

You can customize the content that this component renders. To do so, simply use the default slot.

```vue
<template>
  <RemoveHistoryQuery :historyQuery="historyQuery">
    <img class="x-history-query__icon" src="./my-awesome-clear-icon.svg" />
  </RemoveHistoryQuery>
</template>

<script setup>
import { RemoveHistoryQuery } from '@empathyco/x-components/history-queries'
import { ref } from 'vue'

const historyQuery = ref({
  modelName: 'HistoryQuery',
  query: 'trousers',
  facets: [],
})
</script>
```
</docs>
