<template>
  <transition name="x-fade-" :appear="appear">
    <!-- @slot (Required) to add content to the transition -->
    <slot />
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

/**
 * Renders a transition wrapping the element passed in the default slot. The animation just fades
 * in/out the element by changing its opacity.
 *
 * @public
 */
export default defineComponent({
  name: 'Fade',
  props: {
    /** Indicates if the transition must be applied on the initial render of the node. */
    appear: {
      type: Boolean,
      default: true,
    },
  },
})
</script>

<style lang="css">
.x-fade--enter-active,
.x-fade--leave-active {
  transition: opacity 0.25s ease-in-out;
}

.x-fade--leave-to,
.x-fade--enter-from {
  opacity: 0 !important;
}
</style>

<docs lang="mdx">
## Examples

The `Fade` component is intended to be used as animation to wrap an element with `v-if` or `v-show` and animate it. The animation just fades in/out the element by changing its opacity.

### Basic usage with `v-if`

```vue
<template>
  <Fade>
    <ComponentOrElement v-if="open" />
  </Fade>
</template>

<script setup>
import { ref } from 'vue'
import Fade from '@empathyco/x-components/js/components/animations/fade.vue'

const open = ref(false)
</script>
```

### Usage with `v-show`

```vue
<template>
  <Fade>
    <ComponentOrElement v-show="open" />
  </Fade>
</template>

<script setup>
import { ref } from 'vue'
import Fade from '@empathyco/x-components/js/components/animations/fade.vue'

const open = ref(true)
</script>
```

### Example with dynamic content

```vue
<template>
  <div>
    <button @click="open = !open">Toggle</button>
    <Fade>
      <div v-if="open" style="background: #eee;">Expanded content</div>
      <div v-else style="background: #ccc;">Collapsed content</div>
    </Fade>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Fade from '@empathyco/x-components/js/components/animations/fade.vue'

const open = ref(false)
</script>
```
</docs>
