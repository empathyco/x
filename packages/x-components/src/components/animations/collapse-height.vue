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

  /**
   * Renders a transition wrapping the element passed in the default slot and animating
   * it with a height animation.
   *
   * @public
   */
  @Component
  export default class CollapseHeight extends Vue {

    /**
     * The height changes from 0 to the element's scroll height.
     *
     * @param element - The DOM element that is going to be animated.
     *
     * @internal
     */
    protected expand(element: HTMLElement): void {
      element.style.height = '0';
      element.style.height = `${ element.scrollHeight }px`;
    }

    /**
     * Removes the height property.
     *
     * @param element - The DOM element that is going to be animated.
     *
     * @internal
     */
    protected cleanUpAnimationStyles(element: HTMLElement): void {
      element.style.removeProperty('height');
    }

    /**
     * The height changes from the element's scroll height to 0.
     *
     * @param element - The DOM element that is going to be animated.
     *
     * @internal
     */
    protected collapse(element: HTMLElement): void {
      element.style.height = `${ element.scrollHeight }px`;
      // This is intended. We want to provoke a layer repaint to apply this style.
      element.getBoundingClientRect();
      element.style.height = '0';
    }
  }
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
