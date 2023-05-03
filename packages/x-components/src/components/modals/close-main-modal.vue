<template>
  <BaseEventsModalClose
    v-on="$listeners"
    class="x-close-main-modal"
    data-test="close-main-modal"
    :closingEvent="closingEvent"
  >
    <slot />
  </BaseEventsModalClose>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { XEvent } from '../../wiring/events.types';
  import BaseEventsModalClose from './base-events-modal-close.vue';

  /**
   * Button to close the {@link MainModal}.
   *
   * @public
   */
  export default defineComponent({
    components: {
      BaseEventsModalClose
    },
    setup() {
      /**
       * Event to be emitted to close the {@link MainModal}.
       *
       * @internal
       */
      const closingEvent: XEvent = 'UserClickedCloseX';

      return {
        closingEvent
      };
    }
  });
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`UserClickedCloseX`](./../../api/x-components.xeventstypes.md)

## See it in action

Here you have a basic example of how the close main modal button works.

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
    name: 'XModalDemo',
    components: {
      MainModal,
      CloseMainModal,
      OpenMainModal
    }
  };
</script>
```
</docs>
