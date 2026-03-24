<template>
  <BaseEventsModalClose
    class="x-close-main-modal"
    data-test="close-main-modal"
    :closing-event="closingEvent"
  >
    <slot />
  </BaseEventsModalClose>
</template>

<script lang="ts">
import type { XEvent } from '../../wiring/events.types'
import { defineComponent } from 'vue'
import BaseEventsModalClose from './base-events-modal-close.vue'

/**
 * Button to close the {@link MainModal}.
 *
 * @public
 */
export default defineComponent({
  components: {
    BaseEventsModalClose,
  },
  setup() {
    /**
     * Event to be emitted to close the {@link MainModal}.
     *
     * @internal
     */
    const closingEvent: XEvent = 'UserClickedCloseX'

    return {
      closingEvent,
    }
  },
})
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`UserClickedCloseX`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)

## Example

A basic example of how the close main modal button works:

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
