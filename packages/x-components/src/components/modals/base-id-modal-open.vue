<template>
  <NoElement v-on="$listeners" data-test="open-modal-id">
    <!--
      @slot opening-element. It's the element that will trigger the modal opening. It's a
      button by default.
        @binding {Function} openModal - The function to open the modal.
    -->
    <slot :openModal="emitOpenModalEvent" name="opening-element">
      <button @click="emitOpenModalEvent" class="x-button x-events-modal-id-open-button">
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
   * Component that allows to open a modal by emitting {@link XEventsTypes.UserClickedOpenModal}
   * with the modalId as payload. It's fully customizable as it exposes the opening event but by
   * default it renders a customizable button.
   *
   * @public
   */
  @Component({
    components: { NoElement }
  })
  export default class BaseIdModalOpen extends Vue {
    @Prop({ required: true })
    protected modalId!: string;

    protected emitOpenModalEvent(): void {
      this.$x.emit('UserClickedOpenModal', this.modalId, { target: this.$el as HTMLElement });
    }
  }
</script>

<docs lang="mdx">
## Examples

Component containing an event button that emits `UserClickedOpenModal` when it is clicked with the
modalId as payload. It has a default slot to customize its contents and can also be fully
customized, replacing the default button with any other element.

### Basic example

The component rendering content passed to the default slot inside the button and opening the modal
with modalId `my-modal`.

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

### Replacing the default button

The component renders whatever element is passed, replacing the default button and exposing the
function to open the modal with modalId `my-modal`.

```vue
<template>
  <BaseIdModalOpen modalId="my-modal">
    <template #opening-element="{ openModal }">
      <ul>
        <li @click="openModal">Open here</li>
        <li>Not here</li>
      </ul>
    </template>
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
