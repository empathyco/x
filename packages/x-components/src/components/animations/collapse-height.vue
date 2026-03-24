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

The CollapseHeight component is intended to be used as an animation to wrap an element with `v-if` or
`v-show` and animate its height. The animation scales its height from 0 to auto. This transition does not work with components that have vertical margin, padding, or border.

### Basic usage with `v-if`

```vue
<template>
  <CollapseHeight>
    <ComponentOrElement v-if="open" />
  </CollapseHeight>
</template>

<script setup>
import { ref } from 'vue'
import CollapseHeight from '@empathyco/x-components/js/components/animations/collapse-height.vue'

const open = ref(false)
</script>
```

### Usage with `v-show`

```vue
<template>
  <CollapseHeight>
    <ComponentOrElement v-show="open" />
  </CollapseHeight>
</template>

<script setup>
import { ref } from 'vue'
import CollapseHeight from '@empathyco/x-components/js/components/animations/collapse-height.vue'

const open = ref(true)
</script>
```

### Example with dynamic content

```vue
<template>
  <div>
    <button @click="open = !open">Toggle</button>
    <CollapseHeight>
      <div v-if="open" style="height: 200px; background: #eee;">Expanded content</div>
      <div v-else style="height: 50px; background: #ccc;">Collapsed content</div>
    </CollapseHeight>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CollapseHeight from '@empathyco/x-components/js/components/animations/collapse-height.vue'

const open = ref(false)
</script>
```
</docs>
