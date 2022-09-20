<template>
  <transition
    v-on="$listeners"
    @enter="expand"
    @after-enter="cleanUpAnimationStyles"
    @leave="collapse"
    appear
    name="x-collapse-width-"
    v-bind="$attrs"
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
   * it with a width animation.
   *
   * @public
   */
  @Component({
    mixins: [createCollapseAnimationMixin('width')],
    inheritAttrs: false
  })
  export default class CollapseWidth extends Vue {
    // TODO Add support for extending enter, after-enter and leave transitions
  }
</script>

<style lang="scss" scoped>
  .x-collapse-width {
    &--enter-active,
    &--leave-active {
      transition: width 0.3s ease-out;
      overflow: hidden;
    }
  }
</style>

<docs lang="mdx">
## Examples

The CollapseWidth component is intended to be used as animation to wrap an element with v-if or
v-show and animate it. The animation consists on scale its width size from 0 to auto. This
transition does not work with components that have horizontal margin, padding or border. It also is
dependant of the width of the child elements and not the root element.

Used wrapping a component:

```vue
<CollapseWidth>
  <ComponentOrElement v-if="open"/>
</CollapseWidth>
```
</docs>
