<template>
  <XdsBaseShowcase
    v-slot="{ cssClass, copyCssClassesToClipboard }"
    title="Picture"
    :sections="sections"
  >
    <div
      :key="cssClass"
      :class="cssClass"
      title="Click me to copy CSS classes"
      style="width: 200px"
      class="bg-white/60"
      @click="copyCssClassesToClipboard"
      @keydown="copyCssClassesToClipboard"
    >
      <img
        src="https://assets.empathy.co/images-demo/2885.jpg"
        alt="Summer Sandal"
        role="presentation"
        class="picture-image"
      />
    </div>
  </XdsBaseShowcase>
</template>

<script lang="ts">
import type { ShowcaseSections } from '../types/types'
import { defineComponent } from 'vue'
import { addParentClasses } from '../utils'
import XdsBaseShowcase from './xds-base-showcase.vue'

export default defineComponent({
  components: {
    XdsBaseShowcase,
  },
  props: {
    base: {
      type: String,
      default: 'picture',
    },
    zoom: {
      type: String,
      default: 'picture-zoom',
    },
    overlay: {
      type: String,
      default: 'picture-overlay',
    },
  },
  computed: {
    sections(): ShowcaseSections {
      return {
        Default: [addParentClasses(this.base)(this.zoom)],
        Overlay: [addParentClasses(this.base)(this.overlay)],
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
