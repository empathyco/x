<template>
  <BaseEventButton :events="events" class="x-events-modal-close-button" data-test="close-modal">
    <!-- @slot (Required) Button content with a text, an icon or both -->
    <slot />
  </BaseEventButton>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { PropsWithType } from '../../utils/types';
  import { XEventsTypes } from '../../wiring/events.types';
  import BaseEventButton from '../base-event-button.vue';

  /**
   * Component containing an event button that emits {@link XEventsTypes.UserClickedCloseX} when
   * clicked. It has a default slot to customize its contents.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton }
  })
  export default class BaseEventsModalClose extends Vue {
    @Prop({ default: 'UserClickedCloseX' })
    protected closingEvent!: PropsWithType<XEventsTypes, void>;

    protected get events(): Partial<XEventsTypes> {
      return { [this.closingEvent]: undefined };
    }
  }
</script>

<docs lang="mdx">
#Examples

## Basic example

The component renders whatever is passed to it in the default slot.

```vue
<BaseEventsCloseButton>
  <img src="./close-button-icon.svg"/>
</BaseEventsCloseButton>
```

## Defining another event to emit when clicking the button

The component

```vue
<BaseEventsCloseButton closingEvent="UserClosedEmpathize">
  ×
</BaseEventsCloseButton>
```
</docs>
