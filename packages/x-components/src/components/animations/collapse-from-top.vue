<template>
  <transition v-on="$listeners" appear name="collapse-top" duration="300">
    <!-- @slot (Required) to add content to the transition -->
    <slot />
  </transition>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';

  /**
   * Renders a transition group wrapping the element passed in the default slot and animating
   * it with a scale and opacity animation.
   *
   * @public
   */
  @Component
  export default class CollapseFromTop extends Vue {}
</script>

<style lang="scss">
  .collapse-top {
    &-enter,
    &-leave-to {
      transform: scaleY(0);

      > * {
        opacity: 0;
      }
    }

    &-enter-active {
      transition: transform 150ms ease-out;
      transform-origin: top center;

      > * {
        transition: opacity 150ms ease-out 150ms;
      }
    }

    &-leave-active {
      transition: transform 150ms ease-out 150ms;
      transform-origin: top center;

      > * {
        transition: opacity 150ms ease-out;
      }
    }
  }
</style>

<docs>
#Example
The CollapseTop component is intended to be used as animation to wrap an element with
v-if or v-show and animate it. The animation consists on scale its vertical size from 0 to 1, and
after this show the content with an opacity transition

Used wrapping a component:
```vue
<CollapseFromTop>
  <ComponentOrElement v-if="open"/>
</CollapseFromTop>
```

Used changing the origin of the animation:
```vue
<CollapseFromTop>
  <ComponentOrElement v-if="open"/>
</CollapseFromTop>
```

  ---
  id: x-components.collapsefromtop
  title: Collapse From Top
  sidebar_label: Collapse From Top
  ---
</docs>
