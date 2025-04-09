<template>
  <XdsBaseShowcase
    v-slot="{ cssClass, section, copyCssClassesToClipboard }"
    title="Highlight"
    :sections="sections"
  >
    <button
      :key="cssClass"
      :class="cssClass"
      title="Click me to copy CSS classes"
      @click="copyCssClassesToClipboard"
    >
      <span>{{ section.substring(0, 3) }}</span>
      <span class="x-highlight-text-match">{{ section.substring(3) }}</span>
    </button>
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
      default: 'x-highlight-text',
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
