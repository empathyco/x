<template>
  <button @click="emitEvents">
    <!-- @slot to add content to the button like for example: a text, an icon or both-->
    <slot />
  </button>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { XEvent, XEventsTypes } from '../../wiring';

  /**
   * Component to be reused that renders a `<button>` with the logic of emitting events to the bus
   * on click. The events are passed as an object to prop {@link events}. The keys are the event
   * name and the values are the payload of each event. All events are emitted with its
   * respective payload. If any event doesn't need payload a `undefined` must be passed as value.
   *
   * @public
   */
  @Component
  export default class EventButton extends Vue {
    /**
     * (Required) A object where the keys are the {@link XEvent} and the values
     * are the payload of each event.
     *
     * @public
     */
    @Prop({ required: true })
    protected events!: Partial<XEventsTypes>;

    protected emitEvents(): void {
      Object.entries(this.events).forEach(([event, payload]) => {
        this.$x.emit(event as XEvent, payload);
      });
    }
  }
</script>

<docs>
  #Examples

  ## Basic example

  The event prop is required. It will render a <button></button> that emits the event passed as
  prop with the value as payload on click:

  ```vue
  <EventButton :events="{myEvent: payload}"/>
  ```

  If the event doesn't need payload then `undefined` must be passed:

  ```vue
  <EventButton :events="{myEvent: undefined}"/>
  ```

  It can emit multiple events at the same time:

  ```vue
  <EventButton :events="{myFirstEvent: payload1, mySecondEvent: payload2}"/>
  ```

</docs>
