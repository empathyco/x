<template>
  <transition
    v-on="$listeners"
    @enter="expand"
    @after-enter="cleanUpAnimationStyles"
    @leave="collapse"
    appear
    name="collapse-width"
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
   * it with a width animation.
   *
   * @public
   */
  @Component
  export default class CollapseWidth extends Vue {
    /**
     * The width changes from 0 to the element's scroll width.
     *
     * @param element - The DOM element that is going to be animated.
     *
     * @internal
     */
    protected expand(element: HTMLElement): void {
      element.style.width = '0';
      element.style.width = `${element.scrollWidth}px`;
    }

    /**
     * Removes the width property.
     *
     * @param element - The DOM element that is going to be animated.
     *
     * @internal
     */
    protected cleanUpAnimationStyles(element: HTMLElement): void {
      element.style.removeProperty('width');
    }

    /**
     * The width changes from the element's scroll width to 0.
     *
     * @param element - The DOM element that is going to be animated.
     *
     * @internal
     */
    protected collapse(element: HTMLElement): void {
      element.style.width = `${element.scrollWidth}px`;
      // This is intended. We want to provoke a layer repaint to apply this style.
      element.getBoundingClientRect();
      element.style.width = '0';
    }
  }
</script>

<style scoped lang="scss">
  .collapse-width {
    &-enter-active,
    &-leave-active {
      transition: width 0.3s ease-out;
      overflow: hidden;
    }
  }
</style>

<docs>
#Example
The CollapseWidth component is intended to be used as animation to wrap an element with
v-if or v-show and animate it. The animation consists on scale its width size from 0 to auto.
This transition does not work with components that have horizontal margin, padding or border. It
also is dependant of the width of the child elements and not the root element.


Used wrapping a component:
```vue
<CollapseWidth>
  <ComponentOrElement v-if="open"/>
</CollapseWidth>
```
</docs>
