<template>
  <button ref="rootRef" data-test="event-button" @click="emitEvents">
    <!-- @slot (Required) Button content with a text, an icon or both -->
    <slot />
  </button>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { XEvent, XEventsTypes } from '../wiring/events.types'
import type { WireMetadata } from '../wiring/index'
import { defineComponent, ref } from 'vue'
import { use$x } from '../composables/use-$x'

/**
 * Component to be reused that renders a `<button>` with the logic of emitting events to the bus
 * on click. The events are passed as an object to prop {@link XEvent}.
 * The keys are the event name and the values are the payload of each event. All events are
 * emitted with its respective payload. If any event doesn't need payload a `undefined` must be
 * passed as value.
 *
 * @public
 */
export default defineComponent({
  name: 'BaseEventButton',
  props: {
    /** An object where the keys are the {@link XEvent} and the values are the payload. */
    events: {
      type: Object as PropType<Partial<XEventsTypes>>,
      required: true,
    },
    /**
     * The metadata property for the request on each query preview.
     *
     * @public
     */
    metadata: {
      type: Object as PropType<Omit<WireMetadata, 'moduleName'>>,
    },
  },
  setup(props) {
    const $x = use$x()

    const rootRef = ref<HTMLButtonElement>()

    /**
     * Emits `events` prop to the X bus with the payload given by it.
     */
    function emitEvents() {
      Object.entries(props.events).forEach(([event, payload]) =>
        $x.emit(event as XEvent, payload, { target: rootRef.value, ...props.metadata }),
      )
    }

    return {
      emitEvents,
      rootRef,
    }
  },
})
</script>

<docs lang="mdx">
## Examples

### Basic example

The event prop is required. It will render a <button></button> that emits the event passed as prop
with the value as payload on click:

```vue
<template>
  <BaseEventButton :events="{ myEvent: payload }" />
</template>

<script setup>
import { BaseEventButton } from '@empathyco/x-components'
const payload = { foo: 'bar' }
</script>
```

If the event doesn't need payload then `undefined` must be passed:

```vue
<template>
  <BaseEventButton :events="{ myEvent: undefined }" />
</template>

<script setup>
import { BaseEventButton } from '@empathyco/x-components'
</script>
```

It can emit multiple events at the same time:

```vue
<template>
  <BaseEventButton :events="{ myFirstEvent: payload1, mySecondEvent: payload2 }" />
</template>

<script setup>
import { BaseEventButton } from '@empathyco/x-components'
const payload1 = { foo: 1 }
const payload2 = { bar: 2 }
</script>
```
</docs>
