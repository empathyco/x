<template>
  <component
    :is="animation"
    v-if="isVisible"
    class="xds:input-placeholder x-search-input-placeholder"
    mode="out-in"
  >
    <span :key="message" data-test="search-input-placeholder">
      {{ message }}
    </span>
  </component>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent, onBeforeUnmount, ref, watch } from 'vue'
import { animateTranslate } from '../../../components/animations/animate-translate/animate-translate.factory'
import { use$x } from '../../../composables/use-$x'
import { useState } from '../../../composables/use-state'
import { AnimationProp } from '../../../types'
import { searchBoxXModule } from '../x-module'

/**.
 * This component renders an animated placeholder for the search input in the shape of a list of
 * iterating messages that can be configured to happen always or only when hovering the input
 *
 * @public
 */
export default defineComponent({
  name: 'SearchInputPlaceholder',
  xModule: searchBoxXModule.name,
  props: {
    /**
     * List of messages to animate.
     *
     * @public
     */
    messages: {
      type: Array as PropType<string[]>,
      required: true,
    },
    /**
     * Animation component used for the messages.
     *
     * @public
     */
    animation: {
      type: AnimationProp,
      default: () => animateTranslate('bottom-to-top'),
    },
    /**
     * Time in milliseconds during which each message is visible.
     *
     * @public
     */
    animationIntervalMs: {
      type: Number,
      default: 1500,
    },
    /**
     * Whether the messages animation is active only when hovering the search input or always.
     *
     * @public
     */
    animateOnlyOnHover: Boolean,
  },
  setup(props) {
    const $x = use$x()

    /**.
     * The search box written query
     *
     * @internal
     */
    const { query } = useState('searchBox')

    /**.
     * The search box hover status
     *
     * @internal
     */
    const isSearchBoxHovered = ref(false)

    /**.
     * The search box focus status
     *
     * @internal
     */
    const isSearchBoxFocused = ref(false)

    /**
     * The index used to point to the current animation message in the list.
     *
     * @internal
     */
    const animationMessageIndex = ref(0)

    /**
     * The interval used for the animation.
     *
     * @internal
     */
    const animationInterval = ref<number | undefined>(undefined)

    /**
     * The visibility state of the component.
     *
     * @returns The visibility state based on the search input state (query & focus).
     *
     * @internal
     */
    const isVisible = computed((): boolean => !query.value && !isSearchBoxFocused.value)

    /**
     * The animation state of the component.
     *
     * @returns Whether the animation is active or not.
     *
     * @internal
     */
    const isBeingAnimated = computed(
      (): boolean => isVisible.value && (!props.animateOnlyOnHover || isSearchBoxHovered.value),
    )

    /**
     * The current placeholder message.
     *
     * @returns The message to display as placeholder at any moment.
     *
     * @internal
     */
    const message = computed((): string | undefined =>
      isBeingAnimated.value ? props.messages[animationMessageIndex.value] : props.messages[0],
    )

    /**
     * Clears the interval used for the animation.
     *
     * @internal
     */
    const stopAnimationInterval = (): void => {
      if (animationInterval.value) {
        clearInterval(animationInterval.value)
        animationInterval.value = undefined
      }
    }

    /**
     * Increments animation message index; if the new index exceeds the messages list length, it is
     * reset to 0.
     *
     * @internal
     */
    const incrementAnimationMessageIndex = (): void => {
      animationMessageIndex.value = (animationMessageIndex.value + 1) % props.messages.length
    }

    $x.on('UserHoveredInSearchBox', false).subscribe(() => (isSearchBoxHovered.value = true))

    $x.on('UserHoveredOutSearchBox', false).subscribe(() => (isSearchBoxHovered.value = false))

    $x.on('UserFocusedSearchBox', false).subscribe(() => (isSearchBoxFocused.value = true))

    $x.on('UserBlurredSearchBox', false).subscribe(() => (isSearchBoxFocused.value = false))

    /**
     * Starts or stops the animation depending on the current animation state.
     *
     * @internal
     */
    const resetAnimation = (): void => {
      stopAnimationInterval()
      if (isBeingAnimated.value) {
        animationInterval.value = window.setInterval((): void => {
          incrementAnimationMessageIndex()
        }, props.animationIntervalMs)
      }
    }

    watch(() => 'animationIntervalMs', resetAnimation)

    /**
     * Resets the animation message index to zero.
     *
     * @internal
     */
    const resetAnimationMessageIndex = (): void => {
      animationMessageIndex.value = 0
    }

    watch(
      () => props.messages,
      () => {
        resetAnimationMessageIndex()
        resetAnimation()
      },
      { deep: true },
    )

    /**
     * Sets the animation message index with the right value for the next future iteration when the
     * current one stops,assuring the user will see always a new message on each animation state
     * change.
     *
     * @internal
     */
    watch(
      isBeingAnimated,
      () => {
        if (!isBeingAnimated.value) {
          if (props.animateOnlyOnHover) {
            resetAnimationMessageIndex()
          }
          incrementAnimationMessageIndex()
        }
        resetAnimation()
      },
      { immediate: true },
    )

    onBeforeUnmount(() => {
      stopAnimationInterval()
    })

    return {
      isVisible,
      message,
    }
  },
})
</script>

<style lang="css">
.x-search-input-placeholder-container {
  position: relative;
}
</style>

<style lang="css" scoped>
.x-search-input-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  pointer-events: none;
}
</style>

<docs lang="mdx">
## See it in action

Here a basic example of how the animated search input placeholder is rendered.

```vue live
<template>
  <div style="position: relative; overflow: hidden;">
    <SearchInputPlaceholder
      style="position: absolute; height: 100%; pointer-events: none;"
      :messages="placeholderMessages"
    />
    <SearchInput />
  </div>
</template>

<script>
import { SearchInput, SearchInputPlaceholder } from '@empathyco/x-components/search-box'

export default {
  name: 'SearchInputPlaceholderDemo',
  components: {
    SearchInput,
    SearchInputPlaceholder,
  },
  data: function () {
    return {
      placeholderMessages: [
        'Find shirts',
        'Find shoes',
        'Find watches',
        'Find handbags',
        'Find sunglasses',
      ],
    }
  },
}
</script>
```

### Animating only on hover

In this example, the placeholder is configured to animate only when the user hovers in the search
input, showing the first message of the array the rest of the time.

```vue live
<template>
  <div style="position: relative; overflow: hidden;">
    <SearchInputPlaceholder
      style="position: absolute; height: 100%; pointer-events: none;"
      :messages="placeholderMessages"
      :animate-only-on-hover="true"
    />
    <SearchInput />
  </div>
</template>

<script>
import { SearchInput, SearchInputPlaceholder } from '@empathyco/x-components/search-box'

export default {
  name: 'SearchInputPlaceholderDemo',
  components: {
    SearchInput,
    SearchInputPlaceholder,
  },
  data: function () {
    return {
      placeholderMessages: [
        'Find shirts',
        'Find shoes',
        'Find watches',
        'Find handbags',
        'Find sunglasses',
      ],
    }
  },
}
</script>
```
</docs>
