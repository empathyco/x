<template>
  <NoElement>
    <!--
      @slot closing-element. It's the element that will trigger the modal closing. It's a
      button by default.
        @binding {Function} closeModal - The function to close the modal.
    -->
    <slot :closeModal="emitCloseModalEvent" name="closing-element">
      <button
        @click="emitCloseModalEvent"
        class="x-button x-events-modal-id-close-button"
        data-test="close-modal-id"
      >
        <!-- @slot (Required) Button content with a text, an icon or both -->
        <slot />
      </button>
    </slot>
  </NoElement>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { NoElement } from '../no-element';

  /**
   * Component that allows to close a modal by emitting {@link XEventsTypes.UserClickedCloseModal}.
   * It allows full customization with the 'closing-element' slot and exposes the 'closeModal'
   * function.
   *
   * @public
   */
  @Component({
    components: { NoElement }
  })
  export default class BaseIdModalClose extends Vue {
    /**
     * The modalId of the modal that will be closed.
     *
     * @public
     */
    @Prop({ required: true })
    protected modalId!: string;

    /**
     * Emits the {@link XEventsTypes.UserClickedCloseModal} event with the modalId as payload.
     *
     * @param event - The event triggering the function.
     * @public
     */
    protected emitCloseModalEvent({ target }: Event): void {
      this.$x.emit('UserClickedCloseModal', this.modalId, { target: target as HTMLElement });
    }
  }
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- `UserClickedCloseModal`: the event is emitted after the user clicks the button. The event payload
  is the id of the modal that is going to be closed.

## Examples

Component containing an event button that emits `UserClickedCloseModal` when clicked with the
modalId as payload. It has a default slot to customize its contents and can also be fully
customized, replacing the default button with any other element.

### Basic example

The component renders whatever is passed to it in the default slot inside the button and closes the
modal with modalId `my-modal`.

```vue
<template>
  <BaseIdModalClose modalId="my-modal">
    <img src="./close-button-icon.svg" />
  </BaseIdModalClose>
</template>

<script>
  import { BaseIdModalClose } from '@empathyco/x-components';

  export default {
    name: 'BaseIdModalCloseTest',
    components: {
      BaseIdModalClose
    }
  };
</script>
```

### Replacing the default button

The component renders whatever element is passed, replacing the default button and exposing the
function to close the modal with modalId `my-modal`.

```vue
<template>
  <BaseIdModalClose modalId="my-modal">
    <template #closing-element="{ closeModal }">
      <ul>
        <li @click="closeModal">Close here</li>
        <li>Not here</li>
      </ul>
    </template>
  </BaseIdModalClose>
</template>

<script>
  import { BaseIdModalClose } from '@empathyco/x-components';

  export default {
    name: 'BaseIdModalCloseTest',
    components: {
      BaseIdModalClose
    }
  };
</script>
```
</docs>
