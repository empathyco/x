<template>
  <GlobalXBus v-on="eventListeners" />
</template>

<script lang="ts">
  import { map } from '@empathyco/x-utils';
  import { computed, defineComponent } from 'vue';
  import { WireMetadata } from '../wiring';
  import { SnippetConfig, XEventListeners } from '../x-installer/api/api.types';
  import { useHybridInject } from '../composables';
  import { useXBus } from '../composables/use-x-bus';
  import GlobalXBus from './global-x-bus.vue';

  /**
   * This component subscribes to any {@link XEvent} with a custom callbacks provided by the snippet
   * configuration.
   *
   * @public
   */
  export default defineComponent({
    name: 'SnippetCallbacks',
    components: { GlobalXBus },
    setup() {
      const xBus = useXBus();

      /**
       * Injects {@link SnippetConfig} provided by an ancestor as snippetConfig.
       *
       * @internal
       */
      const snippetConfig = useHybridInject<SnippetConfig>('snippetConfig');

      /**
       * It maps all the callbacks provided by the snippetConfig and adds an emit to each one.
       *
       * @returns The event listeners with the {@link XEventsTypes.SnippetCallbackExecuted} emit in
       * the callback.
       *
       * @internal
       *
       */
      const eventListeners = computed<XEventListeners>(() => {
        const callbacks = snippetConfig?.callbacks;

        return callbacks
          ? map(callbacks, (eventName, callback) => {
              return (payload: unknown, metadata: WireMetadata) => {
                const callbackReturn = callback(payload as never, metadata);
                xBus.emit('SnippetCallbackExecuted', {
                  event: eventName,
                  callbackReturn,
                  payload: payload as never,
                  metadata
                });
              };
            })
          : ({} as XEventListeners);
      });

      return { eventListeners };
    }
  });
</script>

<docs lang="mdx">
## Events

The `SnippetCallbacks` will emit these events:

- [`SnippetCallbackExecuted`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  each time a callback provided by the snippetConfig is fired.

## See it in action

This component does not render anything. Its only responsibility is to receive any callback that
will be triggered once its listened event is emitted.

```vue
<template>
  <SnippetCallbacks />
</template>

<script>
  import { SnippetCallbacks } from '@empathyco/x-components';
  export default {
    name: 'SnippetCallbacksTest',
    components: {
      SnippetCallbacks
    }
  };
</script>
```
</docs>
