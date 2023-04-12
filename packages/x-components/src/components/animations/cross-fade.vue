<template>
  <transition v-on="$listeners" name="x-cross-fade-" v-bind="$attrs" :appear="appear">
    <!-- @slot (Required) to add content to the transition -->
    <slot />
  </transition>
</template>

<script>
  /**
   * Renders a transition wrapping the element passed in the default slot. The transition
   * fades between the two toggled elements at the same time.
   *
   * @public
   */
  export default {
    inheritAttrs: false
  };
</script>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      /**
       * Indicates if the transition must be applied on the initial render of the node.
       */
      appear: {
        type: Boolean,
        default: true
      }
    }
  });
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
