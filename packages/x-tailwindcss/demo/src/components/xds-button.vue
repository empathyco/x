<template>
  <XdsBaseShowcase
    v-slot="{ cssClass, section, copyCssClassesToClipboard, removeClassPrefix }"
    title="Button"
    :sections="sections"
  >
    <button
      :key="cssClass"
      :class="cssClass"
      title="Click me to copy CSS classes"
      :disabled="section === 'Disabled'"
      @click="copyCssClassesToClipboard"
    >
      <CuratedIcon class="icon" />
      <span v-if="!cssClass.includes('circle') && !cssClass.includes('square')">
        {{ removeClassPrefix(cssClass, base) }} button
      </span>
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
    XdsBaseShowcase,
    CuratedIcon,
  },
  props: {
    base: {
      type: String,
      default: 'button',
    },
    sizes: {
      type: Array as PropType<string[]>,
      default: () => ['button-sm', 'button-md', 'button-lg', 'button-xl'],
    },
    colors: {
      type: Array as PropType<string[]>,
      default: () => [
        '',
        'button-neutral',
        'button-lead',
        'button-auxiliary',
        'button-accent',
        'button-highlight',
        'button-success',
        'button-warning',
        'button-error',
      ],
    },
    layouts: {
      type: Array as PropType<string[]>,
      default: () => ['button-circle', 'button-square'],
    },
    outline: {
      type: String,
      default: 'button-outlined',
    },
    ghost: {
      type: String,
      default: 'button-ghost',
    },
    tight: {
      type: String,
      default: 'button-tight',
    },
    link: {
      type: String,
      default: 'button-link',
    },
    selected: {
      type: String,
      default: 'selected',
    },
    combinations: {
      type: Array as PropType<string[]>,
      default: () => [
        'button-lead button-sm',
        'button-outlined button-square button-lg selected',
        'button-auxiliary button-circle button-outlined',
        'button-accent button-tight',
        'button-warning button-ghost',
      ],
    },
  },
  computed: {
    sections(): ShowcaseSections {
      return {
        Default: [this.base],
        Sizes: this.sizes.map(addParentClasses(this.base)),
        Layout: this.layouts.map(addParentClasses(this.base)),
        Colors: this.colors.map(addParentClasses(this.base)),
        'Default Selected': this.colors.map(addParentClasses(this.base, this.selected)),
        Outline: this.colors.map(addParentClasses(this.base, this.outline)),
        'Outline Selected': this.colors.map(
          addParentClasses(this.base, this.selected, this.outline),
        ),
        Ghost: this.colors.map(addParentClasses(this.base, this.ghost)),
        'Ghost Selected': this.colors.map(addParentClasses(this.base, this.selected, this.ghost)),
        Tight: this.colors.map(addParentClasses(this.base, this.tight)),
        'Tight Selected': this.colors.map(addParentClasses(this.base, this.selected, this.tight)),
        Link: this.colors.map(addParentClasses(this.base, this.link)),
        'Link Selected': this.colors.map(addParentClasses(this.base, this.selected, this.link)),
        Disabled: [
          this.base,
          addParentClasses(this.base)(this.selected),
          addParentClasses(this.base)(this.outline),
          addParentClasses(this.base, this.selected)(this.outline),
          addParentClasses(this.base)(this.ghost),
          addParentClasses(this.base, this.selected)(this.ghost),
          addParentClasses(this.base)(this.tight),
          addParentClasses(this.base, this.selected)(this.tight),
          addParentClasses(this.base)(this.link),
          addParentClasses(this.base, this.selected)(this.link),
        ],
        Combinations: this.combinations.map(addParentClasses(this.base)),
      }
    },
  },
})
</script>
