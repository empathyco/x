<template>
  <BaseEventsModalOpen
    v-on="$listeners"
    class="x-open-main-modal"
    data-test="open-main-modal"
    :openingEvent="openingEvent"
  >
    <slot />
  </BaseEventsModalOpen>
</template>

<script lang="ts">
  import Component from 'vue-class-component';
  import Vue from 'vue';
  import { XEvent } from '../../wiring/events.types';
  import BaseEventsModalOpen from './base-events-modal-open.vue';

  /**
   * Button to open the {@link MainModal}.
   *
   * @public
   */
  @Component({
    components: {
      BaseEventsModalOpen
    }
  })
  export default class OpenMainModal extends Vue {
    /**
     * Event to be emitted to open the {@link MainModal}.
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
