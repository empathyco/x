<template>
  <BaseEventsModal
    class="x-main-modal"
    data-test="main-modal"
    :eventsToOpenModal="openEvents"
    :eventsToCloseModal="closeEvents"
    :bodyClickEvent="outOfModalClickEvent"
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
  export default class MainModal extends Vue {
    /**
     * Animation to use for opening/closing the modal.
     *
     * @public
     */
    @Prop()
    public animation?: Vue | string;
    /**
     * Events to listen for opening the main modal.
     *
     * @internal
     */
    protected openEvents: XEvent[] = ['UserClickedOpenX', 'UserOpenXProgrammatically'];
    /**
     * Events to listen for closing the main modal.
     *
     * @internal
     */
    protected closeEvents: XEvent[] = ['UserClickedCloseX', 'UserClickedOutOfMainModal'];

    /**
     * Event to be emitted by the modal when clicked out of its content.
     *
     * @internal
     */
    protected outOfModalClickEvent: XEvent = 'UserClickedOutOfMainModal';
  }
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
</docs>
