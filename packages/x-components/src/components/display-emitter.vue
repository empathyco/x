<script lang="ts">
import type { TaggingRequest } from '@empathyco/x-types'
import type { PropType, WatchStopHandle } from 'vue'
import type { WireMetadata } from '../wiring'
import { defineComponent, getCurrentInstance, onMounted, onUnmounted } from 'vue'
import { useEmitDisplayEvent } from '../composables/use-on-display'

/** A component that emits a display event when it first appears in the viewport. */
export default defineComponent({
  name: 'DisplayEmitter',
  props: {
    /** The payload for the display event emit. */
    payload: {
      type: Object as PropType<TaggingRequest>,
      required: true,
    },
    /** Optional event metadata. */
    eventMetadata: {
      type: Object as PropType<Omit<WireMetadata, 'moduleName' | 'origin' | 'location'>>,
    },
  },
  setup(props, { slots }) {
    let unwatchDisplay: WatchStopHandle | undefined

    onMounted(() => {
      const element = getCurrentInstance()?.proxy?.$el as HTMLElement | undefined
      if (element) {
        unwatchDisplay = useEmitDisplayEvent({
          element,
          taggingRequest: props.payload,
          ...(props.eventMetadata && { eventMetadata: props.eventMetadata }),
        }).unwatchDisplay
      }
    })

    onUnmounted(() => {
      unwatchDisplay?.()
    })

    /*
     * Obtains the vNodes array of the default slot and renders only the first one.
     * It avoids to render a `Fragment` with the vNodes in Vue3 and the same behaviour in Vue2
     * because Vue2 only allows a single root node. Then, `getCurrentInstance()?.proxy?.$el` to
     * retrieve the HTML element in both versions.
     */
    return () => slots.default?.()[0] ?? ''
  },
})
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

<script setup>
import { DisplayEmitter } from '@empathyco/x-components'
</script>
```
</docs>
