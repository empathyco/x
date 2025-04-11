<template>
  <XdsBaseShowcase
    v-slot="{ cssClass, copyCssClassesToClipboard, removeClassPrefix }"
    title="Progress Bar"
    :sections="sections"
  >
    <div class="lex-col flex gap-4">
      <h3 class="text-sm">{{ removeClassPrefix(cssClass, base).trim() || 'default' }}</h3>
      <div
        class="w-[320px]"
        :class="cssClass"
        @click="copyCssClassesToClipboard"
        @keyup="copyCssClassesToClipboard"
      >
        <div class="x-progress-bar-fill w-[30%]" />
      </div>
    </div>
  </XdsBaseShowcase>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { ShowcaseSections } from '../types/types'
import { computed, defineComponent } from 'vue'
import { addParentClasses } from '../utils'
import XdsBaseShowcase from './xds-base-showcase.vue'

export default defineComponent({
  components: { XdsBaseShowcase },
  props: {
    base: {
      type: String,
      default: 'x-progress-bar',
    },
    colors: {
      type: Array as PropType<string[]>,
      default: () => [
        '',
        'x-progress-bar-neutral',
        'x-progress-bar-lead',
        'x-progress-bar-auxiliary',
        'x-progress-bar-accent',
        'x-progress-bar-highlight',
        'x-progress-bar-success',
        'x-progress-bar-warning',
        'x-progress-bar-error',
      ],
    },
    sizes: {
      type: Array as PropType<string[]>,
      default: () => ['x-progress-bar-md', 'x-progress-bar-lg'],
    },
    combinations: {
      type: Array as PropType<string[]>,
      default: () => ['x-progress-bar-lg x-progress-bar-warning'],
    },
  },
  setup(props) {
    const sections = computed<ShowcaseSections>(() => ({
      Default: [props.base],
      Sizes: props.sizes.map(addParentClasses(props.base)),
      Colors: props.colors.map(addParentClasses(props.base)),
      Combinations: props.combinations.map(addParentClasses(props.base)),
    }))

    const copyCssClassesToClipboard = (event: MouseEvent | KeyboardEvent): void => {
      navigator.clipboard.writeText((event.currentTarget as HTMLElement).classList.value)
    }

    const removeClassPrefix = (cssClasses: string, prefix: string): string => {
      return cssClasses.replace(new RegExp(`${prefix}-?`, 'g'), '')
    }

    return { sections, copyCssClassesToClipboard, removeClassPrefix }
  },
})
</script>
