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
