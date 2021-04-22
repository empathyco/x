<template>
  <BaseModal
    @click:body="emitBodyClickEvent"
    @focusin:body="emitBodyClickEvent"
    :animation="animation"
    :open="isOpen"
  >
    <slot />
  </BaseModal>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { XEvent } from '../../wiring/events.types';
  import { XOn } from '../decorators/bus.decorators';
  import { WireMetadata } from '../../wiring/wiring.types';
  import { isElementEqualOrContained } from '../../utils/html';
  import BaseModal from './base-modal.vue';

  /**
   * Component containing a modal that emits a {@link XEventsTypes.UserClickedCloseX} when
   * clicking outside the content rendered in the default slot and can receive, through the
   * eventsToCloseModal prop, a list of {@link XEvent | xEvents} to listen to in order to close
   * also the modal, eventsToOpenModal prop,  another list of {@link XEvent | xEvents} to customize
   * the events to listen to open the modal and a prop, displayOverlay, to display an
   * overlay over the rest of the html. The default slot offers the possibility to customize the
   * modal content.
   *
   * @public
   */
  @Component({
    components: { BaseModal }
  })
  export default class BaseEventsModal extends Vue {
    /**
     * Animation to use for opening/closing the modal.
     */
    @Prop()
    public animation?: Vue | string;
    /**
     * Array of {@link XEvent | xEvents} to listen to open the modal.
     */
    @Prop({ default: (): XEvent[] => ['UserClickedOpenX'] })
    public eventsToOpenModal!: XEvent[];

    /**
     * Array of {@link XEvent | xEvents} to listen to close the modal.
     */
    @Prop({ default: (): XEvent[] => ['UserClickedCloseX', 'UserClickedOutOfXModal'] })
    public eventsToCloseModal!: XEvent[];

    /**
     * Event to emit when any part of the website out of the modal has been clicked.
     */
    @Prop({ default: 'UserClickedOutOfXModal' })
    public bodyClickEvent!: XEvent;

    /**
     * Whether the modal is open or not.
     */
    protected isOpen = false;

    /** The element that opened the modal. */
    protected openerElement?: HTMLElement;

    /**
     * Opens the modal.
     *
     * @param _payload - The payload of the event that opened the modal.
     * @param metadata - The metadata of the event that opened the modal.
     *
     * @internal
     */
    @XOn(component => (component as BaseEventsModal).eventsToOpenModal)
    openModal(_payload: unknown, metadata: WireMetadata): void {
      if (!this.isOpen) {
        this.openerElement = metadata.target;
        this.isOpen = true;
      }
    }

    /**
     * Closes the modal.
     *
     * @internal
     */
    @XOn(component => (component as BaseEventsModal).eventsToCloseModal)
    closeModal(): void {
      if (this.isOpen) {
        this.isOpen = false;
      }
    }

    /**
     * Emits the event defined in the {@link BaseEventsModal.bodyClickEvent} event unless the passed
     * event target is the button that opened the modal.
     *
     * @param event - The event that triggered the close attempt.
     * @public
     */
    protected emitBodyClickEvent(event: MouseEvent | FocusEvent): void {
      // Prevents clicking the open button when the panel is already open to close the panel.
      if (
        !this.openerElement ||
        !isElementEqualOrContained(this.openerElement, event.target as HTMLElement)
      ) {
        this.$x.emit(this.bodyClickEvent, undefined, { target: this.$el as HTMLElement });
      }
    }
  }
</script>

<docs lang="mdx">
#Examples

The `BaseEventsModal` component handles the modal open/close state via the events passed via props.
Its configured by default to work as a modal for a whole search application, but if the events are
changed, it can work as a modal that is opened/closed when the events it is listening are emitted.

## Basic usage

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
  import { BaseEventsModalOpen, BaseEventsModal } from '@empathy/x-components';

  export default {
    name: 'ModalTest',
    components: {
      BaseEventsModalOpen,
      BaseEventsModal
    }
  };
</script>
```

## Customizing the events

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
  import {
    BaseEventsModalOpen,
    BaseEventsModal,
    BaseEventsModalClose
  } from '@empathy/x-components';

  export default {
    name: 'ModalTest',
    components: {
      BaseEventsModalOpen,
      BaseEventsModal,
      BaseEventsModalClose
    }
  };
</script>
```

## Events

A list of events that the component will emit:

- `UserClickedCloseX`: the event is emitted after clicking outside the content rendered in the
  default slot.
- Custom events to open or close the modal.
</docs>
