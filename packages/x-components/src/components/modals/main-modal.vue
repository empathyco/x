<template>
  <BaseEventsModal
    class="x-main-modal"
    data-test="main-modal"
    :events-to-open-modal="openEvents"
    :events-to-close-modal="closeEvents"
    :body-click-event="outOfModalClickEvent"
    :animation="animation"
    :focus-on-open="focusOnOpen"
    :escape-close-event="escapeCloseEvent"
  >
    <slot />
  </BaseEventsModal>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { XEvent } from '../../wiring/events.types'
import { defineComponent } from 'vue'
import { AnimationProp } from '../../types/animation-prop'
import BaseEventsModal from './base-events-modal.vue'

/**
 * A specialised version of a modal component, made to contain a full search application.
 *
 * @public
 */
export default defineComponent({
  components: {
    BaseEventsModal,
  },
  props: {
    /**
     * Animation to use for opening/closing the modal.
     *
     * @public
     */
    animation: {
      type: AnimationProp,
    },
    /**
     * Events to listen for closing the main modal.
     */
    closeEvents: {
      type: Array as PropType<XEvent[]>,
      default: () => ['UserClickedCloseX', 'UserClickedOutOfMainModal'],
    },
    /**
     * Determines if the focused element changes to one inside the modal when it opens. Either the
     * first element with a positive tabindex or just the first focusable element.
     */
    focusOnOpen: {
      type: Boolean,
      default: false,
    },
    /**
     * Events to listen for opening the main modal.
     */
    openEvents: {
      type: Array as PropType<XEvent[]>,
      default: () => ['UserClickedOpenX', 'UserOpenXProgrammatically'],
    },
    /**
     * Event to be emitted by the modal when clicked out of its content.
     */
    outOfModalClickEvent: {
      type: (String as PropType<XEvent>) || null,
      default: 'UserClickedOutOfMainModal',
    },
    /**
     * Event to be emitted by the modal when the Escape key is pressed while it is open. Set it to
     * one of the events in closeEvents.
     */
    escapeCloseEvent: {
      type: (String as PropType<XEvent>) || null,
      default: 'UserClickedCloseX',
    },
  },
})
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`UserClickedOutOfMainModal`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)
- [`UserClickedCloseX`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted when the Escape key is pressed while the modal is open. The event emitted
  can be customized with the `escapeCloseEvent` prop, which should be one of the events in
  `closeEvents`. Set the prop to `null` to disable the Escape handling.

## Examples

A basic example of how the main modal works:

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

### Customizing the content with classes

The `contentClass` prop can be used to add classes to the modal content.

```vue live
<template>
  <OpenMainModal>Open X</OpenMainModal>
  <MainModal contentClass="x-bg-neutral-75">
    <CloseMainModal>Close X</CloseMainModal>
  </MainModal>
</template>

<script setup>
import { MainModal, CloseMainModal, OpenMainModal } from '@empathyco/x-components'
</script>
```

### Customizing the modal events

The modal events can be customized by changing its props values:

- To add or subtract events to open or close the modal,
- To modify or remove the default [`UserClickedOutOfMainModal`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts) that the modal emits,
- To modify or disable (with `null`) the event emitted when the Escape key is pressed while the
  modal is open, using the `escapeCloseEvent` prop. It defaults to [`UserClickedCloseX`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts), so the modal is closed with Escape by default.

In this example, we are changing the `openEvents` prop to add another event, and removing the event
that the modal would emit when the user clicks out of the modal.

```vue live
<template>
  <OpenMainModal>Open X</OpenMainModal>
  <MainModal
    :openEvents="['UserClickedOpenX', 'UserOpenXProgrammatically', 'MyCustomXEvent']"
    :outOfModalClickEvent="null"
  >
    <CloseMainModal>Close X</CloseMainModal>
  </MainModal>
</template>

<script setup>
import { MainModal, CloseMainModal, OpenMainModal } from '@empathyco/x-components'
</script>
```
</docs>
