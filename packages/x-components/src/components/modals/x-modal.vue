<template>
  <BaseEventsModal
    class="x-modal"
    :eventsToOpenModal="openEvents"
    :eventsToCloseModal="closeEvents"
    :body-click-event="outOfModalClickEvent"
    :animation="animation"
  >
    <slot />
  </BaseEventsModal>
</template>

<script lang="ts">
  import Component from 'vue-class-component';
  import Vue from 'vue';
  import { Prop } from 'vue-property-decorator';
  import { XEvent } from '../../wiring/events.types';
  import BaseEventsModal from './base-events-modal.vue';

  /**
   * A specialised version of a modal component, made to contain a full search application.
   *
   * @public
   */
  @Component({
    components: {
      BaseEventsModal
    }
  })
  export default class XModal extends Vue {
    /**
     * Animation to use for opening/closing the modal.
     *
     * @public
     */
    @Prop()
    public animation?: Vue | string;
    /**
     * Events to listen for opening the x modal.
     *
     * @internal
     */
    protected openEvents: XEvent[] = ['UserClickedOpenX', 'UserOpenXProgrammatically'];
    /**
     * Events to listen for closing the x modal.
     *
     * @internal
     */
    protected closeEvents: XEvent[] = ['UserClickedCloseX', 'UserClickedOutOfXModal'];

    /**
     * Event to be emitted by the modal when clicked out of its content.
     *
     * @internal
     */
    protected outOfModalClickEvent: XEvent = 'UserClickedOutOfXModal';
  }
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`UserClickedOutOfXModal`](./../../api/x-components.xeventstypes.md)

## See it in action

Here you have a basic example of how the x modal works.

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
