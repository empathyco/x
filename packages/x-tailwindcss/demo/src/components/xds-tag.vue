<template>
  <XdsBaseShowcase
    v-slot="{ cssClass, section, copyCssClassesToClipboard, removeClassPrefix }"
    title="Tag"
    :sections="sections"
  >
    <button
      :key="cssClass"
      :class="cssClass"
      title="Click me to copy CSS classes"
      :disabled="section === 'Disabled'"
      @click="copyCssClassesToClipboard"
    >
      {{ removeClassPrefix(cssClass, base) }} tag
      <PlusIcon class="icon" />
    </button>
  </XdsBaseShowcase>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { ShowcaseSections } from '../types/types'
import { computed, defineComponent } from 'vue'
import { addParentClasses } from '../utils'
import PlusIcon from './icons/plus.vue'
import XdsBaseShowcase from './xds-base-showcase.vue'

export default defineComponent({
  components: {
    XdsBaseShowcase,
    PlusIcon,
  },
  props: {
    base: {
      type: String,
      default: 'tag',
    },
    sizes: {
      type: Array as PropType<string[]>,
      default: () => ['tag-sm', 'tag-md', 'tag-lg'],
    },
    colors: {
      type: Array as PropType<string[]>,
      default: () => [
        '',
        'tag-neutral',
        'tag-lead',
        'tag-auxiliary',
        'tag-accent',
        'tag-highlight',
        'tag-success',
        'tag-warning',
        'tag-error',
      ],
    },
    selected: {
      type: String,
      default: 'selected',
    },
    outlined: {
      type: String,
      default: 'tag-outlined',
    },
    solid: {
      type: String,
      default: 'tag-solid',
    },
    ghost: {
      type: String,
      default: 'tag-ghost',
    },
    tight: {
      type: String,
      default: 'tag-tight',
    },
    combinations: {
      type: Array as PropType<string[]>,
      default: () => [
        'tag-lead tag-sm',
        'tag-auxiliary tag-outlined tag-lg selected',
        'tag-highlight tag-solid tag-lg selected',
        'tag-success tag-tight tag-sm selected',
        'tag-warning tag-ghost selected',
      ],
    },
  },
  setup(props) {
    const sections = computed<ShowcaseSections>(() => ({
      Default: [props.base],
      Sizes: props.sizes.map(addParentClasses(props.base)),
      Colors: props.colors.map(addParentClasses(props.base)),
      'Default Selected': props.colors.map(addParentClasses(props.base, props.selected)),
      Outlined: props.colors.map(addParentClasses(props.base, props.outlined)),
      'Outlined Selected': props.colors.map(
        addParentClasses(props.base, props.selected, props.outlined),
      ),
      Solid: props.colors.map(addParentClasses(props.base, props.solid)),
      'Solid Selected': props.colors.map(addParentClasses(props.base, props.selected, props.solid)),
      Ghost: props.colors.map(addParentClasses(props.base, props.ghost)),
      'Ghost Selected': props.colors.map(addParentClasses(props.base, props.selected, props.ghost)),
      Tight: props.colors.map(addParentClasses(props.base, props.tight)),
      'Tight Selected': props.colors.map(addParentClasses(props.base, props.selected, props.tight)),
      Disabled: [
        props.base,
        addParentClasses(props.base)(props.selected),
        addParentClasses(props.base)(props.outlined),
        addParentClasses(props.base, props.selected)(props.outlined),
        addParentClasses(props.base)(props.solid),
        addParentClasses(props.base, props.selected)(props.solid),
        addParentClasses(props.base)(props.ghost),
        addParentClasses(props.base, props.selected)(props.ghost),
        addParentClasses(props.base)(props.tight),
        addParentClasses(props.base, props.selected)(props.tight),
      ],
      Combinations: props.combinations.map(addParentClasses(props.base)),
    }))

    const copyCssClassesToClipboard = (event: MouseEvent): void => {
      navigator.clipboard.writeText((event.currentTarget as HTMLElement).classList.value)
    }

    const removeClassPrefix = (cssClasses: string, prefix: string): string => {
      return cssClasses.replace(new RegExp(`${prefix}-?`, 'g'), '')
    }

    return { sections, copyCssClassesToClipboard, removeClassPrefix }
  },
})
</script>
