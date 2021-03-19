<template>
  <BaseModal
    @click:body="emitClickOutOfModal"
    @focusin:body="emitClickOutOfModal"
    :animation="animation"
    :open="isOpen"
  >
    <slot />
  </BaseModal>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { XOn } from '../decorators/bus.decorators';
  import { WireMetadata } from '../../wiring/wiring.types';
  import { isElementEqualOrContained } from '../../utils/html';
  import BaseModal from './base-modal.vue';

  /**
   * Component containing a modal expecting a required prop, named `modalId`. It reacts to
   * `UserClickedOpenModal`, `UserClickedCloseModal` and `UserClickedOutOfModal` events, when their
   * payload matches the component's 'modalId' prop, to handle its open/close state. The default
   * slot offers the possibility to customise the modal content.
   *
   * @public
   */
  @Component({
    components: { BaseModal }
  })
  export default class BaseIdModal extends Vue {
    /**
     * Animation to use for opening/closing the modal.
     */
    @Prop()
    public animation?: Vue | string;

    /**
     * The modalId to use for the open and close event listeners.
     */
    @Prop({ required: true })
    public modalId!: string;

    /**
     * Whether the modal is open or not.
     */
    protected isOpen = false;

    /** The element that opened the modal. */
    protected openerElement?: HTMLElement;

    /**
     * Opens the modal.
     *
     * @param modalId - The payload of the {@link XEventsTypes.UserClickedOpenModal} event.
     * @param metadata - The metadata of the emitted event.
     * @public
     */
    @XOn('UserClickedOpenModal')
    openModal(modalId: string, metadata: WireMetadata): void {
      if (!this.isOpen && this.modalId === modalId) {
        this.openerElement = metadata.target;
        this.isOpen = true;
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
    @XOn(['UserClickedCloseModal', 'UserClickedOutOfModal'])
    closeModal(payload: string): void {
      if (this.isOpen && this.modalId === payload) {
        this.isOpen = false;
      }
    }

    /**
     * Emits a {@link XEventsTypes.UserClickedOutOfModal} event unless the passed event target
     * is the button that opened the modal.
     *
     * @param event - The event that triggered the close attempt.
     * @public
     */
    protected emitClickOutOfModal(event: MouseEvent | FocusEvent): void {
      // Prevents clicking the open button when the panel is already open to close the panel.
      if (
        !this.openerElement ||
        !isElementEqualOrContained(this.openerElement, event.target as HTMLElement)
      ) {
        this.$x.emit('UserClickedOutOfModal', this.modalId, { target: this.$el as HTMLElement });
      }
    }
  }
</script>

<docs lang="mdx">
#Examples

The `BaseIdModal` component reacts to the `UserClickedOpenModal`, `UserClickedCloseModal` and
`UserClickedOutOfModal` to handle its open/close state. The component filters out the events which
payload doesn't match its `modalId` prop and reacts only to those who match this criteria.

## Basic usage

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
  import { BaseIdModalOpen, BaseIdModal, BaseIdModalClose } from '@empathy/x-components';

  export default {
    name: 'TestModal',
    components: {
      BaseIdModalOpen,
      BaseIdModal,
      BaseIdModalClose
    }
  };
</script>
```
</docs>
