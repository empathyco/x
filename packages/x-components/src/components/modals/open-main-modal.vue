<template>
  <BaseEventsModalOpen
    class="x-open-main-modal"
    data-test="open-main-modal"
    :opening-event="openingEvent"
  >
    <slot />
  </BaseEventsModalOpen>
</template>

<script lang="ts">
import type { XEvent } from '../../wiring/events.types'
import { defineComponent } from 'vue'
import BaseEventsModalOpen from './base-events-modal-open.vue'

/**
 * Button to open the {@link MainModal}.
 *
 * @public
 */
export default defineComponent({
  components: {
    BaseEventsModalOpen,
  },
  setup() {
    /**
     * Event to be emitted to open the {@link MainModal}.
     *
     * @internal
     */
    const openingEvent: XEvent = 'UserClickedOpenX'

    return {
      openingEvent,
    }
  },
})
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`UserClickedOpenX`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)

## Example

A basic example of how the open main modal button works:

```vue live
<template>
  <OpenMainModal>Open X</OpenMainModal>
  <MainModal>
    <CloseMainModal>Close X</CloseMainModal>
  </MainModal>
</template>

<script setup>
import { MainModal, CloseMainModal, OpenMainModal } from '@empathyco/x-components'
</script>
```
</docs>
