<template>
  <XdsBaseShowcase
    v-slot="{ cssClass, section, copyCssClassesToClipboard, removeClassPrefix }"
    title="Icon"
    :sections="sections"
  >
    <h3 class="text-xs">{{ removeClassPrefix(cssClass, base) }}</h3>
    <slot v-bind="{ cssClass, section, copyCssClassesToClipboard }">
      <div class="flex">
        <CheckIcon :class="cssClass" @click="copyCssClassesToClipboard" />
        <CheckFillIcon :class="cssClass" @click="copyCssClassesToClipboard" />
        <CuratedIcon :class="cssClass" @click="copyCssClassesToClipboard" />
        <CuratedFillIcon :class="cssClass" @click="copyCssClassesToClipboard" />
        <OptionIcon :class="cssClass" @click="copyCssClassesToClipboard" />
        <CheckAltIcon :class="cssClass" @click="copyCssClassesToClipboard" />
      </div>
    </slot>
  </XdsBaseShowcase>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { ShowcaseSections } from '../types/types'
import { defineComponent } from 'vue'
import { addParentClasses } from '../utils'
import CheckAltIcon from './icons/check-alt.vue'
import CheckFillIcon from './icons/check-fill.vue'
import CheckIcon from './icons/check.vue'
import CuratedFillIcon from './icons/curated-fill.vue'
import CuratedIcon from './icons/curated.vue'
import OptionIcon from './icons/option.vue'
import XdsBaseShowcase from './xds-base-showcase.vue'

export default defineComponent({
  components: {
    XdsBaseShowcase,
    CheckIcon,
    CheckFillIcon,
    CuratedIcon,
    CuratedFillIcon,
    OptionIcon,
    CheckAltIcon,
  },
  props: {
    base: {
      type: String,
      default: 'icon',
    },
    sizes: {
      type: Array as PropType<string[]>,
      default: () => ['icon-sm', 'icon-md', 'icon-lg', 'icon-xl'],
    },
    colors: {
      type: Array as PropType<string[]>,
      default: () => [
        'icon-neutral',
        'icon-lead',
        'icon-auxiliary',
        'icon-accent',
        'icon-highlight',
        'icon-success',
        'icon-warning',
        'icon-error',
        'icon-neutral-0',
        'icon-neutral-10',
        'icon-neutral-25',
        'icon-neutral-50',
        'icon-neutral-75',
        'icon-neutral-90',
        'icon-neutral-100',
        'icon-lead-25',
        'icon-lead-50',
        'icon-lead-75',
        'icon-auxiliary-25',
        'icon-auxiliary-50',
        'icon-auxiliary-75',
        'icon-accent-25',
        'icon-accent-50',
        'icon-accent-75',
        'icon-highlight-25',
        'icon-highlight-50',
        'icon-highlight-75',
        'icon-success-25',
        'icon-success-50',
        'icon-success-75',
        'icon-warning-25',
        'icon-warning-50',
        'icon-warning-75',
        'icon-error-25',
        'icon-error-50',
        'icon-error-75',
      ],
    },
    backgroundColors: {
      type: Array as PropType<string[]>,
      default: () => [
        'icon-bg-neutral',
        'icon-bg-lead',
        'icon-bg-auxiliary',
        'icon-bg-accent',
        'icon-bg-highlight',
        'icon-bg-success',
        'icon-bg-warning',
        'icon-bg-error',
        'icon-bg-neutral-0',
        'icon-bg-neutral-10',
        'icon-bg-neutral-25',
        'icon-bg-neutral-50',
        'icon-bg-neutral-75',
        'icon-bg-neutral-90',
        'icon-bg-neutral-100',
        'icon-bg-lead-25',
        'icon-bg-lead-50',
        'icon-bg-lead-75',
        'icon-bg-auxiliary-25',
        'icon-bg-auxiliary-50',
        'icon-bg-auxiliary-75',
        'icon-bg-accent-25',
        'icon-bg-accent-50',
        'icon-bg-accent-75',
        'icon-bg-highlight-25',
        'icon-bg-highlight-50',
        'icon-bg-highlight-75',
        'icon-bg-success-25',
        'icon-bg-success-50',
        'icon-bg-success-75',
        'icon-bg-warning-25',
        'icon-bg-warning-50',
        'icon-bg-warning-75',
        'icon-bg-error-25',
        'icon-bg-error-50',
        'icon-bg-error-75',
      ],
    },
    sharp: {
      type: Array as PropType<string[]>,
      default: () => ['icon-sharp'],
    },
    strokeWidth: {
      type: Array as PropType<string[]>,
      default: () => [
        'icon-stroke-width-sm',
        'icon-stroke-width-md',
        'icon-stroke-width-lg',
        'icon-stroke-width-xl',
      ],
    },
    combinations: {
      type: Array as PropType<string[]>,
      default: () => [
        'icon-lead icon-xl icon-stroke-width-lg icon-sharp',
        'icon-error icon-bg-warning icon-lg',
      ],
    },
  },
  computed: {
    sections(): ShowcaseSections {
      return {
        Default: [this.base],
        Sizes: this.sizes.map(addParentClasses(this.base)),
        Colors: this.colors.map(addParentClasses(this.base)),
        'Background Colors': this.backgroundColors.map(addParentClasses(this.base)),
        Sharp: this.sharp.map(addParentClasses(this.base)),
        'Stroke Width': this.strokeWidth.map(addParentClasses(this.base)),
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
