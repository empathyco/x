<template>
  <BaseModal
    :ref="el"
    :animation="animation"
    :open="isOpen"
    @click:overlay="emitClickOutOfModal"
    @focusin:body="emitClickOutOfModal"
  >
    <slot />
  </BaseModal>
</template>

<script lang="ts">
import type { XEvent } from '../../wiring/events.types'
import type { WireMetadata } from '../../wiring/wiring.types'
import { defineComponent, ref } from 'vue'
import { useXBus } from '../../composables'
import { AnimationProp } from '../../types/animation-prop'
import { getTargetElement, isElementEqualOrContained } from '../../utils/html'
import BaseModal from './base-modal.vue'

/**
 * Component containing a modal expecting a required prop, named `modalId`. It reacts to
 * `UserClickedOpenModal`, `UserClickedCloseModal` and `UserClickedOutOfModal` events, when their
 * payload matches the component's 'modalId' prop, to handle its open/close state. The default
 * slot offers the possibility to customise the modal content.
 *
 * @public
 */
export default defineComponent({
  name: 'BaseIdModal',
  components: { BaseModal },
  props: {
    /**
     * Animation to use for opening/closing the modal.
     */
    animation: {
      type: AnimationProp,
    },
    /**
     * The modalId to use for the open and close event listeners.
     */
    modalId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    /** The element that opened the modal. */
    let openerElement: HTMLElement | undefined

    /** Whether the modal is open or not. */
    const isOpen = ref(false)

    const el = ref<HTMLElement>()

    const closeModalEvents: XEvent[] = ['UserClickedCloseModal', 'UserClickedOutOfModal']

    const xBus = useXBus()

    /**
     * Opens the modal.
     *
     * @param modalId - The payload of the {@link XEventsTypes.UserClickedOpenModal} event.
     * @param metadata - The metadata of the emitted event.
     * @public
     */
    function openModal(modalId: string, metadata: WireMetadata): void {
      if (!isOpen.value && props.modalId === modalId) {
        openerElement = metadata.target
        isOpen.value = true
      }
    }

    /**
     * Closes the modal.
     *
     * @param payload - The payload of the closing events:
     * {@link XEventsTypes.UserClickedCloseModal} or {@link XEventsTypes.UserClickedOutOfModal}.
     *
     * @public
     */
    function closeModal(payload: string): void {
      if (isOpen.value && props.modalId === payload) {
        isOpen.value = false
      }
    }

    /**
     * Emits a {@link XEventsTypes.UserClickedOutOfModal} event unless the passed event target
     * is the button that opened the modal.
     *
     * @param event - The event that triggered the close attempt.
     * @public
     */
    function emitClickOutOfModal(event: MouseEvent | FocusEvent): void {
      // Prevents clicking the open button when the panel is already open to close the panel.
      if (!openerElement || !isElementEqualOrContained(openerElement, getTargetElement(event))) {
        xBus.emit('UserClickedOutOfModal', props.modalId, { target: el.value as HTMLElement })
      }
    }

    xBus
      .on('UserClickedOpenModal', true)
      .subscribe(({ eventPayload, metadata }) => openModal(eventPayload, metadata))

    closeModalEvents.forEach(event => {
      xBus.on(event, false).subscribe(eventPayload => closeModal(eventPayload as string))
    })

    return {
      el,
      isOpen,
      emitClickOutOfModal,
    }
  },
})
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`UserClickedOutOfModal`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks outside the modal. The event payload is the id of the
  modal and a metadata with the target element that emitted it.

## Examples

The `BaseIdModal` component reacts to the `UserClickedOpenModal`, `UserClickedCloseModal` and
`UserClickedOutOfModal` to handle its open/close state. The component filters out the events which
payload doesn't match its `modalId` prop and reacts only to those who match this criteria.

### Basic usage

The component interacts with both `BaseIdModalOpen` and `BaseIdModalClose` components, which have to
share the same value in their `modalId` prop to work:

```vue
<template>
  <div>
    <BaseIdModalOpen modalId="myModal">Open</BaseIdModalOpen>
    <BaseIdModal modalId="myModal">
      <img src="success.png" />
      <BaseIdModalClose modalId="myModal">Close</BaseIdModalClose>
    </BaseIdModal>
  </div>
</template>

<script>
import { BaseIdModalOpen, BaseIdModal, BaseIdModalClose } from '@empathyco/x-components'

export default {
  name: 'TestModal',
  components: {
    BaseIdModalOpen,
    BaseIdModal,
    BaseIdModalClose,
  },
}
</script>
```

### Customized usage

#### Customizing the content with classes

The `contentClass` prop can be used to add classes to the modal content.

```vue
<template>
  <div>
    <BaseIdModalOpen modalId="myModal">Open</BaseIdModalOpen>
    <BaseIdModal modalId="myModal" contentClass="bg-neutral-75">
      <img src="success.png" />
      <BaseIdModalClose modalId="myModal">Close</BaseIdModalClose>
    </BaseIdModal>
  </div>
</template>

<script>
import { BaseIdModalOpen, BaseIdModal, BaseIdModalClose } from '@empathyco/x-components'

export default {
  name: 'TestModal',
  components: {
    BaseIdModalOpen,
    BaseIdModal,
    BaseIdModalClose,
  },
}
</script>
```
</docs>
