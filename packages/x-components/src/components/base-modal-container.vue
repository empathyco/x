<template>
  <div
    v-if="isOpen"
    @click.prevent.stop="emitClose($event)"
    class="x-modal-container"
    data-test="modal-container"
  >
    <!-- @slot (Required) to add content to the modal container -->
    <slot />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { XEvent } from '../wiring/events.types';
  import { XOn } from './decorators';

  /**
   * Component containing a modal container that emits a {@link XEventsTypes.UserClosedX} when
   * clicking outside the content rendered in the default slot and can receive, through the
   * eventsToCloseModal prop, a list of {@link XEvent | xEvents} to listen to in order to close
   * also the modal. The default slot offers the possibility to customize the modal content.
   *
   * @public
   */
  @Component
  export default class BaseModalContainer extends Vue {
    /**
     * Array of {@link XEvent | xEvents} to listen to close the modal.
     */
    @Prop({ default: () => ['UserClosedX'] })
    protected eventsToCloseModal!: XEvent[];

    /**
     * The modal container is open.
     */
    protected isOpen = false;

    /**
     * Open modal container.
     *
     * @public
     */
    @XOn('UserOpenedX')
    openModalContainer(): void {
      this.isOpen = true;
    }

    /**
     * Close modal container.
     *
     * @public
     */
    @XOn(component => (component as BaseModalContainer).eventsToCloseModal)
    closeModalContainer(): void {
      this.isOpen = false;
    }

    /**
     * Emits the {@link XEventsTypes.UserClosedX} when closing the container.
     *
     * @param event - The DOM event.
     * @public
     */
    protected emitClose(event: Event): void {
      if (event.target === this.$el) {
        this.$x.emit('UserClosedX', undefined, { target: this.$el as HTMLElement });
      }
    }
  }
</script>

<style lang="scss">
  .x-modal-container {
    background-color: rgba(0, 0, 0, 0.7);
    height: 100vh;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
  }
</style>

<docs>
  #Examples

  As a reminder, this component will emit UserClosedX event when closed and will listen to the
  events passed through the ```eventsToCloseModal``` prop to close the modal.

  ## Basic examples

  The component rendering a search input and popular searches. It will also close the modal when
  myEvent is emitted.

  ```vue
  <BaseModalContainer :eventsToCloseModal="['myEvent']">
    <SearchInput />
    <PopularSearches />
  </BaseModalContainer>
  ```

  The component rendering a search input, query suggestions and history queries. It will also close
  the modal when myFirstEvent or mySecondEvent are emitted.

  ```vue
  <BaseModalContainer :eventsToCloseModal="['myFirstEvent', 'mySecondEvent']">
    <SearchInput />
    <QuerySuggestions />
    <HistoryQueries />
    <ClearHistoryQueries />
  </BaseModalContainer>
  ```
</docs>
