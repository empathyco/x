<template>
  <transition
    name="x-collapse-height-"
    :appear="appear"
    @enter="expand"
    @after-enter="cleanUpAnimationStyles"
    @leave="collapse"
  >
    <!-- @slot (Required) to add content to the transition -->
    <slot />
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useCollapseAnimation } from './use-collapse-animation'

/**
 * Renders a transition wrapping the element passed in the default slot and animating
 * it with a height animation.
 *
 * @public
 */
export default defineComponent({
  name: 'CollapseHeight',
  props: {
    /**
     * Indicates if the transition must be applied on the initial render of the node.
     */
    appear: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    return useCollapseAnimation('height')
  },
  // TODO Add support for extending enter, after-enter and leave transitions
})
</script>

<style lang="css">
.x-collapse-height--enter-active,
.x-collapse-height--leave-active {
  transition: height var(--x-collapse-height-transition-duration, 0.3s) ease-out;
  overflow: hidden;
}
</style>

<docs lang="mdx">
## Examples

The CollapseHeight component is intended to be used as animation to wrap an element with v-if or
v-show and animate it. The animation consists on scale its height size from 0 to auto. This
transition does not work with components that have vertical margin, padding or border.

Used wrapping a component:

```vue
<CollapseHeight>
  <ComponentOrElement v-if="open"/>
</CollapseHeight>
```
</docs>
