<template>
  <BaseEventButton
    :arialabel="$x.config.messages.openButton.ariaLabel"
    :events="{ UserOpenedX: undefined }"
    class="x-open-button"
    data-test="open-button"
  >
    <!-- @slot Slot to add the button content like a text, an icon or both -->
    <slot>{{ $x.config.messages.openButton.content }}</slot>
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

  ## Basic examples

  The component rendering the default content.

  ```vue
  <OpenButton />
  ```

  The component rendering an icon and a text as its content.

  ```vue
  <OpenButton>
    <img src="./open-button-icon.svg" />
    <span>Open</span>
  </OpenButton>
  ```
</docs>
