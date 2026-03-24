<template>
  <div v-if="isLoading" class="x-progress-bar" data-test="progress-bar" role="progressbar">
    <div class="x-progress-bar-fill" :style="cssStyles" data-test="progress-bar-line" />
  </div>
</template>

<script lang="ts">
import type { StyleValue } from 'vue'
import { computed, defineComponent } from 'vue'

/**
 * The auto progress bar component is useful for displaying a visual indicator of numerical data
 * in a bar shape.
 *
 * @public
 */
export default defineComponent({
  name: 'AutoProgressBar',
  props: {
    /**
     * A boolean flag indicating if the bar is loading.
     *
     * @public
     */
    isLoading: {
      type: Boolean,
      default: true,
    },
    /**
     * The duration in seconds of the progress bar.
     *
     * @public
     */
    durationInSeconds: {
      type: Number,
      default: 5,
    },
  },
  setup(props) {
    /**
     * Computed property to calculate the animation's duration.
     *
     * @returns The CSS styles of the animation.
     *
     * @internal
     */
    const cssStyles = computed<StyleValue>(() => ({
      animationDuration: `${props.durationInSeconds}s`,
    }))

    return {
      cssStyles,
    }
  },
})
</script>

<style lang="css" scoped>
.x-progress-bar {
  display: inline-block;
  overflow: hidden;
  background-color: #dbe2e5;
  border-radius: 4px;
}

.x-progress-bar-fill {
  height: 4px;
  background-color: #283034;
  animation: slide linear;
  transform-origin: left;
}

@keyframes slide {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}
</style>

<docs lang="mdx">
## Events

This component emits the following events:

- [`UserClickedARedirection`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)
  after the user clicks the redirection button.
- [`UserClickedAbortARedirection`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)
  after the user clicks the abort redirection button.

## See it in action

Here you have a basic example of how the auto progress bar is rendered.

```vue live
<template>
  <AutoProgressBar :isLoading="isLoading" :durationInSeconds="durationInSeconds" />
</template>

<script setup>
import { AutoProgressBar } from '@empathyco/x-components'
const isLoading = true
const durationInSeconds = 100
</script>
```

### Play with props

In this example, the auto progress bar has been set to do an animation for 5 seconds. There is a way
to cancel the animation by sending the isLoading prop to false.

```vue live
<template>
  <AutoProgressBar :durationInSeconds="5" :isLoading="true" />
</template>

<script setup>
import { AutoProgressBar } from '@empathyco/x-components'
</script>
```
</docs>
