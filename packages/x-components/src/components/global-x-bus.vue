<script lang="ts">
  import { reduce } from '@empathyco/x-utils';
  import { Observable, Subscription } from 'rxjs';
  import { EventPayload, SubjectPayload } from '@empathyco/x-bus';
  import { defineComponent, getCurrentInstance, onBeforeUnmount } from 'vue';
  import { WireMetadata } from '../wiring/wiring.types';
  import { XEventsTypes } from '../wiring/events.types';
  import { useXBus } from '../composables/use-x-bus';
  import { XEventListeners } from '../x-installer/api/api.types';
  import { NoElement } from './no-element';

  /**
   * This component helps subscribing to any {@link XEvent} with custom callbacks using Vue
   * listeners API.
   *
   * @public
   */
  export default defineComponent({
    name: 'GlobalXBus',
    extends: NoElement,

    setup() {
      /**
       * Object with the {@link XEvent} listeners.
       *
       * @internal
       */
      //TODO: When we get to vue 3 remove $listeners and use $attrs instead
      const listeners: XEventListeners = getCurrentInstance()?.proxy?.$listeners ?? {};

      /**
       * Handles a subscription to all the events provided in the listeners with the function that
       * will execute the callback. Also unsubscribes on beforeDestroy.
       *
       * @internal
       */
      const handleXEventSubscription = (): void => {
        const subscription = reduce(
          listeners,
          (subscription, eventName, callback) => {
            subscription.add(
              (
                useXBus().on(eventName, true) as unknown as Observable<
                  SubjectPayload<EventPayload<XEventsTypes, typeof eventName>, WireMetadata>
                >
              ).subscribe(({ eventPayload, metadata }: any) => {
                callback(eventPayload as never, metadata);
              })
            );
            return subscription;
          },
          new Subscription()
        );

        onBeforeUnmount(() => {
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
