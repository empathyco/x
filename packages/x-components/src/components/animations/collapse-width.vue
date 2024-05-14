<template>
  <!-- eslint-disable vue/attributes-order -->
  <transition
    v-bind="$attrs"
    v-on="$listeners"
    @enter="expand"
    @after-enter="cleanUpAnimationStyles"
    @leave="collapse"
    name="x-collapse-width-"
    :appear="appear"
  >
    <!-- eslint-enable -->
    <!-- @slot (Required) to add content to the transition -->
    <slot />
  </transition>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useCollapseAnimation } from './use-collapse-animation';

  /**
   * Renders a transition wrapping the element passed in the default slot and animating
   * it with a width animation.
   *
   * @public
   */
  export default defineComponent({
    name: 'CollapseWidth',
    inheritAttrs: false,
    props: {
      /**
       * Indicates if the transition must be applied on the initial render of the node.
       */
      appear: {
        type: Boolean,
        default: true
      }
    },
    setup: function () {
      return useCollapseAnimation('width');
    }
    // TODO Add support for extending enter, after-enter and leave transitions
  });
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
