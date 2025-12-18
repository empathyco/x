<template>
  <BaseEventsModal
    class="x-main-modal"
    data-test="main-modal"
    :events-to-open-modal="openEvents"
    :events-to-close-modal="closeEvents"
    :body-click-event="outOfModalClickEvent"
    :animation="animation"
    :focus-on-open="focusOnOpen"
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
  },
})
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`UserClickedOutOfMainModal`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)

## See it in action

Here you have a basic example of how the main modal works.

```vue live
<template>
  <div>
    <OpenMainModal>Open X</OpenMainModal>
    <MainModal>
      <CloseMainModal>Close X</CloseMainModal>
    </MainModal>
  </div>
</template>

<script>
import { MainModal, CloseMainModal, OpenMainModal } from '@empathyco/x-components'

export default {
  name: 'MainModalDemo',
  components: {
    MainModal,
    CloseMainModal,
    OpenMainModal,
  },
}
</script>
```

### Customizing the content with classes

The `contentClass` prop can be used to add classes to the modal content.

```vue live
<template>
  <div>
    <OpenMainModal>Open X</OpenMainModal>
    <MainModal contentClass="bg-neutral-75">
      <CloseMainModal>Close X</CloseMainModal>
    </MainModal>
  </div>
</template>

<script>
import { MainModal, CloseMainModal, OpenMainModal } from '@empathyco/x-components'

export default {
  name: 'MainModalDemo',
  components: {
    MainModal,
    CloseMainModal,
    OpenMainModal,
  },
}
</script>
```

### Customizing the modal events

The modal events can be customized by changing its props values:

- To add or subtract events to open or close the modal,
- To modify or remove the default
  [`UserClickedOutOfMainModal`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)
  that the modal emits.

In this example, we are changing the `openEvents` prop to add another event, and removing the event
that the modal would emit when the user clicks out of the modal.

```vue live
<template>
  <div>
    <OpenMainModal>Open X</OpenMainModal>
    <MainModal
      :openEvents="['UserClickedOpenX', 'UserOpenXProgrammatically', 'MyCustomXEvent']"
      :outOfModalClickEvent="null"
    >
      <CloseMainModal>Close X</CloseMainModal>
    </MainModal>
  </div>
</template>

<script>
import { MainModal, CloseMainModal, OpenMainModal } from '@empathyco/x-components'

export default {
  name: 'MainModalDemo',
  components: {
    MainModal,
    CloseMainModal,
    OpenMainModal,
  },
}
</script>
```
</docs>
