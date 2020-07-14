<template>
  <BaseEventButton :events="events" class="x-close-button" data-test="close-button">
    <!-- @slot (Required) Button content with a text, an icon or both -->
    <slot />
  </BaseEventButton>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { PropsWithType } from '../utils/types';
  import { XEventsTypes } from '../wiring/events.types';
  import BaseEventButton from './base-event-button.vue';

  /**
   * Component containing an event button that emits {@link XEventsTypes.UserClosedX} when clicked.
   * It has a default slot to customize its content.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton }
  })
  export default class BaseCloseButton extends Vue {
    @Prop({ default: 'UserClosedX'})
    protected closingEvent!: PropsWithType<XEventsTypes, void>;

    protected get events(): Partial<XEventsTypes> {
      return { [this.closingEvent]: undefined };
    }
  }
</script>

<docs>
  #Examples

  ## Basic example

  The component renders whatever is passed to it in the default slot.

  ```vue
  <BaseCloseButton>
    <img src="./close-button-icon.svg" />
  </BaseCloseButton>
  ```
  ## Defining another event to emit when clicking the button

  The component

  ```vue
  <BaseCloseButton closingEvent="UserClosedEmpathize">
    ×
  </BaseCloseButton>
  ```
</docs>
