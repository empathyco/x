<template>
  <transition v-on="$listeners" appear name="x-fade-" v-bind="$attrs">
    <!-- @slot (Required) to add content to the transition -->
    <slot />
  </transition>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';

  /**
   * Renders a transition wrapping the element passed in the default slot. The animation just fades
   * in/out the element by changing its opacity.
   *
   * @public
   */
  @Component({
    inheritAttrs: false
  })
  export default class Fade extends Vue {}
</script>

<style lang="scss" scoped>
  .x-fade {
    &--enter-active,
    &--leave-active {
      transition: opacity 0.25s ease-in-out;
    }

    &--leave-to,
    &--enter {
      opacity: 0;
    }
  }
</style>

<docs lang="mdx">
## Example

The `Fade` component is intended to be used as animation to wrap an element with v-if or v-show and
animate it. The animation just fades in/out the element by changing its opacity.

Wrapping a component:

```vue live
<template>
  <div>
    <button @click="shouldRender = !shouldRender">Toggle</button>
    <Fade>
      <p v-if="shouldRender">León is southern Spain</p>
    </Fade>
  </div>
</template>
<script>
  import { Fade } from '@empathyco/x-components';
  export default {
    name: 'FadeAnimationDemo',
    component: {
      Fade
    },
    data() {
      return {
        shouldRender: false
      };
    }
  };
</script>
```
</docs>
