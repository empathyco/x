<script lang="ts">
  import { Component } from 'vue-property-decorator';
  import { Subscription } from 'rxjs';
  import { reduce } from '../utils/object';
  import { XEventListeners } from '../x-installer/api/api.types';
  import { NoElement } from './no-element';

  /**
   * This component helps subscribing to any {@link XEvent} with custom callbacks using Vue
   * listeners API.
   *
   * @public
   */
  @Component
  export default class GlobalXBus extends NoElement {
    /**
     * Object with the {@link XEvent} listeners.
     *
     * @internal
     */
    public $listeners!: XEventListeners;

    created(): void {
      this.handleXEventSubscription();
    }

    /**
     * Handles a subscription to all the events provided in the listeners with the function that
     * will execute the callback. Also unsubscribes on beforeDestroy.
     *
     * @internal
     */
    protected handleXEventSubscription(): void {
      const subscription = reduce(
        this.$listeners,
        (subscription, eventName, callback) => {
          return subscription.add(
            this.$x.on(eventName, true).subscribe(({ eventPayload, metadata }) => {
              callback(eventPayload as never, metadata);
            })
          );
        },
        new Subscription()
      );

      this.$on('hook:beforeDestroy', () => {
        subscription.unsubscribe();
      });
    }
  }
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
