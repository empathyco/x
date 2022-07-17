<template>
  <BaseEventsModalOpen v-on="$listeners" class="x-modal" :opening-event="openingEvent">
    <slot />
  </BaseEventsModalOpen>
</template>

<script lang="ts">
  import Component from 'vue-class-component';
  import Vue from 'vue';
  import { XEvent } from '../../wiring/events.types';
  import BaseEventsModalOpen from './base-events-modal-open.vue';

  /**
   * Button to open the {@link XModal}.
   *
   * @public
   */
  @Component({
    components: {
      BaseEventsModalOpen
    }
  })
  export default class OpenXModal extends Vue {
    /**
     * Event to be emitted to open the {@link XModal}.
     *
     * @internal
     */
    protected openingEvent: XEvent = 'UserClickedOpenX';
  }
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`UserClickedOpenX`](./../../api/x-components.xeventstypes.md)

## See it in action

Here you have a basic example of how the open x modal button works.

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
