<template>
  <XdsBaseShowcase
    v-slot="{ cssClass, section, copyCssClassesToClipboard, removeClassPrefix }"
    title="Suggestion Group"
    :sections="sections"
  >
    <div
      :key="cssClass"
      :class="cssClass"
      :style="section === 'Default' ? { width: '200px' } : ''"
      title="Click me to copy CSS classes"
      @click="copyCssClassesToClipboard"
      @keydown="copyCssClassesToClipboard"
    >
      <button class="suggestion">
        <CuratedIcon class="icon" />
        <template v-if="section === 'Default'">
          very long default suggestion to test line wrap alignment
        </template>
        <template v-else>{{ removeClassPrefix(cssClass, base) }} suggestion group</template>
      </button>
      <button
        v-if="section === 'Combinations layer'"
        class="suggestion-group-button suggestion-group-button-rectangle"
        :class="{
          'suggestion-group-button-lighter': cssClass.includes('suggestion-group-success'),
          'suggestion-group-button-ghost': !cssClass.includes('suggestion-group-success'),
        }"
      >
        clear
      </button>
      <button v-if="section !== 'Combinations layer'" class="suggestion-group-button">
        <CrossIcon class="icon" />
      </button>
    </div>
  </XdsBaseShowcase>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { ShowcaseSections } from '../types/types'
import { defineComponent } from 'vue'
import { addParentClasses } from '../utils'
import CrossIcon from './icons/cross.vue'
import CuratedIcon from './icons/curated.vue'
import XdsBaseShowcase from './xds-base-showcase.vue'

export default defineComponent({
  components: {
    CuratedIcon,
    CrossIcon,
    XdsBaseShowcase,
  },
  props: {
    base: {
      type: String,
      default: 'suggestion-group',
    },
    sizes: {
      type: Array as PropType<string[]>,
      default: () => ['suggestion-group-sm', 'suggestion-group-md', 'suggestion-group-lg'],
    },
    colors: {
      type: Array as PropType<string[]>,
      default: () => [
        '',
        'suggestion-group-neutral',
        'suggestion-group-lead',
        'suggestion-group-auxiliary',
        'suggestion-group-accent',
        'suggestion-group-highlight',
        'suggestion-group-success',
        'suggestion-group-warning',
        'suggestion-group-error',
      ],
    },
    outlined: {
      type: String,
      default: 'suggestion-group-outlined',
    },
    ghost: {
      type: String,
      default: 'suggestion-group-ghost',
    },
    combinations: {
      type: Array as PropType<string[]>,
      default: () => [
        'suggestion-group-success suggestion-group-sm',
        'suggestion-group-outlined suggestion-group-auxiliary suggestion-group-md ',
        'suggestion-group-ghost suggestion-group-lg',
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
        'Combinations layer': this.combinations.map(addParentClasses(this.base)),
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
