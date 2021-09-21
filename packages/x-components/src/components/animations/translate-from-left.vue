<template>
  <transition v-on="$listeners" appear name="x-translate-from-left-">
    <!-- @slot (Required) to add content to the transition -->
    <slot />
  </transition>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';

  /**
   * Renders a transition wrapping the element passed in the default slot and moving it to its
   * desired position.
   *
   * @public
   */
  @Component
  export default class TranslateFromLeft extends Vue {}
</script>

<style lang="scss" scoped>
  .x-translate-from-left {
    &--enter-active,
    &--leave-active {
      transition: transform 0.3s ease-out;
    }

    &--leave-to,
    &--enter {
      transform: translateX(-100%);
    }
  }
</style>

<docs lang="mdx">
# Example

The `TranslateFromRight` component is intended to be used as animation to wrap an element with v-if
or v-show and animate it. The animation translates the item from/to left 100%.

Wrapping a component:

```vue
<TranslateFromLeft>
  <ComponentOrElement v-if="open"/>
</TranslateFromLeft>
```
</docs>
