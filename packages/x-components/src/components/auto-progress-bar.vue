<template>
  <div v-if="isWaiting" class="x-progress-bar" data-test="progress-bar" role="progressbar">
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
     * A boolean flag indicating the end of the animation.
     *
     * @public
     */
    @Prop({ default: true })
    public isWaiting!: boolean;

    /**
     * The duration in seconds of the progress bar.
     *
     * @public
     */
    @Prop({ default: 5 })
    public duration!: number;

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
## Basic example

This component renders a progress bar with a duration is the `isWaiting` flag is true.

```vue
<template>
  <Redirection>
    <template v-slot="{ isWaiting, delay }">
      <AutoProgressBar :isWaiting="isWaiting" :duration="delay" />
    </template>
  </Redirection>
</template>

<script>
  import { Redirection } from '@empathyco/x-components/search';
  export default {
    name: 'AutoProgressBarDemo',
    components: {
      Redirection
    }
  };
</script>

## Events This component doesn't emits events.
```
</docs>
