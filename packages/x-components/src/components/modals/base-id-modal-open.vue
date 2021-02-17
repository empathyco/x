<template>
  <BaseEventButton
    @click.stop
    :events="events"
    class="x-events-modal-id-open-button"
    data-test="open-modal-id"
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
   * Component containing an event button that emits {@link XEventsTypes.UserClickedOpenModal} when
   * clicked with the modalId as payload. It has a default slot to customize its contents.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton }
  })
  export default class BaseIdModalOpen extends Vue {
    @Prop({ required: true })
    protected modalId!: string;

    protected get events(): Partial<XEventsTypes> {
      return { UserClickedOpenModal: this.modalId };
    }
  }
</script>

<docs lang="mdx">
#Examples

## Basic example

The component rendering content passed to the default slot and opening the modal with modalId
`my-modal`.

```vue
<BaseIdModalOpen modalId="my-modal">
  <img src="./open-button-icon.svg"/>
  <span>Open</span>
</BaseIdModalOpen>
```
</docs>
