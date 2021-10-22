<template>
  <div v-if="isLoading" class="x-progress-bar" data-test="progress-bar" role="progressbar">
    <div class="x-progress-bar__line" :style="cssStyles" data-test="progress-bar__line"></div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

  /**
   * An auto progress bar component.
   *
   * @public
   */
  @Component
  export default class AutoProgressBar extends Vue {
    /**
     * A boolean flag indicating if the bar is loading.
     *
     * @public
     */
    @Prop({ default: true })
    public isLoading!: boolean;

    /**
     * The duration in seconds of the progress bar.
     *
     * @public
     */
    @Prop({ default: 5 })
    public duration!: number;

    /**
     * Computed property to calculate the animation's duration.
     *
     * @returns The CSS styles of the animation.
     *
     * @internal
     */
    protected get cssStyles(): Partial<CSSStyleDeclaration> {
      return { animationDuration: `${this.duration}s` };
    }
  }
</script>

<style lang="scss">
  //TODO - Replace with design-system variables
  .x-progress-bar {
    display: flex;
    overflow: hidden;
    width: 272px;
    height: 4px;
    background-color: #b3b3b3;
    border-radius: 24px;
    margin: 32px 216px 0 215px;
    &__line {
      flex: 1 0 auto;
      background-color: #1a1a1a;
      animation-name: slide;
      animation-timing-function: ease-in;
    }
  }
  @keyframes slide {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(0%);
    }
  }
</style>

<docs lang="mdx">
## See it in action

Here you have a basic example of how the auto progress bar is rendered.

```vue
<template>
  <AutoProgressBar :isLoading="isLoading" :duration="delayInSeconds" />
</template>

<script>
  export default {
    name: 'AutoProgressBarDemo',
    data() {
      return {
        isLoading: true,
        delayInSeconds: 100
      };
    }
  };
</script>
```

### Play with props

In this example, the auto progress bar has been set to do an animation for 5 seconds. There is a way
to cancel the animation by sending the isLoading prop to false.

```vue
<template>
  <AutoProgressBar :duration="5" :isLoading="true" />
</template>

<script>
  export default {
    name: 'AutoProgressBarDemo'
  };
</script>
```

## Events

This component emits the following events:

- `UserClickedARedirection` after the user clicks the redirection button.
- `UserClickedAbortARedirection` after the user clicks the abort redirection button.
</docs>
