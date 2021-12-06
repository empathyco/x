<template>
  <BaseEventButton
    v-on="$listeners"
    :events="events"
    class="x-button x-events-modal-id-open-button"
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
## Examples

Component containing an event button that emits `UserClickedOpenModal` when it is clicked with the
modalId as payload. It has a default slot to customize its contents.

### Basic example

The component rendering content passed to the default slot and opening the modal with modalId
`my-modal`.

```vue
<template>
  <BaseIdModalOpen modalId="my-modal">
    <img src="./open-button-icon.svg" />
    <span>Open</span>
  </BaseIdModalOpen>
</template>

<script>
  import { BaseIdModalOpen } from '@empathyco/x-components';

  export default {
    name: 'BaseIdModalOpenTest',
    components: {
      BaseIdModalOpen
    }
  };
</script>
```

## Events

A list of events that the component will emit:

- `UserClickedOpenModal`: the event is emitted after the user clicks the button. The event payload
  is the id of the modal that is going to be opened.
</docs>
