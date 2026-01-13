<template>
  <button
    class="x-events-modal-id-close-button xds:button"
    data-test="close-modal-id"
    @click="closeModal"
  >
    <!-- @slot (Required) Button content with a text, an icon or both -->
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { use$x } from '../../composables'

/**
 * Component that allows to close a modal by emitting
 * {@link XEventsTypes.UserClickedCloseModal}.
 * It allows full customization with the 'closing-element' slot and exposes the 'closeModal'
 * function.
 *
 * @public
 */
export default defineComponent({
  name: 'BaseIdModalClose',
  props: {
    /** The modalId of the modal that will be closed. */
    modalId: {
      type: String,
      required: true,
    },
  },
  setup(props, { slots }) {
    const $x = use$x()

    /**
     * Emits the {@link XEventsTypes.UserClickedCloseModal} event with the modalId as payload.
     *
     * @param event - The event triggering the function.
     * @param event.target - Event target.
     */
    function closeModal({ target }: Event) {
      $x.emit('UserClickedCloseModal', props.modalId, { target: target as HTMLElement })
    }

    /* Hack to render through a render-function, the `closing-element` slot or, in its absence,
       the component itself. It is the alternative for the NoElement antipattern. */
    const innerProps = { closeModal }
    return (
      slots['closing-element'] ? () => slots['closing-element']?.(innerProps)[0] : innerProps
    ) as typeof innerProps
  },
})
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`UserClickedCloseModal`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the button. The event payload is the id of the modal
  that is going to be closed.

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
import { BaseIdModalClose } from '@empathyco/x-components'

export default {
  name: 'BaseIdModalCloseTest',
  components: {
    BaseIdModalClose,
  },
}
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
import { BaseIdModalClose } from '@empathyco/x-components'

export default {
  name: 'BaseIdModalCloseTest',
  components: {
    BaseIdModalClose,
  },
}
</script>
```
</docs>
