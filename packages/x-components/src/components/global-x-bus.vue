<script lang="ts">
  import { Component } from 'vue-property-decorator';
  import { Subscription } from 'rxjs';
  import { forEach } from '../utils';
  import { WireMetadata, XEvent, XEventPayload } from '../wiring';
  import { NoElement } from './no-element';

  type EventListeners = Record<
    XEvent,
    (payload: XEventPayload<XEvent>, metadata?: WireMetadata) => unknown
  >;

  /**
   * A component which purpose is to receive callbacks associated with and events and handle the
   * subscriptions to the bus.
   *
   * @remarks
   * The component uses the listeners in a way it allows to associate a determinate callback with
   * an {@link XEvent}. Example format: `@UserAcceptedAQuery="callback"`.
   *
   * @public
   */
  @Component
  export default class GlobalXBus extends NoElement {
    /**
     * All the current event subscriptions.
     *
     * @internal
     */
    protected eventSubscriptions = {} as Record<XEvent, Subscription>;

    /**
     * Retrieves the listeners object.
     *
     * @returns The $listeners.
     *
     * @internal
     */
    protected get listeners(): EventListeners {
      return this.$listeners as EventListeners;
    }

    /**
     * Subscribes to all the events provided in the listeners with the function that will
     * execute the callback and will emit a {@link XEventsTypes.SnippetCallbackExecuted} event.
     * All the subscriptions get stored in {@link GlobalXBus.eventSubscriptions}.
     *
     * @internal
     */
    protected handleEventSubscriptions(): void {
      forEach(this.listeners, (eventName, callback) => {
        this.eventSubscriptions[eventName] = this.$x
          .on(eventName, true)
          .subscribe(({ eventPayload, metadata }) => {
            const callbackReturn = callback(eventPayload, metadata);
            this.$x.emit('SnippetCallbackExecuted', { event: eventName, callbackReturn });
          });
      });
    }

    /**
     * Unsubscribe to all subscriptions in {@link GlobalXBus.eventSubscriptions}.
     *
     * @internal
     */
    protected unsubscribeEvents(): void {
      forEach(this.eventSubscriptions, (_, subscription) => {
        subscription.unsubscribe();
      });
    }

    mounted(): void {
      this.handleEventSubscriptions();
    }

    beforeDestroy(): void {
      this.unsubscribeEvents();
    }
  }
</script>

<docs lang="mdx">
# Examples

## Basic example

This component does not render anything. Its only use is to associate an existing event with a
function that you can provide and will act as a callback when the event is triggered. You can pass
as many listeners as you want.

Once the component is destroyed, all the subscriptions get cancelled.

```vue
<template>
  <GlobalXBus @UserAcceptedAQuery="printQuery" />
</template>

<script>
  import { GlobalXBus } from '@empathyco/x-components';

  export default {
    name: 'GlobalXBusTest',
    components: {
      GlobalXBus
    },
    methods: {
      printQuery(query, metadata) {
        console.log('My new query is:', query);
        console.log('And has been triggered by this DOM element:', metadata.target);
      }
    }
  };
</script>
```

## Events

A list of events that the component will emit:

- `SnippetCallbackExecuted`: the event is emitted when any of the provided callbacks is fired
  because its associated event has been emitted.
</docs>
