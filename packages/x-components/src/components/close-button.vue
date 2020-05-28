<template>
  <BaseEventButton
    :events="{ UserClosedX: undefined }"
    class="x-close-button"
    data-test="close-button"
  >
    <!-- @slot (Required) Slot to add the button content like a text, an icon or both -->
    <slot />
  </BaseEventButton>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
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
  export default class CloseButton extends Vue {}
</script>

<docs>
  #Examples

  ## Basic example

  The component renders whatever is passed to it in the default slot.

  ```vue
  <CloseButton>
    <img src="./close-button-icon.svg" />
  </CloseButton>
  ```
</docs>
