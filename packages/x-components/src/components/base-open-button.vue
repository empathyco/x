<template>
  <BaseEventButton @click.stop :events="events" class="x-open-button" data-test="open-button">
    <!-- @slot (Required) Slot to add the button content like a text, an icon or both -->
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
   * Component containing an event button that emits {@link XEventsTypes.UserOpenedX} when clicked.
   * It has a default slot to customize its content.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton }
  })
  export default class BaseOpenButton extends Vue {
    @Prop({ default: 'UserOpenedX'})
    protected openingEvent!: PropsWithType<XEventsTypes, void>;

    protected get events(): Partial<XEventsTypes> {
      return { [this.openingEvent]: undefined };
    }
  }
</script>

<docs>
  #Examples

  ## Basic example

  The component rendering content passed to the default slot.

  ```vue
  <BaseOpenButton>
    <img src="./open-button-icon.svg" />
    <span>Open</span>
  </BaseOpenButton>
  ```

  ## Defining another event to emit when clicking the button

  The component

  ```vue
  <BaseOpenButton openingEvent="UserOpenedEmpathize">
    <span>Open</span>
  </BaseOpenButton>
  ```
</docs>
