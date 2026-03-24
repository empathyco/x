<template>
  <transition
    name="x-collapse-width-"
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
 * it with a width animation.
 *
 * @public
 */
export default defineComponent({
  name: 'CollapseWidth',
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
    return useCollapseAnimation('width')
  },
  // TODO Add support for extending enter, after-enter and leave transitions
})
</script>

<style lang="css">
.x-collapse-width--enter-active,
.x-collapse-width--leave-active {
  transition: width 0.3s ease-out;
  overflow: hidden;
}
</style>

<docs lang="mdx">
## Examples

The CollapseWidth component is intended to be used as animation to wrap an element with `v-if` or
`v-show` and animate its width. The animation scales its width from 0 to auto. This transition does not work with components that have horizontal margin, padding, or border. It also depends on the width of the child elements and not the root element.

### Basic usage with `v-if`

```vue
<template>
  <CollapseWidth>
    <ComponentOrElement v-if="open" />
  </CollapseWidth>
</template>

<script setup>
import { ref } from 'vue'
import CollapseWidth from '@empathyco/x-components/js/components/animations/collapse-width.vue'

const open = ref(false)
</script>
```

### Usage with `v-show`

```vue
<template>
  <CollapseWidth>
    <ComponentOrElement v-show="open" />
  </CollapseWidth>
</template>

<script setup>
import { ref } from 'vue'
import CollapseWidth from '@empathyco/x-components/js/components/animations/collapse-width.vue'

const open = ref(true)
</script>
```

### Example with dynamic content

```vue
<template>
  <div>
    <button @click="open = !open">Toggle</button>
    <CollapseWidth>
      <div v-if="open" style="width: 200px; background: #eee;">Expanded content</div>
      <div v-else style="width: 50px; background: #ccc;">Collapsed content</div>
    </CollapseWidth>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CollapseWidth from '@empathyco/x-components/js/components/animations/collapse-width.vue'

const open = ref(false)
</script>
```
</docs>
