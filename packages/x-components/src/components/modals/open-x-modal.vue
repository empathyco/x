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

  @Component({
    components: {
      BaseEventsModalOpen
    }
  })
  export default class OpenXModal extends Vue {
    protected openingEvent: XEvent = 'UserClickedOpenX';
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
