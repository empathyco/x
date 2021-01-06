<template>
  <transition
    v-on="$listeners"
    @enter="expand"
    @after-enter="cleanUpAnimationStyles"
    @leave="collapse"
    appear
    name="collapse-height"
  >
    <!-- @slot (Required) to add content to the transition -->
    <slot />
  </transition>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { createCollapseAnimationMixin } from './animations.mixin';

  /**
   * Renders a transition wrapping the element passed in the default slot and animating
   * it with a height animation.
   *
   * @public
   */
  @Component({
    mixins: [createCollapseAnimationMixin('height')]
  })
  export default class CollapseHeight extends Vue {}
</script>

<style scoped lang="scss">
  .collapse-height {
    &-enter-active,
    &-leave-active {
      transition: height 0.3s ease-out;
      overflow: hidden;
    }
  }
</style>

<docs>
#Example
The CollapseHeight component is intended to be used as animation to wrap an element with
v-if or v-show and animate it. The animation consists on scale its height size from 0 to auto.
This transition does not work with components that have vertical margin, padding or border.

Used wrapping a component:
```vue
<CollapseHeight>
  <ComponentOrElement v-if="open"/>
</CollapseHeight>
```
</docs>
