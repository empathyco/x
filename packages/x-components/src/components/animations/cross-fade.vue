<template>
  <transition v-on="$listeners" appear name="x-cross-fade-" v-bind="$attrs">
    <!-- @slot (Required) to add content to the transition -->
    <slot />
  </transition>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';

  /**
   * Renders a transition wrapping the element passed in the default slot. The transition
   * fades between the two toggled elements at the same time.
   *
   * @public
   */
  @Component({
    inheritAttrs: false
  })
  export default class CrossFade extends Vue {}
</script>

<style lang="scss" scoped>
  .x-cross-fade {
    &--enter-active,
    &--leave-active {
      transition: opacity 0.25s ease-in-out;
      mix-blend-mode: multiply;
    }

    &--leave-active {
      position: absolute;
    }

    &--leave-to,
    &--enter {
      opacity: 0;
    }
  }
</style>

<docs lang="mdx">
## Example

The `CrossFade` component is intended to be used as animation to wrap an element with v-if or v-show
and animate it. The animation fades the new element into the previous one.

Wrapping a component:

```vue
<CrossFade>
  <ComponentOrElement v-if="open"/>
</CrossFade>
```
</docs>
