<template>
  <button
    ref="partialButtonEl"
    class="x-partial-query-button xds:button"
    data-test="partial-query-button"
    @click="emitEvents"
  >
    <slot v-bind="{ query }">{{ query }}</slot>
  </button>
</template>

<script lang="ts">
import type { WireMetadata } from '../../../wiring/wiring.types'
import { defineComponent, ref } from 'vue'
import { use$x } from '../../../composables/use-$x'
import { searchXModule } from '../x-module'

/**
 * A button that when pressed emits the {@link XEventsTypes.UserAcceptedAQuery}
 * and {@link SearchXEvents.UserClickedPartialQuery} events, expressing the user
 * intention to set the partial query.
 *
 * @public
 */
export default defineComponent({
  name: 'PartialQueryButton',
  xModule: searchXModule.name,
  props: {
    /**
     * The query property.
     *
     * @public
     */
    query: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const $x = use$x()

    const partialButtonEl = ref<HTMLElement>()

    /**
     * Generates the {@link WireMetadata} object omitting the moduleName.
     *
     * @returns The {@link WireMetadata} object omitting the moduleName.
     * @internal
     */
    const createEventMetadata = (): Omit<WireMetadata, 'moduleName'> => ({
      target: partialButtonEl.value,
      feature: 'partial_result',
    })

    /**
     * Emits events when the button is clicked.
     *
     * @public
     */
    const emitEvents = () => {
      $x.emit('UserAcceptedAQuery', props.query, createEventMetadata())
      $x.emit('UserClickedPartialQuery', props.query, createEventMetadata())
    }

    return {
      partialButtonEl,
      emitEvents,
    }
  },
})
</script>

<docs lang="mdx">
## Events

This component emits 2 different events:

- [`UserAcceptedAQuery`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the partial query. The event payload is the partial
  query data.
- [`UserClickedPartialQuery`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the partial query. The event payload is the partial
  query data.

## Examples

### Basic example

A button that when pressed emits the `XEventsTypes.UserAcceptedAQuery` and
`SearchXEvents.UserClickedPartialQuery` events, expressing the user intention to set the partial
query.

The component sets the current query as the new query and emits the `UserAcceptedAQuery` and
`UserClickedPartialQuery` events when is clicked.

```vue
<template>
  <PartialQueryButton :query="query" />
</template>
```

### Customizing its contents

```vue
<template>
  <PartialQueryButton>
    <template #default="{ query }">
      <span class="x-partial-query-button__text">
        Set the Partial query as the new query: {{ query }}!
      </span>
    </template>
  </PartialQueryButton>
</template>

<script>
import { PartialQueryButton } from '@empathyco/x-components/search'

export default {
  components: {
    PartialQueryButton,
  },
}
</script>
```
</docs>
