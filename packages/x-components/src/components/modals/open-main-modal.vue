<template>
  <BaseEventsModalOpen
    class="x-open-main-modal"
    data-test="open-main-modal"
    :openingEvent="openingEvent"
  >
    <slot />
  </BaseEventsModalOpen>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { XEvent } from '../../wiring/events.types';
  import BaseEventsModalOpen from './base-events-modal-open.vue';

  /**
   * Button to open the {@link MainModal}.
   *
   * @public
   */
  export default defineComponent({
    components: {
      BaseEventsModalOpen
    },
    setup() {
      /**
       * Event to be emitted to open the {@link MainModal}.
       *
       * @internal
       */
      const openingEvent: XEvent = 'UserClickedOpenX';

      return {
        openingEvent
      };
    }
  });
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`UserClickedOpenX`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)

## See it in action

Here you have a basic example of how the open main modal button works.

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
