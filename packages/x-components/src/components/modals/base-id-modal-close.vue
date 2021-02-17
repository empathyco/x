<template>
  <BaseEventButton
    :events="events"
    class="x-events-modal-id-close-button"
    data-test="close-modal-id"
  >
    <!-- @slot (Required) Button content with a text, an icon or both -->
    <slot />
  </BaseEventButton>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { XEventsTypes } from '../../wiring/events.types';
  import BaseEventButton from '../base-event-button.vue';

  /**
   * Component containing an event button that emits {@link XEventsTypes.UserClickedCloseModal} when
   * clicked with the modalId as payload. It has a default slot to customize its contents.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton }
  })
  export default class BaseIdModalClose extends Vue {
    @Prop({ required: true })
    protected modalId!: string;

    protected get events(): Partial<XEventsTypes> {
      return { UserClickedCloseModal: this.modalId };
    }
  }
</script>

<docs lang="mdx">
#Examples

## Basic example

The component renders whatever is passed to it in the default slot and closing the modal with
modalId `my-modal`.

```vue
<BaseIdModalClose modalId="my-modal">
  <img src="./close-button-icon.svg"/>
</BaseIdModalClose>
```
</docs>
