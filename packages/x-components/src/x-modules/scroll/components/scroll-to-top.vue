<template>
  <component :is="animation">
    <BaseEventButton
      v-if="isVisible"
      class="x-scroll-to-top x-button"
      data-test="scroll-to-top"
      aria-label="Scroll to top"
      :events="events"
    >
      <!-- @slot (Required) Button content with a text, an icon or both -->
      <slot />
    </BaseEventButton>
  </component>
</template>

<script lang="ts">
import type { XEventsTypes } from '../../../wiring'
import { computed, defineComponent } from 'vue'
import { BaseEventButton, NoAnimation } from '../../../components'
import { useState } from '../../../composables'
import { AnimationProp } from '../../../types'
import { scrollXModule } from '../x-module'
import { MainScrollId } from './scroll.const'

/**
 * The `ScrollToTop` component is a button that the user can click to make a container scroll
 * up to its initial position.
 *
 * @public
 */
export default defineComponent({
  name: 'ScrollToTop',
  xModule: scrollXModule.name,
  components: { BaseEventButton },
  props: {
    /**
     * Animation to use for showing/hiding the button.
     *
     * @public
     */
    animation: {
      type: AnimationProp,
      default: () => NoAnimation,
    },
    /**
     * Threshold in pixels from the top to show the button.
     *
     * @public
     */
    thresholdPx: Number,
    /**
     * Id of the target scroll component.
     *
     * @public
     */
    scrollId: {
      type: String,
      default: MainScrollId,
    },
  },
  setup(props) {
    /**
     * State of all the scroll components in this module.
     *
     * @internal
     */
    // TODO: Directly retrieve the needed data in this computed property
    const { data } = useState('scroll')

    /**
     * The scroll data retrieved for this component.
     *
     * @returns The scroll data for this component if a valid {@link ScrollToTop.scrollId} has been
     * passed. Otherwise it returns `null`.
     * @internal
     */
    const scrollData = computed(() => {
      return props.scrollId && data.value[props.scrollId]
        ? data.value[props.scrollId]
        : {
            position: 0,
            direction: 'UP',
            hasReachedStart: false,
            hasAlmostReachedEnd: false,
            hasReachedEnd: false,
          }
    })

    /**
     * Event that will be emitted when the scroll to top is clicked.
     *
     * @returns The event to be emitted when the scroll to top is clicked. The id as a payload.
     * @internal
     */
    const events = computed(
      (): Partial<XEventsTypes> => ({ UserClickedScrollToTop: props.scrollId }),
    )

    /**
     * Checks if the thresholdPx prop has been provided and if it is a number.
     *
     * @returns If the thresholdPx is a number or not.
     * @internal
     */
    const useThresholdStrategy = computed(() => typeof props.thresholdPx === 'number')

    /**
     * Checks if the threshold has been reached in case the threshold strategy is in use.
     *
     * @returns If the scrollTop is bigger than the thresholdPx.
     * @internal
     */
    const isThresholdReached = computed(
      () => useThresholdStrategy.value && scrollData.value.position > props.thresholdPx!,
    )

    /**
     * Returns if the scroll has almost reached its end or not.
     *
     * @returns True if the scroll has almost reached the end and the user is still scrolling down.
     * @internal
     */
    const hasAlmostReachedScrollEnd = computed(
      () => scrollData.value.hasAlmostReachedEnd && scrollData.value.direction === 'DOWN',
    )

    /**
     * Whether if the button is visible or not depending on the strategy being used.
     *
     * @returns If the button should be visible or not.
     * @internal
     */
    const isVisible = computed(() =>
      useThresholdStrategy.value ? isThresholdReached.value : hasAlmostReachedScrollEnd.value,
    )

    return {
      events,
      isVisible,
    }
  },
})
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`UserClickedScrollToTop`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the button. The event payload is the id of the scroll
  that is going to be scrolled.

## Examples

### Basic example

The component renders whatever is passed to it in the default slot and scrolls to top the scroll
with an id `scrollId`.

It also receives an optional threshold in pixels. When the threshold is reached from the top, the
component will be shown once the user scrolls `UP`.

If this parameter is not provided the button will be visible when the user almost reaches the end of
the scroll.

```vue
<template>
  <div>
    <ScrollToTop scroll-id="scrollId" :threshold-px="1000">
      <span>Scroll to top</span>
    </ScrollToTop>
  </div>
</template>

<script setup>
import { ScrollToTop } from '@empathyco/x-components/scroll'
</script>
```
</docs>
