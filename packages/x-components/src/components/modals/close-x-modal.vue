<template>
  <BaseEventsModalClose v-on="$listeners" class="x-modal" :closingEvent="closingEvent">
    <slot />
  </BaseEventsModalClose>
</template>

<script lang="ts">
  import Component from 'vue-class-component';
  import Vue from 'vue';
  import { XEvent } from '../../wiring/events.types';
  import BaseEventsModalClose from './base-events-modal-close.vue';

  /**
   * Button to close the {@link XModal}.
   *
   * @public
   */
  @Component({
    components: {
      BaseEventsModalClose
    }
  })
  export default class CloseXModal extends Vue {
    /**
     * Event to be emitted to close the {@link XModal}.
     *
     * @internal
     */
    protected closingEvent: XEvent = 'UserClickedCloseX';
  }
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`UserClickedCloseX`](./../../api/x-components.xeventstypes.md)

## See it in action

Here you have a basic example of how the close x modal button works.

```vue live
<template>
  <div>
    <OpenXModal>Open X</OpenXModal>
    <XModal>
      <CloseXModal>Close X</CloseXModal>
    </XModal>
  </div>
</template>

<script>
  import { XModal, CloseXModal, OpenXModal } from '@empathyco/x-components';

  export default {
    name: 'XModalDemo',
    components: {
      XModal,
      CloseXModal,
      OpenXModal
    }
  };
</script>
```
</docs>
