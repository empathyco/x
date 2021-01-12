<template>
  <BaseModal @click:body="emitClose" :open="isOpen" :animation="animation">
    <slot />
  </BaseModal>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { XEvent } from '../../wiring/events.types';
  import { WireMetadata } from '../../wiring/wiring.types';
  import { XOn } from '../decorators/store.decorators';
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

    /**
     * The element that opened the modal.
     */
    protected openerElement: EventTarget | null = null;

    /**
     * Opens the modal.
     *
     * @param _payload - The payload of the opening events.
     * @param metadata - The metadata of the emitted event.
     * @public
     */
    @XOn(component => (component as BaseEventsModal).eventsToOpenModal)
    openModal(_payload: unknown, metadata: WireMetadata): void {
      if (!this.isOpen) {
        this.openerElement = metadata.target ?? null;
        this.isOpen = true;
      }
    }

    /**
     * Closes the modal.
     *
     * @public
     */
    @XOn(component => (component as BaseEventsModal).eventsToCloseModal)
    closeModal(): void {
      if (this.isOpen) {
        this.openerElement = null;
        this.isOpen = false;
      }
    }

    /**
     * Emits the event defined in the `bodyClickEvent` prop.
     *
     * @param event - The DOM event.
     *
     * @public
     */
    protected emitClose(event: MouseEvent): void {
      // Prevents clicking the open button when the panel is already open to close the panel.
      if (this.openerElement === null || this.openerElement !== event.target) {
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
<BaseEventsModalOpen>Open</BaseEventsModalOpen>
<BaseEventsModal>
      <BaseEventsModalClose>Close</BaseEventsModalClose>
      <img src="success.png" />
</BaseEventsModal>
```

## Customizing the events

If needed, the events to open/close the modal can be changed. The modal can listen one or more
events. To do so, the `eventsToCloseModal` and `eventsToOpenModal` props can be used. Below you can
see a full example on how this would work with custom events.

```vue
<BaseEventsModalOpen openingEvent="UserClickedOpenMyCustomModal">Open</BaseEventsModalOpen>
<BaseEventsModal :eventsToOpenModal="eventsToOpenModal" :eventsToCloseModal="eventsToCloseModal">
      <BaseEventsModalClose closingEvent="UserClickedCloseMyCustomModalFromHeader">
        Close from header
      </BaseEventsModalClose>
      <img src="success.png" />
      <BaseEventsModalClose closingEvent="UserClickedCloseMyCustomModalFromFooter">
        Close from footer
      </BaseEventsModalClose>
</BaseEventsModal>
```
</docs>
