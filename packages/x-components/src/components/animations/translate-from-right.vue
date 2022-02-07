<template>
  <transition v-on="$listeners" appear name="x-translate-from-right-">
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
  export default class TranslateFromRight extends Vue {}
</script>

<style lang="scss" scoped>
  .x-translate-from-right {
    &--enter-active,
    &--leave-active {
      transition: transform 0.3s ease-out;
    }

    &--leave-to,
    &--enter {
      transform: translateX(100%);
    }
  }
</style>

<docs lang="mdx">
## Example

The `TranslateFromRight` component is intended to be used as animation to wrap an element with v-if
or v-show and animate it. The animation translates the item from/to right 100%.

Used wrapping a component:

```vue
<TranslateFromRight>
  <ComponentOrElement v-if="open"/>
</TranslateFromRight>
```
</docs>
