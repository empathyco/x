<template>
  <div class="x-overflow-hidden x-transition-all x-duration-300">
    <div ref="wrapper">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'

export default defineComponent({
  setup() {
    const wrapper = ref<HTMLElement>()
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target.parentElement) {
          entry.target.parentElement.style.height = `${entry.contentRect.height}px`
        }
      }
    })

    onMounted(() => {
      if (wrapper.value?.parentElement) {
        const height = wrapper.value.getBoundingClientRect().height
        wrapper.value.parentElement.style.height = `${height}px`
        observer.observe(wrapper.value)
      }
    })

    onUnmounted(() => {
      if (wrapper.value) {
        observer.unobserve(wrapper.value)
      }
    })

    return {
      wrapper,
    }
  },
})
</script>

<docs lang="mdx">
## Examples

The ChangeHeight component automatically animates the height of its content when it changes size.

### Basic usage:

```vue
<template>
  <ChangeHeight>
    <div>Content whose height will be animated</div>
  </ChangeHeight>
</template>

<script setup>
import ChangeHeight from '@empathyco/x-components/js/components/animations/change-height.vue'
</script>
```

### Example with dynamic content:

```vue
<template>
  <div>
    <button @click="expanded = !expanded">Toggle</button>
    <ChangeHeight>
      <div v-if="expanded" style="height: 200px; background: #eee;">Expanded content</div>
      <div v-else style="height: 50px; background: #ccc;">Collapsed content</div>
    </ChangeHeight>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ChangeHeight from '@empathyco/x-components/js/components/animations/change-height.vue'

const expanded = ref(false)
</script>
```
</docs>
