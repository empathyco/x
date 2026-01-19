<template>
  <BaseScroll
    :id="id"
    ref="scrollRef"
    @scroll="emitScroll"
    @scroll:direction-change="emitScrollDirectionChange"
    @scroll:at-start="emitScrollAtStart"
    @scroll:almost-at-end="emitScrollAlmostAtEnd"
    @scroll:at-end="emitScrollAtEnd"
  >
    <slot />
  </BaseScroll>
</template>

<script lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { ScrollDirection } from '../../../components/scroll/scroll.types'
import type { WireMetadata } from '../../../wiring/wiring.types'
import { defineComponent, ref } from 'vue'
import BaseScroll from '../../../components/scroll/base-scroll.vue'
import { use$x } from '../../../composables/use-$x'
import { scrollXModule } from '../x-module'
import { MainScrollId } from './scroll.const'

/**
 * Scrollable container that emits scroll related X Events. It exposes all the listeners
 * and props from the {@link BaseScroll} component.
 *
 * @public
 */
export default defineComponent({
  name: 'Scroll',
  xModule: scrollXModule.name,
  components: { BaseScroll },
  props: {
    /**
     * Id to identify the component.
     *
     * @public
     */
    id: {
      type: String,
      default: MainScrollId,
    },
  },
  setup(props) {
    const $x = use$x()

    const scrollRef = ref<ComponentPublicInstance>()

    /**
     * Creates a {@link WireMetadata} metadata object for all the emitted events.
     *
     * @internal
     * @returns A new {@link WireMetadata} object.
     */
    const createEventMetadata = (): Partial<WireMetadata> => {
      return {
        target: scrollRef.value?.$el as HTMLElement,
        id: props.id,
      }
    }

    /**
     * Emits the `UserScrolled` event.
     *
     * @param position - The new position of scroll.
     * @internal
     */
    const emitScroll = (position: number) => {
      $x.emit('UserScrolled', position, createEventMetadata())
    }

    /**
     * Emits the `UserChangedScrollDirection` event when the scrolling direction has changed.
     *
     * @param direction - The new direction of scroll.
     * @internal
     */
    const emitScrollDirectionChange = (direction: ScrollDirection) => {
      $x.emit('UserChangedScrollDirection', direction, createEventMetadata())
    }

    /**
     * Emits the 'UserReachedScrollStart' event when the user reaches the start.
     *
     * @param isAtStart - A boolean indicating if the scroll is at the ending position.
     * @internal
     */
    const emitScrollAtStart = (isAtStart: boolean) => {
      $x.emit('UserReachedScrollStart', isAtStart, createEventMetadata())
    }

    /**
     * Emits the 'UserAlmostReachedScrollEnd' event when the user is about to reach to end.
     *
     * @param isAlmostAtEnd - A boolean indicating if the scroll is almost at its ending position.
     * @internal
     */
    const emitScrollAlmostAtEnd = (isAlmostAtEnd: boolean) => {
      $x.emit('UserAlmostReachedScrollEnd', isAlmostAtEnd, createEventMetadata())
    }

    /**
     * Emits the 'UserReachedScrollEnd' event when the user is about to reach to end.
     *
     * @param isAtEnd - A boolean indicating if the scroll is at the ending position.
     * @internal
     */
    const emitScrollAtEnd = (isAtEnd: boolean) => {
      $x.emit('UserReachedScrollEnd', isAtEnd, createEventMetadata())
    }

    /**
     * Scrolls to initial position when the user has clicked the scroll to top button.
     *
     * @param scrollId - {@link XEventsTypes.UserClickedScrollToTop}.
     * @internal
     */
    $x.on('UserClickedScrollToTop', false).subscribe((scrollId: string) => {
      if (scrollId === props.id && scrollRef.value) {
        ;(scrollRef.value.$el as HTMLElement).scrollTo({ top: 0, behavior: 'smooth' })
      }
    })

    return {
      scrollRef,
      emitScrollAtEnd,
      emitScrollAlmostAtEnd,
      emitScrollAtStart,
      emitScrollDirectionChange,
      emitScroll,
    }
  },
})
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`UserScrolled`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  emitted after the user scrolls in this container. The payload is the scroll top distance in
  pixels.
- [`UserChangedScrollDirection`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  emitted when the user changes the scroll direction. The payload is the new scrolling direction.
- [`UserReachedScrollStart`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  emitted when the user scrolls up to the initial position of the scroll.
- [`UserAlmostReachedScrollEnd`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  emitted when the user is about to reach the bottom part of the scroll.
- [`UserReachedScrollEnd`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  emitted when the user has reached the bottom part of the scroll.

## Examples

The Scroll is a component that wraps the BaseScroll and provides it for a unique id.

### Basic usage

#### Overriding the properties

It renders an element with scroll, with the content passed in the `default slot`.

```vue
<template>
  <Scroll id="exampleScrollId" :throttleMs="50" :distanceToBottom="300">
    <div class="content-scroll">
      <span>content1</span>
      <span>content2</span>
    </div>
  </Scroll>
</template>

<script setup>
import { Scroll } from '@empathyco/x-components/scroll'
</script>
```

#### Using scroll events.

```vue
<template>
  <Scroll
    @scroll="scroll"
    @scroll:direction-change="scrollDirectionChange"
    @scroll:at-start="scrollAtStart"
    @scroll:almost-at-end="scrollAlmostAtEnd"
    @scroll:at-end="scrollAtEnd"
    id="exampleScrollId"
    throttleMs="50"
    distanceToBottom="300"
  >
    <div class="content-scroll">
      <span>content1</span>
      <span>content2</span>
    </div>
  </Scroll>
</template>

<script setup>
import { Scroll } from '@empathyco/x-components/scroll'

function scroll(position) {
  console.log('scroll', position)
}
function scrollDirectionChange(direction) {
  console.log('scroll:direction-change', direction)
}
function scrollAtStart(isAtStart) {
  console.log('scroll:at-start', isAtStart)
}
function scrollAlmostAtEnd(isAlmostAtEnd) {
  console.log('scroll:almost-at-end', isAlmostAtEnd)
}
function scrollAtEnd(isAtEnd) {
  console.log('scroll:at-end', isAtEnd)
}
</script>
```

#### Using XEvents.

You can use the XEvents API to subscribe to events programmatically:

```vue
<template>
  <Scroll throttleMs="50" distanceToBottom="300">
    <div class="content-scroll">
      <span>content1</span>
      <span>content2</span>
    </div>
  </Scroll>
</template>

<script setup>
import { Scroll } from '@empathyco/x-components/scroll'
import { onMounted, getCurrentInstance } from 'vue'

onMounted(() => {
  const vm = getCurrentInstance()?.proxy
  if (vm && vm.$x) {
    vm.$x.on('UserScrolled').subscribe(distance => {
      console.log(distance)
    })
    vm.$x.on('UserChangedScrollDirection').subscribe(direction => {
      console.log(direction)
    })
    vm.$x.on('UserReachedScrollStart').subscribe(isAtStart => {
      console.log(isAtStart)
    })
    vm.$x.on('UserAlmostReachedScrollEnd').subscribe(isAlmostAtEnd => {
      console.log(isAlmostAtEnd)
    })
    vm.$x.on('UserReachedScrollEnd').subscribe(isAtEnd => {
      console.log(isAtEnd)
    })
  }
})
</script>
```
</docs>
