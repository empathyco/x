<template>
  <XdsBaseShowcase
    v-slot="{ cssClass, copyCssClassesToClipboard }"
    title="Scroll"
    :sections="sections"
  >
    <div
      :class="cssClass"
      class="h-[200px] w-[200px] bg-amber-400"
      @keydown="copyCssClassesToClipboard"
      @click="copyCssClassesToClipboard"
    >
      <div :key="cssClass" class="h-[1000px]"></div>
    </div>
  </XdsBaseShowcase>
</template>

<script lang="ts">
import type { ShowcaseSections } from '../types/types'
import { defineComponent } from 'vue'
import XdsBaseShowcase from './xds-base-showcase.vue'

export default defineComponent({
  components: {
    XdsBaseShowcase,
  },
  props: {
    base: {
      type: String,
      default: 'scroll',
    },
  },
  computed: {
    sections(): ShowcaseSections {
      return {
        Default: [this.base],
      }
    },
  },
  methods: {
    copyCssClassesToClipboard(event: MouseEvent): void {
      navigator.clipboard.writeText((event.currentTarget as HTMLElement).classList.value)
    },
  },
})
</script>
