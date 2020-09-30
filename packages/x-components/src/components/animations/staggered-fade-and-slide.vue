<template>
  <staggering-transition-group
    v-on="$listeners"
    v-bind="$attrs"
    appear
    name="staggered-fade-slide-"
  >
    <!-- @slot (Required) Transition-group content -->
    <slot />
  </staggering-transition-group>
</template>

<script lang="ts">
  import Vue from "vue";
  import { Component } from "vue-property-decorator";
  import StaggeringTransitionGroup from "../staggering-transition-group.vue";

  /**
   * Renders a transition group wrapping the elements passed in the default slot and animating
   * them with an staggered fade and slide animation.
   *
   * @public
   */
  @Component({
    components: { StaggeringTransitionGroup }
  })
  export default class StaggeredFadeAndSlide extends Vue {}
</script>

<style lang="scss">
  $transition-duration: 0.25s;

  .staggered-fade-slide--enter-active,
  .staggered-fade-slide--leave-active {
    transition: $transition-duration ease-out;
    transition-property: opacity, transform;
  }

  .staggered-fade-slide--move {
    transition: transform $transition-duration ease-out;
  }

  .staggered-fade-slide--enter,
  .staggered-fade-slide--leave-to {
    transform: translate3d(0, 50%, 0);
    opacity: 0;
  }
</style>

<docs>

The Staggered fade and slide components works as the normal fade and slide components, but
it also adds a configurable delay to each transition.

## Example

### Used with animatable components

```vue
<AnimatableComponent :animation="StaggeredFadeAndSlide"/>
```

### Used as a regular component:

This components exposes all the props and events of the Staggering transition group, like the
`tag` or the `stagger` props:

```vue
<StaggeredFadeAndSlide tag="ul" :stagger="50">
  <li>Element to animate</li>
  <li>Element to animate</li>
  <li>Element to animate</li>
</StaggeredFadeAndSlide>
```

---
id: x-components.staggered-fade-and-slide
title: Staggered Fade and Slide
sidebar_label: Staggered Fade and Slide
---
</docs>
