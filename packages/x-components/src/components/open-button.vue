<template>
  <BaseEventButton
    :events="{ UserOpenedX: undefined }"
    class="x-open-button"
    data-test="open-button"
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
   * Component containing an event button that emits {@link XEventsTypes.UserOpenedX} when clicked.
   * It has a default slot to customize its content.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton }
  })
  export default class OpenButton extends Vue {}
</script>

<docs>
  #Examples

  ## Basic example

  The component renders whatever is passed to it in the default slot.

  ```vue
  <OpenButton>
    <img src="./open-button-icon.svg" />
    <span>Open</span>
  </OpenButton>
  ```
</docs>
