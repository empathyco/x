<template>
  <button
    class="x-events-modal-id-open-button x-button"
    data-test="open-modal-id"
    @click="openModal"
  >
    <!-- @slot (Required) Button content with a text, an icon or both -->
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { use$x } from '../../composables'

/**
 * Component that allows to open a modal by emitting {@link XEventsTypes.UserClickedOpenModal}
 * with the modalId as payload. It allows full customization with the 'opening-element' slot and
 * exposes the 'openModal' function.
 *
 * @public
 */
export default defineComponent({
  name: 'BaseIdModalOpen',
  props: {
    /** The modalId of the modal that will be opened. */
    modalId: {
      type: String,
      required: true,
    },
  },
  setup(props, { slots }) {
    const $x = use$x()

    /**
     * Emits the {@link XEventsTypes.UserClickedOpenModal} event with the modalId as payload.
     *
     * @param event - The event triggering the function.
     * @param event.target - Event target.
     */
    function openModal({ target }: Event) {
      $x.emit('UserClickedOpenModal', props.modalId, { target: target as HTMLElement })
    }

    /* Hack to render through a render-function, the `opening-element` slot or, in its absence,
       the component itself. It is the alternative for the NoElement antipattern. */
    const innerProps = { openModal }
    return (
      slots['opening-element'] ? () => slots['opening-element']?.(innerProps)[0] : innerProps
    ) as typeof innerProps
  },
})
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`UserClickedOpenModal`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the button. The event payload is the id of the modal
  that is going to be opened.

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

<script setup>
import { BaseIdModalOpen } from '@empathyco/x-components'
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

<script setup>
import { BaseIdModalOpen } from '@empathyco/x-components'
</script>
```
</docs>
