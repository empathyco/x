<script lang="ts">
  import { defineComponent } from 'vue';
  import { XEventListeners } from '../x-installer/api/api.types';
  import { XEvent } from '../wiring/events.types';
  import { useNoElementRender } from '../composables/use-no-element-render';
  import { useXBus } from '../composables/use-x-bus';

  /**
   * This component helps to subscribe to any {@link XEvent} with custom callbacks using Vue
   * listeners API.
   *
   * @public
   */
  export default defineComponent({
    name: 'GlobalXBus',
    setup(_, { listeners, slots }) {
      const xBus = useXBus();

      /**
       * Handles a subscription to all the events provided in the listeners with the function that
       * will execute the callback.
       */
      Object.entries(listeners as XEventListeners).forEach(([eventName, callback]) => {
        xBus.on(eventName as XEvent, true).subscribe(({ eventPayload, metadata }) => {
          callback(eventPayload as never, metadata);
        });
      });

      return () => useNoElementRender(slots);
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
