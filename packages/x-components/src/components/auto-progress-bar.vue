<template>
  <div v-if="isActive" class="x-progress-bar" data-test="progress-bar">
    <slot v-bind="{ duration }">
      <div
        class="x-progress-bar__line"
        :style="{ animationDuration: `${duration}s` }"
        data-test="progress-bar__line"
      ></div>
    </slot>
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
    public isActive!: boolean;

    /**
     * The duration in seconds of the progress bar.
     *
     * @public
     */
    @Prop({ default: 2 })
    public duration!: number;
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

This component renders a progress bar with a duration is the `isActive` flag is true.

```vue
<template>
  <Redirection>
    <template v-slot="{ isActive, delayMs }">
      <AutoProgressBar :isActive="isActive" :duration="delayMs" />
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
```

## Advance Example

This component allows overriding the default slot and let you implement you own scroll bar.

```vue
<template>
  <AutoProgressBar :isActive="isActive" :duration="duration">
    <template v-slot="{ duration }">
      <span>{{ duration }}</span>
    </template>
  </AutoProgressBar>
</template>

<script>
  import { AutoProgressBar } from '@empathyco/x-components';
  import { Redirection } from '@empathyco/x-components/search';
  export default {
    name: 'AutoProgressBarDemo',
    components: {
      AutoProgressBar
    },
    data() {
      return {
        isActive: true,
        duration: 5
      };
    }
  };
</script>
```

## Events

This component doesn't emits events.
</docs>
