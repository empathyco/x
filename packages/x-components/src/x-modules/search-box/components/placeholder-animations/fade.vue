<template>
  <transition
    v-on="$listeners"
    class="x-fade-placeholders"
    name="x-fade-placeholders-"
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
   * Fades the element passed in the slot.
   *
   * @public
   */
  @Component
  export default class Fade extends Vue {}
</script>

<style lang="scss" scoped>
  $fade-duration: 0.3s;
  $fade-leave-delay: 1s;

  .x-fade-placeholders {
    &--enter-active,
    &--leave-active {
      transition: all $fade-duration ease;
    }

    &--leave-active {
      transition-delay: $fade-leave-delay;
    }

    &--enter {
      opacity: 0;
    }

    &--leave-to {
      opacity: 0;
    }
  }
</style>

<docs lang="mdx">
## Examples

The Fade component is intended to be used as a prop in the `SearchInputPlaceholder` component.

```vue
<SearchInputPlaceholder :animatedPlacholders="placeholders" :animation="Fade" />
```
</docs>
