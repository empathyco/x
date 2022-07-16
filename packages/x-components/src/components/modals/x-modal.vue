<template>
  <BaseEventsModal
    class="x-modal"
    :eventsToOpenModal="openEvents"
    :eventsToCloseModal="closeEvents"
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
    protected closeEvents: XEvent[] = ['UserClickedCloseX'];
  }
</script>

<docs lang="mdx">
## Events

This component emits no events.

## See it in action

Here you have a basic example of how the x modal works.

_Type any term in the input field to try it out!_

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
