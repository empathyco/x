<template>
  <transition
    v-on="$listeners"
    class="x-slide-placeholders"
    name="x-slide-placeholders-"
    mode="out-in"
    appear
  >
    <slot />
  </transition>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';

  /**
   * Fades and slides the element passed in the slot.
   *
   * @public
   */
  @Component
  export default class Slide extends Vue {}
</script>

<style lang="scss" scoped>
  $slide-duration: 0.3s;
  $slide-leave-delay: 1s;
  $slide-offset: 20px;

  .x-slide-placeholders {
    &--enter-active,
    &--leave-active {
      transition: all $slide-duration ease-out;
    }

    &--leave-active {
      transition-delay: $slide-leave-delay;
    }

    &--enter {
      opacity: 0;
      transform: translateY($slide-offset);
    }

    &--leave-to {
      opacity: 0;
      transform: translateY(-$slide-offset);
    }
  }
</style>

<docs lang="mdx">
## Examples

The Slide component is intended to be used as a prop in the `SearchInputPlaceholder` component.

```vue
<SearchInputPlaceholder :animatedPlacholders="placeholders" :animation="Slide" />
```
</docs>
