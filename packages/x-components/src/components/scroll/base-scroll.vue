<template>
  <div
    ref="baseScrollEl"
    class="xds:scroll x-base-scroll"
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
## Example

The `BaseScroll` is a component that manages the state of scroll of a specified element. The
component does the necessary calculations for knowing the direction of scroll, if the scroll has
reached to start or to end, and is about to reaching to end. The components emits the next events
depending of movement that realize the user:

```vue
<template>
  <BaseScroll
    @scroll="scroll"
    @scroll:direction-change="scrollDirectionChange"
    @scroll:at-start="scrollAtStart"
    @scroll:almost-at-end="scrollAlmostAtEnd"
    @scroll:at-end="scrollAtEnd"
    :throttleMs="1000"
    :distanceToBottom="200"
  >
    <template>
      <div class="content-scroll">
        <span>content1</span>
        <span>content1</span>
      </div>
    </template>
  </BaseScroll>
</template>

<script>
import { BaseScroll } from '@empathyco/x-components'

export default {
  name: 'ScrollTest',
  components: {
    BaseScroll,
  },
  methods: {
    scroll(position) {
      console.log('scroll', position)
    },
    scrollDirectionChange(direction) {
      console.log('scroll:direction-change', direction)
    },
    scrollAtStart() {
      console.log('scroll:at-start')
    },
    scrollAlmostAtEnd(distance) {
      console.log('scroll:almost-at-end', distance)
    },
    scrollAtEnd() {
      console.log('scroll:at-end')
    },
  },
}
</script>
```

### Avoid reset scroll on query change

Set to false the reset scroll on query change feature which is true by default.

```vue
<template>
  <BaseScroll @scroll="scroll" :resetOnChange="false">
    <template>
      <div class="content-scroll">
        <span>content1</span>
        <span>content1</span>
      </div>
    </template>
  </BaseScroll>
</template>

<script>
import { BaseScroll } from '@empathyco/x-components'

export default {
  name: 'ScrollTest',
  components: {
    BaseScroll,
  },
  methods: {
    scroll(position) {
      console.log('scroll', position)
    },
  },
}
</script>
```

### Reset scroll

You can configure which events reset the scroll position using the `resetOn` prop.

```vue
<template>
  <BaseScroll @scroll="scroll" :resetOn="resetScrollEvents">
    <template>
      <div class="content-scroll">
        <span>content1</span>
        <span>content1</span>
      </div>
    </template>
  </BaseScroll>
</template>

<script>
import { BaseScroll } from '@empathyco/x-components'

export default {
  name: 'ScrollTest',
  components: {
    BaseScroll,
  },
  data() {
    return {
      resetScrollEvents: ['UserAcceptedAQuery'],
    }
  },
  methods: {
    scroll(position) {
      console.log('scroll', position)
    },
  },
}
</script>
```

## Vue Events:

- `scroll`: the event is emitted after the user scrolls in this container. The payload is the scroll
  top distance in pixels.
- `scroll:direction-change`: the event is emitted when the user changes the scroll direction. The
  payload is the new scrolling direction.
- `scroll:at-start`: the event is emitted when the user scrolls up to the initial position of the
  scroll.
- `scroll:almost-at-end`: the event is emitted when the user is about to reach the bottom part of
  the scroll.
- `scroll:at-end`: the event is emitted when the user has reached the bottom part of the scroll.
</docs>
