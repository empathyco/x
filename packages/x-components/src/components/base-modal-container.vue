<template>
  <div v-if="isOpen" class="x-modal-container" data-test="modal-container">
    <!-- @slot (Required) to add content to the modal container -->
    <div @click.stop class="x-modal-container__content" data-test="modal-container-content">
      <slot />
    </div>
    <div
      v-if="displayOverlay"
      class="x-modal-container__overlay"
      data-test="modal-container-overlay"
    />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { XEvent } from '../wiring/events.types';
  import { WirePayload } from '../wiring/wiring.types';

  /**
   * Component containing a modal container that emits a {@link XEventsTypes.UserClosedX} when
   * clicking outside the content rendered in the default slot and can receive, through the
   * eventsToCloseModal prop, a list of {@link XEvent | xEvents} to listen to in order to close
   * also the modal, eventsToOpenModal prop,  another list of {@link XEvent | xEvents} to customize
   * the events to listen to open the modal container and a prop, displayOverlay, to display an
   * overlay over the rest of the html. The default slot offers the possibility to customize the
   * modal content.
   *
   * @public
   */
  @Component
  export default class BaseModalContainer extends Vue {
    /**
     * Enable or disable the overlay.
     */
    @Prop({ default: true })
    protected displayOverlay!: boolean;

    /**
     * Array of {@link XEvent | xEvents} to listen to open the modal.
     */
    @Prop({ default: () => ['UserOpenedX'] })
    protected eventsToOpenModal!: XEvent[];

    /**
     * Array of {@link XEvent | xEvents} to listen to close the modal.
     */
    @Prop({ default: () => ['UserClosedX'] })
    protected eventsToCloseModal!: XEvent[];

    /**
     * Event to emit when closing the modal.
     */
    @Prop({ default: 'UserClosedX' })
    protected eventToEmitOnClose!: XEvent;

    /**
     * The modal container is open.
     */
    protected isOpen = false;

    /**
     * The element that opened the modal.
     */
    protected openerElement: EventTarget | null = null;

    mounted(): void {
      this.registerEvents(this.eventsToOpenModal, this.openModalContainer.bind(this));
      this.registerEvents(this.eventsToCloseModal, this.closeModalContainer.bind(this));
    }

    beforeDestroy(): void {
      this.openerElement = null;
      // eslint-disable-next-line @typescript-eslint/unbound-method
      document.body.removeEventListener('click', this.emitClose);
    }

    /**
     * Registers a list of events executing a callback.
     *
     * @param events - List of events to listen to.
     * @param callback - Function to execute.
     *
     * @internal
     */
    private registerEvents(events: XEvent[], callback: (...args: any) => void): void {
      events.forEach(event => {
        const subscription = this.$x.on(event, true).subscribe(callback);
        this.$on('hook:beforeDestroy', () => subscription.unsubscribe());
      });
    }

    /**
     * Open modal container.
     *
     * @public
     */
    openModalContainer({ metadata }: WirePayload<void>): void {
      if (!this.isOpen) {
        this.openerElement = metadata.target ?? null;
        this.isOpen = true;
        // eslint-disable-next-line @typescript-eslint/unbound-method
        document.body.addEventListener('click', this.emitClose);
      }
    }

    /**
     * Close modal container.
     *
     * @public
     */
    closeModalContainer(): void {
      if (this.isOpen) {
        this.openerElement = null;
        this.isOpen = false;
        // eslint-disable-next-line @typescript-eslint/unbound-method
        document.body.removeEventListener('click', this.emitClose);
      }
    }

    /**
     * Emits the event defined in the prop eventToEmitOnClose, by default
     * {@link XEventsTypes.UserClosedX}, when closing the container.
     *
     * @param event - The DOM event.
     *
     * @public
     */
    protected emitClose(event: Event): void {
      if (this.openerElement === null || this.openerElement !== event.target) {
        this.$x.emit(this.eventToEmitOnClose, undefined, { target: this.$el as HTMLElement });
      }
    }
  }
</script>

<style lang="scss">
  .x-modal-container__overlay {
    background-color: rgba(0, 0, 0, 0.7);
    height: 100%;
    left: 0;
    position: absolute;
    width: 100%;
    z-index: 1;
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

  Defining the events to listen to in order to open the modal and the event to emit on closing.

  ```vue
  <BaseModalContainer
    :eventsToOpenModal="['UserOpenedEmpathize']"
    :eventsToCloseModal="['UserClosedEmpathize']"
    eventToEmitOnClose="UserClosedEmpathize"
  >
    <SearchInput />
    <QuerySuggestions />
    <HistoryQueries />
    <ClearHistoryQueries />
  </BaseModalContainer>
  ```

  Removing the overlay.

  ```vue
  <BaseModalContainer :displayOverlay="false">
    <SearchInput />
    <QuerySuggestions />
  </BaseModalContainer>
  ```
</docs>
