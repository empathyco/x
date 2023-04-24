<template>
  <BaseEventsModal
    class="x-main-modal"
    data-test="main-modal"
    :eventsToOpenModal="openEvents"
    :eventsToCloseModal="closeEvents"
    :bodyClickEvent="outOfModalClickEvent"
    :animation="animation"
    :focusOnOpen="focusOnOpen"
    v-bind="$attrs"
  >
    <slot />
  </BaseEventsModal>
</template>

<script lang="ts">
  import Vue, { defineComponent } from 'vue';
  import { XEvent } from '../../wiring/events.types';
  import BaseEventsModal from './base-events-modal.vue';

  /**
   * A specialised version of a modal component, made to contain a full search application.
   *
   * @public
   */
  export default defineComponent({
    components: {
      BaseEventsModal
    },
    props: {
      /**
       * Animation to use for opening/closing the modal.
       *
       * @public
       */
      animation: {
        type: [Vue, String]
      },
      /**
       * Determines if the focused element changes to one inside the modal when it opens. Either the
       * first element with a positive tabindex or just the first focusable element.
       */
      focusOnOpen: {
        type: Boolean,
        default: false
      }
    },
    setup() {
      /**
       * Events to listen for opening the main modal.
       *
       * @internal
       */
      const openEvents: XEvent[] = ['UserClickedOpenX', 'UserOpenXProgrammatically'];

      /**
       * Events to listen for closing the main modal.
       *
       * @internal
       */
      const closeEvents: XEvent[] = ['UserClickedCloseX', 'UserClickedOutOfMainModal'];

      /**
       * Event to be emitted by the modal when clicked out of its content.
       *
       * @internal
       */
      const outOfModalClickEvent: XEvent = 'UserClickedOutOfMainModal';

      return {
        openEvents,
        closeEvents,
        outOfModalClickEvent
      };
    }
  });
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`UserClickedOutOfMainModal`](./../../api/x-components.xeventstypes.md)

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
  import { MainModal, CloseMainModal, OpenMainModal } from '@empathyco/x-components';

  export default {
    name: 'MainModalDemo',
    components: {
      MainModal,
      CloseMainModal,
      OpenMainModal
    }
  };
</script>
```

### Customizing the content with classes

The `contentClass` prop can be used to add classes to the modal content.

```vue live
<template>
  <div>
    <OpenMainModal>Open X</OpenMainModal>
    <MainModal contentClass="x-background--neutral-35">
      <CloseMainModal>Close X</CloseMainModal>
    </MainModal>
  </div>
</template>

<script>
  import { MainModal, CloseMainModal, OpenMainModal } from '@empathyco/x-components';

  export default {
    name: 'MainModalDemo',
    components: {
      MainModal,
      CloseMainModal,
      OpenMainModal
    }
  };
</script>
```
</docs>
