<template>
  <XdsBaseShowcase
    v-slot="{ cssClass, section, copyCssClassesToClipboard, removeClassPrefix }"
    title="Input Group"
    :sections="sections"
  >
    <div
      :key="cssClass"
      :class="cssClass"
      title="Click me to copy CSS classes"
      :disabled="section === 'Disabled'"
      @click="copyCssClassesToClipboard"
      @keydown="copyCssClassesToClipboard"
    >
      <CuratedIcon class="icon" />
      <input
        class="input"
        :disabled="section === 'Disabled'"
        :placeholder="
          removeClassPrefix(cssClass, base).trim() ||
          (section.includes('Line') && 'line') ||
          'input-group'
        "
      />
      <button
        :disabled="section === 'Disabled'"
        class="button input-group-button"
        @click.stop="copyCssClassesToClipboard"
      >
        <CrossIcon class="icon" />
      </button>
      <button
        :disabled="section === 'Disabled'"
        class="button input-group-button input-group-button-rectangle"
        @click.stop="copyCssClassesToClipboard"
      >
        clear
      </button>
      <button
        :disabled="section === 'Disabled'"
        class="button input-group-button-primary"
        :class="{
          'input-group-button-outlined': section.includes('Outlined'),
          'input-group-button-ghost': section.includes('Ghost'),
        }"
        @click.stop="copyCssClassesToClipboard"
      >
        <CheckIcon class="icon" />
      </button>
    </div>
  </XdsBaseShowcase>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { ShowcaseSections } from '../types/types'
import { defineComponent } from 'vue'
import { addParentClasses } from '../utils'
import CheckIcon from './icons/check.vue'
import CrossIcon from './icons/cross.vue'
import CuratedIcon from './icons/curated.vue'
import XdsBaseShowcase from './xds-base-showcase.vue'

export default defineComponent({
  components: {
    XdsBaseShowcase,
    CheckIcon,
    CrossIcon,
    CuratedIcon,
  },
  props: {
    base: {
      type: String,
      default: 'input-group',
    },
    sizes: {
      type: Array as PropType<string[]>,
      default: () => ['input-group-sm', 'input-group-md', 'input-group-lg'],
    },
    colors: {
      type: Array as PropType<string[]>,
      default: () => [
        'input-group-neutral',
        'input-group-lead',
        'input-group-auxiliary',
        'input-group-accent',
        'input-group-highlight',
        'input-group-success',
        'input-group-warning',
        'input-group-error',
      ],
    },
    line: {
      type: String,
      default: 'input-group-line',
    },
    combinations: {
      type: Array as PropType<string[]>,
      default: () => [
        'input-group-lead input-group-sm',
        'input-group-auxiliary input-group-line input-group-sm',
        'input-group-accent input-group-lg ',
        'input-group-warning input-group-line input-group-lg',
      ],
    },
  },
  computed: {
    sections(): ShowcaseSections {
      return {
        Default: [this.base],
        Sizes: this.sizes.map(addParentClasses(this.base)),
        Colors: this.colors.map(addParentClasses(this.base)),
        Outlined: ['', ...this.colors].map(addParentClasses(this.base)),
        Ghost: ['', ...this.colors].map(addParentClasses(this.base)),
        Line: [addParentClasses(this.base)(this.line)],
        'Line Sizes': this.sizes.map(addParentClasses(this.base, this.line)),
        'Line Colors': this.colors.map(addParentClasses(this.base, this.line)),
        'Line Button Outlined': ['', ...this.colors].map(addParentClasses(this.base, this.line)),
        'Line Button Ghost': ['', ...this.colors].map(addParentClasses(this.base, this.line)),
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
