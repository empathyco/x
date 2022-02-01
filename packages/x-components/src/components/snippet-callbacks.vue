<template>
  <GlobalXBus v-on="eventListeners" />
</template>

<script lang="ts">
  import { Component, Inject } from 'vue-property-decorator';
  import Vue from 'vue';
  import { map } from '../utils/object';
  import { WireMetadata } from '../wiring';
  import { SnippetConfig, XEventListeners } from '../x-installer/api/api.types';
  import GlobalXBus from './global-x-bus.vue';

  /**
   * This component subscribes to any {@link XEvent} with a custom callbacks provided by the snippet
   * configuration.
   *
   * @public
   */
  @Component({
    components: { GlobalXBus }
  })
  export default class SnippetCallbacks extends Vue {
    /**
     * Injects {@link SnippetConfig} provided by an ancestor as snippetConfig.
     *
     * @internal
     */
    @Inject('snippetConfig')
    public snippetConfig!: SnippetConfig;

    /**
     * It maps all the callbacks provided by the snippetConfig and adds an emit to each one.
     *
     * @returns The event listeners with the {@link XEventsTypes.SnippetCallbackExecuted} emit in
     * the callback.
     *
     * @internal
     *
     */
    protected get eventListeners(): XEventListeners {
      const { callbacks } = this.snippetConfig;
      return callbacks
        ? map(callbacks, (eventName, callback) => {
            return (payload: unknown, metadata: WireMetadata) => {
              const callbackReturn = callback(payload as never, metadata);
              this.$x.emit('SnippetCallbackExecuted', {
                event: eventName,
                callbackReturn,
                payload: payload as never,
                metadata
              });
            };
          })
        : ({} as XEventListeners);
    }
  }
</script>

<docs lang="mdx">
## Events

The `SnippetCallbacks` will emit the `SnippetCallbackExecuted` each time a callback provided by the
snippetConfig is fired.

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
