<template>
  <transition v-on="$listeners" name="x-animate-width-" v-bind="$attrs">
    <!-- @slot (Required) Transition content -->
    <slot />
  </transition>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';

  /**
   * Renders a transition wrapping an element passed in the default slot and animating its width.
   *
   * @public
   */
  @Component({
    inheritAttrs: false
  })
  export default class AnimateWidth extends Vue {}
</script>

<style lang="scss" scoped>
  .x-animate-width {
    &--enter-active,
    &--leave-active {
      transition: width 0.3s ease-out;
      overflow-x: hidden;
    }

    &--enter,
    &--leave-to {
      width: 0 !important;
    }
  }
</style>

<docs lang="mdx">
## Examples

The AnimateWidth component is intended to be used as a prop in animatable components but also works
as a transition to animate the width of an element.

Used as a prop in an animatable component:

```vue
<template>
  <AnimatableComponent :animation="AnimateWidth" />
</template>

<script>
  import AnimateWidth from '@empathyco/x-components/js/components/animations/animate-width.vue';

  export default {
    data() {
      return {
        AnimateWidth
      };
    }
  };
</script>
```

Used as a regular Transition:

```vue
<template>
  <div>
    <button @click="visible = !visible">Toggle</button>
    <AnimateWidth>
      <div v-if="visible" style="width: 300px">Element to animate</div>
    </AnimateWidth>
  </div>
</template>

<script>
  import AnimateWidth from '@empathyco/x-components/js/components/animations/animate-width.vue';

  export default {
    data() {
      return {
        visible: true
      };
    }
  };
</script>
```
</docs>
