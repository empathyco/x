<template>
  <BaseModal
    ref="baseModalEl"
    :animation="animation"
    :open="isOpen"
    @click:overlay="emitBodyClickEvent"
    @focusin:body="emitBodyClickEvent"
  >
    <slot />
  </BaseModal>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { XEvent } from '../../wiring/events.types'
import { defineComponent, ref } from 'vue'
import { use$x } from '../../composables/use-$x'
import { AnimationProp } from '../../types/animation-prop'
import { getTargetElement, isElementEqualOrContained } from '../../utils/html'
import BaseModal from './base-modal.vue'

/**
 * Component containing a modal that emits a {@link XEventsTypes.UserClickedCloseEventsModal} when
 * clicking outside the content rendered in the default slot and can receive, through the
 * eventsToCloseModal prop, a list of {@link XEvent} to listen to in order to close
 * also the modal, eventsToOpenModal prop,  another list of {@link XEvent} to customize
 * the events to listen to open the modal and a prop, displayOverlay, to display an
 * overlay over the rest of the html. The default slot offers the possibility to customize the
 * modal content.
 *
 * @public
 */
export default defineComponent({
  name: 'BaseEventsModal',
  components: {
    BaseModal,
  },
  props: {
    /** Array of {@link XEvent} to listen to open the modal. */
    eventsToOpenModal: {
      type: Array as PropType<XEvent[]>,
      default: (): XEvent[] => ['UserClickedOpenEventsModal'],
    },
    /** Array of {@link XEvent} to listen to close the modal. */
    eventsToCloseModal: {
      type: Array as PropType<XEvent[]>,
      default: (): XEvent[] => ['UserClickedCloseEventsModal', 'UserClickedOutOfEventsModal'],
    },
    /** Event to emit when any part of the website out of the modal has been clicked. */
    bodyClickEvent: {
      type: String as PropType<XEvent>,
      default: 'UserClickedOutOfEventsModal',
    },
    /** Animation to use for opening/closing the modal. */
    animation: AnimationProp,
  },
  setup(props) {
    const $x = use$x()

    /** Whether the modal is open or not. */
    const isOpen = ref(false)

    /** The element that opened the modal. */
    const openerElement = ref<HTMLElement>()
    const baseModalEl = ref<HTMLElement>()

    /**
     * Opens the modal.
     *
     * @param _payload - The payload of the event that opened the modal.
     * @param metadata - The metadata of the event that opened the modal.
     */
    props.eventsToOpenModal?.forEach(event =>
      $x.on(event, true).subscribe(({ metadata }) => {
        if (!isOpen.value) {
          openerElement.value = metadata.target
          isOpen.value = true
        }
      }),
    )

    /** Closes the modal. */
    props.eventsToCloseModal?.forEach(event =>
      $x.on(event, false).subscribe(() => {
        if (isOpen.value) {
          isOpen.value = false
        }
      }),
    )

    /**
     * Emits the event defined in the {@link BaseEventsModal.bodyClickEvent} event unless the passed
     * event target is the button that opened the modal.
     *
     * @param event - The event that triggered the close attempt.
     */
    const emitBodyClickEvent = (event: MouseEvent | FocusEvent) => {
      // Prevents clicking the open button when the panel is already open to close the panel.
      if (
        !openerElement.value ||
        !isElementEqualOrContained(openerElement.value, getTargetElement(event))
      ) {
        $x.emit(props.bodyClickEvent, undefined, { target: baseModalEl.value as HTMLElement })
      }
    }

    return {
      isOpen,
      openerElement,
      baseModalEl,
      emitBodyClickEvent,
    }
  },
})
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`UserClickedCloseEventsModal`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after clicking outside the content rendered in the default slot.
- [`UserClickedOutOfEventsModal`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after clicking outside the modal.
- Custom events to open or close the modal.

## Examples

The `BaseEventsModal` component handles the modal open/close state via the events passed via props.
Its configured by default to work as a modal for a whole search application, but if the events are
changed, it can work as a modal that is opened/closed when the events it is listening are emitted.

### Basic usage

The component interacts with the open and close components, which are preconfigured by default to
emit the same events that the `BaseEventsModal` component is listening to:

```vue
<template>
  <div>
    <BaseEventsModalOpen>Open</BaseEventsModalOpen>
    <BaseEventsModal>
      <BaseEventsModalClose>Close</BaseEventsModalClose>
      <img src="success.png" />
    </BaseEventsModal>
  </div>
</template>

<script>
import { BaseEventsModalOpen, BaseEventsModal } from '@empathyco/x-components'

export default {
  name: 'ModalTest',
  components: {
    BaseEventsModalOpen,
    BaseEventsModal,
  },
}
</script>
```

### Customizing the events

If needed, the events to open/close the modal can be changed. The modal can listen one or more
events. To do so, the `eventsToCloseModal` and `eventsToOpenModal` props can be used. Below you can
see a full example on how this would work with custom events.

```vue
<template>
  <div>
    <BaseEventsModalOpen openingEvent="UserClickedOpenMyCustomModal">Open</BaseEventsModalOpen>
    <BaseEventsModal
      :eventsToCloseModal="eventsToCloseModal"
      :eventsToOpenModal="eventsToOpenModal"
    >
      <BaseEventsModalClose closingEvent="UserClickedCloseMyCustomModalFromHeader">
        Close from header
      </BaseEventsModalClose>
      <img src="success.png" />
      <BaseEventsModalClose closingEvent="UserClickedCloseMyCustomModalFromFooter">
        Close from footer
      </BaseEventsModalClose>
    </BaseEventsModal>
  </div>
</template>

<script>
import { BaseEventsModalOpen, BaseEventsModal, BaseEventsModalClose } from '@empathyco/x-components'

export default {
  name: 'ModalTest',
  components: {
    BaseEventsModalOpen,
    BaseEventsModal,
    BaseEventsModalClose,
  },
}
</script>
```

### Customizing the content with classes

The `contentClass` prop can be used to add classes to the modal content.

```vue
<template>
  <div>
    <BaseEventsModalOpen>Open</BaseEventsModalOpen>
    <BaseEventsModal contentClass="bg-neutral-75">
      <BaseEventsModalClose>Close</BaseEventsModalClose>
      <img src="success.png" />
    </BaseEventsModal>
  </div>
</template>

<script>
import { BaseEventsModalOpen, BaseEventsModal } from '@empathyco/x-components'

export default {
  name: 'ModalTest',
  components: {
    BaseEventsModalOpen,
    BaseEventsModal,
  },
}
</script>
```
</docs>
