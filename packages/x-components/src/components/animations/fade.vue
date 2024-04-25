<template>
  <!-- eslint-disable-next-line vue/attributes-order -->
  <transition v-bind="$attrs" v-on="$listeners" name="x-fade-" :appear="appear">
    <!-- @slot (Required) to add content to the transition -->
    <slot />
  </transition>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  /**
   * Renders a transition wrapping the element passed in the default slot. The animation just fades
   * in/out the element by changing its opacity.
   *
   * @public
   */
  export default defineComponent({
    name: 'Fade',
    inheritAttrs: false,
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
    components: {
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
