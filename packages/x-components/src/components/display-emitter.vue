<template>
  <NoElement ref="root">
    <slot />
  </NoElement>
</template>

<script lang="ts">
  import { defineComponent, onUnmounted, PropType, Ref, ref } from 'vue';
  import { MaybeElement } from '@vueuse/core';
  import { TaggingRequest } from '@empathyco/x-types';
  import { useEmitDisplayEvent } from '../composables';
  import { WireMetadata } from '../wiring';
  import { NoElement } from './no-element';

  /**
   * A component that emits a display event when it first appears in the viewport.
   */
  export default defineComponent({
    components: {
      NoElement
    },
    props: {
      /**
       * The payload for the display event emit.
       *
       * @public
       */
      payload: {
        type: Object as PropType<TaggingRequest>,
        required: true
      },
      /**
       * Optional event metadata.
       *
       * @public
       */
      eventMetadata: {
        type: Object as PropType<Omit<WireMetadata, 'moduleName' | 'origin' | 'location'>>
      }
    },
    setup(props) {
      const root = ref(null);
      const { unwatchDisplay } = useEmitDisplayEvent({
        element: root as Ref<MaybeElement>,
        taggingRequest: props.payload,
        ...(props.eventMetadata && { eventMetadata: props.eventMetadata })
      });

      onUnmounted(unwatchDisplay);

      return {
        root
      };
    }
  });
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`TrackableElementDisplayed`](https://github.com/empathyco/x/blob/main/packages/x-components/src/x-modules/tagging/events.types.ts)

## See it in action

In this example, the `DisplayEmitter` component will emit the `TrackableElementDisplayed` event when
the div inside first appears in the viewport.

```vue
<template>
  <DisplayEmitter :payload="{ url: 'tagging/url', params: {} }">
    <div>I'm displaying</div>
  </DisplayEmitter>
</template>
<script>
  import { DisplayEmitter } from '@empathyco/x-components';
  export default {
    name: 'DisplayEmitterDemo',
    components: {
      DisplayEmitter
    }
  };
</script>
```
</docs>
