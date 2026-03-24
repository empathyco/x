<template>
  <transition name="x-cross-fade-" :appear="appear">
    <!-- @slot (Required) to add content to the transition -->
    <slot />
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

/**
 * Renders a transition wrapping the element passed in the default slot. The transition
 * fades between the two toggled elements at the same time.
 *
 * @public
 */
export default defineComponent({
  name: 'CrossFade',
  props: {
    /**
     * Indicates if the transition must be applied on the initial render of the node.
     */
    appear: {
      type: Boolean,
      default: true,
    },
  },
})
</script>

<style lang="css">
.x-cross-fade--enter-active,
.x-cross-fade--leave-active {
  transition: opacity 0.25s ease-in-out;
  mix-blend-mode: multiply;
}

.x-cross-fade--leave-active {
  position: absolute;
}

.x-cross-fade--leave-to,
.x-cross-fade--enter-from {
  opacity: 0 !important;
}
</style>

<docs lang="mdx">
## Examples

The `CrossFade` component is intended to be used as an animation to wrap an element with `v-if` or `v-show` and animate it. The animation fades the new element into the previous one.

### Basic usage with `v-if`

```vue
<template>
  <CrossFade>
    <ComponentOrElement v-if="open" />
  </CrossFade>
</template>

<script setup>
import { ref } from 'vue'
import CrossFade from '@empathyco/x-components/js/components/animations/cross-fade.vue'

const open = ref(false)
</script>
```

### Usage with `v-show`

```vue
<template>
  <CrossFade>
    <ComponentOrElement v-show="open" />
  </CrossFade>
</template>

<script setup>
import { ref } from 'vue'
import CrossFade from '@empathyco/x-components/js/components/animations/cross-fade.vue'

const open = ref(true)
</script>
```

### Example with dynamic content

```vue
<template>
  <div>
    <button @click="open = !open">Toggle</button>
    <CrossFade>
      <div v-if="open" style="background: #eee;">Expanded content</div>
      <div v-else style="background: #ccc;">Collapsed content</div>
    </CrossFade>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CrossFade from '@empathyco/x-components/js/components/animations/cross-fade.vue'

const open = ref(false)
</script>
```
</docs>
