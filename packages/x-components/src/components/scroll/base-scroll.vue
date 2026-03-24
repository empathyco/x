<template>
  <div
    ref="baseScrollEl"
    class="x-scroll x-base-scroll"
    data-test="base-scroll"
    @scroll="throttledStoreScrollData"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import type { PropType, SetupContext } from 'vue'
import type { XEvent } from '../../wiring/events.types'
import { defineComponent, ref } from 'vue'
import { useScroll } from './use-scroll'

/**
 * Base scroll component that depending on the user interactivity emits different events for
 * knowing when the user scrolls, the direction of scroll and if user reaches the start or end.
 *
 * @public
 */
export default defineComponent({
  name: 'BaseScroll',
  props: {
    /**
     * Distance to the end of the scroll that when reached will emit the
     * `scroll:about-to-end` event.
     *
     * @public
     */
    distanceToBottom: {
      type: Number,
      default: 100,
    },
    /**
     * Positive vertical distance to still consider that the element is the first one visible.
     * For example, if set to 100, after scrolling 100 pixels, the first rendered element
     * will still be considered the first one.
     */
    firstElementThresholdPx: {
      type: Number,
      default: 100,
    },
    /**
     * Time duration to ignore the subsequent scroll events after an emission.
     * Higher values will decrease events precision but can prevent performance issues.
     *
     * @public
     */
    throttleMs: {
      type: Number,
      default: 100,
    },
    /**
     * If true (default), sets the scroll position to the top when certain events are emitted.
     *
     * @public
     */
    resetOnChange: {
      type: Boolean,
      default: true,
    },
    /**
     * List of events that should reset the scroll when emitted.
     *
     * @public
     */
    resetOn: {
      type: [String, Array] as PropType<XEvent | XEvent[]>,
      default: () => [
        'SearchBoxQueryChanged',
        'SortChanged',
        'SelectedFiltersChanged',
        'SelectedFiltersForRequestChanged',
        'SelectedRelatedTagsChanged',
        'UserChangedExtraParams',
      ],
    },
  },
  emits: [
    'scroll',
    'scroll:at-start',
    'scroll:almost-at-end',
    'scroll:at-end',
    'scroll:direction-change',
  ],
  setup(props, context) {
    const baseScrollEl = ref<HTMLElement>()

    const { throttledStoreScrollData } = useScroll(
      props,
      context as SetupContext<any>,
      baseScrollEl,
    )

    return {
      throttledStoreScrollData,
      baseScrollEl,
    }
  },
})
</script>

<docs lang="mdx">
## Examples

### Basic usage

This is a highly configurable component that manages the scroll state of an element and emits events
for scroll position, direction, when reaching the start or end, and when about reaching the end.

```vue
<template>
  <BaseScroll
    @scroll="onScroll"
    @scroll:direction-change="onDirectionChange"
    @scroll:at-start="onAtStart"
    @scroll:almost-at-end="onAlmostAtEnd"
    @scroll:at-end="onAtEnd"
    :throttleMs="1000"
    :distanceToBottom="200"
  >
    <div class="content-scroll">
      <span>content1</span>
      <span>content2</span>
    </div>
  </BaseScroll>
</template>

<script setup>
import { BaseScroll } from '@empathyco/x-components'
function onScroll(position) {
  console.log('scroll', position)
}
function onDirectionChange(direction) {
  console.log('scroll:direction-change', direction)
}
function onAtStart() {
  console.log('scroll:at-start')
}
function onAlmostAtEnd(distance) {
  console.log('scroll:almost-at-end', distance)
}
function onAtEnd() {
  console.log('scroll:at-end')
}
</script>
```

### Avoid reset scroll on query change

Set `resetOnChange` to `false` to prevent scroll reset on query change (default is `true`).

```vue
<template>
  <BaseScroll @scroll="onScroll" :resetOnChange="false">
    <div class="content-scroll">
      <span>content1</span>
      <span>content2</span>
    </div>
  </BaseScroll>
</template>

<script setup>
import { BaseScroll } from '@empathyco/x-components'
function onScroll(position) {
  console.log('scroll', position)
}
</script>
```

### Reset scroll

Configure which events reset the scroll position using the `resetOn` prop.

```vue
<template>
  <BaseScroll @scroll="onScroll" :resetOn="resetScrollEvents">
    <div class="content-scroll">
      <span>content1</span>
      <span>content2</span>
    </div>
  </BaseScroll>
</template>

<script setup>
import { BaseScroll } from '@empathyco/x-components'
const resetScrollEvents = ['UserAcceptedAQuery']
function onScroll(position) {
  console.log('scroll', position)
}
</script>
```

## Vue Events

- `scroll`: emitted after the user scrolls in this container. Payload: scroll top distance in pixels.
- `scroll:direction-change`: emitted when the user changes the scroll direction. Payload: new direction.
- `scroll:at-start`: emitted when the user scrolls to the initial position.
- `scroll:almost-at-end`: emitted when the user is about to reach the bottom.
- `scroll:at-end`: emitted when the user has reached the bottom.
</docs>
