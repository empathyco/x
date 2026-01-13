<template>
  <XdsBaseShowcase
    v-slot="{ cssClass, section, copyCssClassesToClipboard, removeClassPrefix }"
    title="Input"
    :sections="sections"
  >
    <input
      :key="cssClass"
      :class="cssClass"
      title="Click me to copy CSS classes"
      :disabled="section === 'Disabled'"
      :placeholder="removeClassPrefix(cssClass, base).trim() || 'input'"
      @click="copyCssClassesToClipboard"
    />
  </XdsBaseShowcase>
</template>

<script lang="ts">
import type { PropType } from 'vue'
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
      default: 'input',
    },
    sizes: {
      type: Array as PropType<string[]>,
      default: () => ['input-sm', 'input-md', 'input-lg'],
    },
    colors: {
      type: Array as PropType<string[]>,
      default: () => [
        'input-neutral',
        'input-lead',
        'input-auxiliary',
        'input-accent',
        'input-highlight',
        'input-success',
        'input-warning',
        'input-error',
      ],
    },
    line: {
      type: String,
      default: 'input-line',
    },
    combinations: {
      type: Array as PropType<string[]>,
      default: () => [
        'input-lead input-sm',
        'input-auxiliary input-line input-sm',
        'input-accent input-lg',
        'input-warning input-line input-lg',
      ],
    },
  },
  computed: {
    sections(): ShowcaseSections {
      return {
        Default: [this.base],
        Sizes: this.sizes.map(addParentClasses(this.base)),
        Colors: this.colors.map(addParentClasses(this.base)),
        Line: [addParentClasses(this.base)(this.line)],
        'Line Sizes': this.sizes.map(addParentClasses(this.base, this.line)),
        'Line Colors': this.colors.map(addParentClasses(this.base, this.line)),
        Disabled: [this.base, addParentClasses(this.base)(this.line)],
        Combinations: this.combinations.map(addParentClasses(this.base)),
      }
    },
  },
  methods: {
    copyCssClassesToClipboard(event: MouseEvent): void {
      navigator.clipboard.writeText((event.currentTarget as HTMLElement).classList.value)
    },
    removeClassPrefix(cssClasses: string, prefix: string): string {
      return cssClasses.replace(new RegExp(`${prefix}-?`, 'g'), '')
    },
  },
})
</script>
