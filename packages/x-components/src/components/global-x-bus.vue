<script lang="ts">
import type { PropType } from 'vue'
import type { XEvent } from '../wiring/events.types'
import type { XEventListeners } from '../x-installer/api/api.types'
import { defineComponent } from 'vue'
import { useXBus } from '../composables/use-x-bus'

/**
 * This component helps to subscribe to any {@link XEvent} with custom callbacks using Vue
 * listeners API.
 *
 * @public
 */
export default defineComponent({
  name: 'GlobalXBus',
  props: {
    listeners: {
      type: Object as PropType<XEventListeners>,
      required: true,
    },
  },
  setup(props) {
    const xBus = useXBus()

    /**
     * Handles a subscription to all the events provided in the listeners with the function that
     * will execute the callback.
     */
    Object.entries(props.listeners as XEventListeners).forEach(([eventName, callback]) => {
      xBus.on(eventName as XEvent, true).subscribe(({ eventPayload, metadata }) => {
        callback(eventPayload as never, metadata)
      })
    })

    return () => ''
  },
})
</script>

<docs lang="mdx">
## Events

This component emits no own events, but you can subscribe to any X Event using Vue listeners

## See it in action

This component does not render anything. Its only responsibility is to facilitate listening to any X
Event by using the prop `listeners`

```vue
<template>
  <GlobalXBus :listeners="{ UserAcceptedAQuery: printQuery }" />
</template>

<script setup>
import { GlobalXBus } from '@empathyco/x-components'
function printQuery(query, metadata) {
  console.log('My new query is:', query)
  console.log('And has been triggered by this DOM element:', metadata.target)
}
</script>
```
</docs>
