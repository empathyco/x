<template>
  <transition v-on="$listeners" appear name="x-collapse-from-top-">
    <!-- @slot (Required) to add content to the transition -->
    <slot />
  </transition>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';

  /**
   * Renders a transition group wrapping the element passed in the default slot and animating
   * it with a scale.
   *
   * @public
   */
  @Component
  export default class CollapseFromTop extends Vue {}
</script>

<style lang="scss" scoped>
  .x-collapse-from-top {
    &--enter-active,
    &--leave-active,
    &--enter-active ::v-deep > *,
    &--leave-active ::v-deep > * {
      transform-origin: top center;
      animation-duration: 0.4s;
      animation-timing-function: linear;
    }

    &--enter-active,
    &--leave-active {
      animation-name: containerAnimation;
      overflow: hidden;
    }

    &--enter-active ::v-deep > *,
    &--leave-active ::v-deep > * {
      animation-name: contentAnimation;
    }

    &--leave-active,
    &--leave-active > ::v-deep * {
      animation-direction: reverse;
    }
  }

  @function easeInOut($x) {
    @if $x < 0.5 {
      @return 8 * $x * $x * $x * $x;
    } @else {
      $x: $x - 1;
      @return 1 - (8 * $x * $x * $x * $x);
    }
  }

  @keyframes containerAnimation {
    @for $step from 0 through 100 {
      $scale: easeInOut($step / 100);
      #{$step}% {
        transform: scaleY(#{$scale});
      }
    }
  }

  @keyframes contentAnimation {
    @for $step from 0 through 100 {
      $scale: easeInOut($step / 100);
      $invScale: if($scale > 0, 1 / $scale, 99999999);
      #{$step}% {
        transform: scaleY(#{$invScale});
      }
    }
  }
</style>

<docs lang="mdx">
# Examples

The CollapseTop component is intended to be used as animation to wrap an element with v-if or v-show
and animate it. The animation consists on scale its vertical size from 0 to 1, and after this show
the content with an opacity transition

Used wrapping a component:

```vue
<CollapseFromTop>
  <ComponentOrElement v-if="open"/>
</CollapseFromTop>
```
</docs>
