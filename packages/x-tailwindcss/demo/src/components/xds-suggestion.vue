<template>
  <XdsBaseShowcase
    v-slot="{ cssClass, section, copyCssClassesToClipboard, removeClassPrefix }"
    title="Suggestion"
    :sections="sections"
  >
    <button
      :key="cssClass"
      :class="cssClass"
      :style="section === 'Default' ? { width: '120px' } : ''"
      title="Click me to copy CSS classes"
      @click="copyCssClassesToClipboard"
    >
      <CuratedIcon class="icon" />
      <template v-if="section === 'Default'">
        very long default suggestion to test line wrap alignment
      </template>
      <template v-else>{{ removeClassPrefix(cssClass, base) }} suggestion</template>
    </button>
  </XdsBaseShowcase>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { ShowcaseSections } from '../types/types'
import { defineComponent } from 'vue'
import { addParentClasses } from '../utils'
import CuratedIcon from './icons/curated.vue'
import XdsBaseShowcase from './xds-base-showcase.vue'

export default defineComponent({
  components: {
    CuratedIcon,
    XdsBaseShowcase,
  },
  props: {
    base: {
      type: String,
      default: 'suggestion',
    },
    sizes: {
      type: Array as PropType<string[]>,
      default: () => ['suggestion-sm', 'suggestion-md', 'suggestion-lg'],
    },
    colors: {
      type: Array as PropType<string[]>,
      default: () => [
        '',
        'suggestion-neutral',
        'suggestion-lead',
        'suggestion-auxiliary',
        'suggestion-accent',
        'suggestion-highlight',
        'suggestion-success',
        'suggestion-warning',
        'suggestion-error',
      ],
    },
    outlined: {
      type: String,
      default: 'suggestion-outlined',
    },
    ghost: {
      type: String,
      default: 'suggestion-ghost',
    },
    combinations: {
      type: Array as PropType<string[]>,
      default: () => [
        'suggestion suggestion-success suggestion-md',
        'suggestion suggestion-auxiliary suggestion-md',
        'suggestion-tag suggestion-error-50 suggestion-lg',
      ],
    },
  },
  computed: {
    sections(): ShowcaseSections {
      return {
        Default: [this.base],
        Colors: this.colors.map(addParentClasses(this.base)),
        Sizes: this.sizes.map(addParentClasses(this.base)),
        Outlined: this.colors.map(addParentClasses(this.base, this.outlined)),
        'Outlined Sizes': this.sizes.map(addParentClasses(this.base, this.outlined)),
        Ghost: this.colors.map(addParentClasses(this.base, this.ghost)),
        'Ghost Sizes': this.sizes.map(addParentClasses(this.base, this.ghost)),
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
