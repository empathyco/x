<script lang="ts">
  import { defineComponent } from 'vue';
  import { reduce } from '@empathyco/x-utils';
  import { Observable, Subscription } from 'rxjs';
  import { EventPayload, SubjectPayload } from '@empathyco/x-bus';
  import { XEventListeners } from '../x-installer/api/api.types';
  import { WireMetadata } from '../wiring/wiring.types';
  import { XEventsTypes } from '../wiring/events.types';
  import { use$x } from '../composables/index';

  /**
   * This component helps subscribing to any {@link XEvent} with custom callbacks using Vue
   * listeners API.
   *
   * @public
   */
  export default defineComponent({
    setup() {
      const $x = use$x();
      /**
       * Object with the {@link XEvent} listeners.
       *
       * @internal
       */
      const $listeners!: XEventListeners;

      /**
       * Handles a subscription to all the events provided in the listeners with the function that
       * will execute the callback. Also unsubscribes on beforeDestroy.
       *
       * @internal
       */
      const handleXEventSubscription = (): void => {
        const subscription = reduce(
          $listeners,
          (subscription, eventName, callback) => {
            subscription.add(
              (
                $x.on(eventName, true) as unknown as Observable<
                  SubjectPayload<EventPayload<XEventsTypes, typeof eventName>, WireMetadata>
                >
              ).subscribe(({ eventPayload, metadata }) => {
                callback(eventPayload as never, metadata);
              })
            );
            return subscription;
          },
          new Subscription()
        );

        this.$on('hook:beforeDestroy', () => {
          subscription.unsubscribe();
        });
      };

      handleXEventSubscription();
    }
  });
</script>

<docs lang="mdx">
## Events

This component emits no own events, but you can subscribe to any X Event using Vue listeners

## See it in action

This component does not render anything. Its only responsibility is to facilitate listening to any X
Event by using Vue component listeners.

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
</docs>
