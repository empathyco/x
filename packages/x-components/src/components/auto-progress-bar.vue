<template>
  <div v-if="isLoading" class="x-progress-bar" data-test="progress-bar" role="progressbar">
    <div class="x-progress-bar__line" :style="cssStyles" data-test="progress-bar-line"></div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';

  /**
   * The auto progress bar component is useful for displaying a visual indicator of numerical data
   * in a bar shape.
   *
   * @public
   */
  export default defineComponent({
    props: {
      /**
       * A boolean flag indicating if the bar is loading.
       *
       * @public
       */
      isLoading: {
        type: Boolean,
        default: true
      },
      /**
       * The duration in seconds of the progress bar.
       *
       * @public
       */
      durationInSeconds: {
        type: Number,
        default: 5
      }
    },
    setup(props) {
      /**
       * Computed property to calculate the animation's duration.
       *
       * @returns The CSS styles of the animation.
       *
       * @internal
       */
      const cssStyles = computed<Partial<CSSStyleDeclaration>>(() => ({
        animationDuration: `${props.durationInSeconds}s`
      }));

      return {
        cssStyles
      };
    }
  });
</script>

<style lang="scss">
  .x-progress-bar {
    display: inline-block;
    overflow: hidden;
    background-color: var(--x-color-background-progress-bar-default, #b3b3b3);
    border-radius: var(--x-size-border-radius-progress-bar-default, 24px);

    &__line {
      height: var(--x-size-height-progress-bar-line-default, 4px);
      width: var(--x-size-width-progress-bar-line-default, 272px);
      background-color: var(--x-color-background-progress-bar-line-default, #1a1a1a);
      border-radius: var(--x-size-border-radius-progress-bar-default, 24px);
      animation: slide linear;
      transform-origin: left;
    }
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
## See it in action

Here you have a basic example of how the auto progress bar is rendered.

```vue live
<template>
  <AutoProgressBar :isLoading="isLoading" :durationInSeconds="durationInSeconds" />
</template>

<script>
  import { AutoProgressBar } from '@empathyco/x-components';
  export default {
    name: 'AutoProgressBarDemo',
    components: {
      AutoProgressBar
    },
    data() {
      return {
        isLoading: true,
        durationInSeconds: 100
      };
    }
  };
</script>
```

### Play with props

In this example, the auto progress bar has been set to do an animation for 5 seconds. There is a way
to cancel the animation by sending the isLoading prop to false.

```vue live
<template>
  <AutoProgressBar :durationInSeconds="5" :isLoading="true" />
</template>

<script>
  import { AutoProgressBar } from '@empathyco/x-components';
  export default {
    name: 'AutoProgressBarDemo',
    components: {
      AutoProgressBar
    }
  };
</script>
```

## Events

This component emits the following events:

- `UserClickedARedirection` after the user clicks the redirection button.
- `UserClickedAbortARedirection` after the user clicks the abort redirection button.
</docs>
