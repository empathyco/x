<template>
  <XdsBaseShowcase
    v-slot="{ cssClass, removeClassPrefix, copyCssClassesToClipboard, section }"
    title="Badge"
    :sections="sections"
    :sections-classes="sectionClasses"
  >
    <button v-if="cssClass.includes('attach')" class="button attach-container">
      {{ removeClassPrefix(cssClass, base) }}
      <span
        :class="cssClass"
        @click="copyCssClassesToClipboard"
        @keydown="copyCssClassesToClipboard"
      >
        10
      </span>
    </button>
    <span
      v-else
      :class="cssClass"
      @click="copyCssClassesToClipboard"
      @keydown="copyCssClassesToClipboard"
    >
      <CuratedIcon v-if="section === 'WithIcon'" class="icon" />
      <template v-else>
        {{ !cssClass.includes('circle') ? `${removeClassPrefix(cssClass, base)} badge` : '1' }}
      </template>
    </span>
  </XdsBaseShowcase>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { ShowcaseSectionsClasses } from '../types/types'
import { computed, defineComponent } from 'vue'
import { addParentClasses } from '../utils'
import CuratedIcon from './icons/curated.vue'
import XdsBaseShowcase from './xds-base-showcase.vue'

type Sections =
  | 'Default'
  | 'Sizes'
  | 'Circle'
  | 'Colors'
  | 'Light'
  | 'Outlined'
  | 'Bright'
  | 'AttachTo'
  | 'WithIcon'
  | 'Combinations'
export default defineComponent({
  components: {
    XdsBaseShowcase,
    CuratedIcon,
  },
  props: {
    base: {
      type: String,
      default: () => 'badge',
    },
    sizes: {
      type: Array as PropType<string[]>,
      default: () => ['badge-sm', 'badge-md'],
    },
    circle: {
      type: String,
      default: () => 'badge-circle',
    },
    colors: {
      type: Array as PropType<string[]>,
      default: () => [
        '',
        'badge-neutral',
        'badge-lead',
        'badge-auxiliary',
        'badge-accent',
        'badge-highlight',
        'badge-success',
        'badge-warning',
        'badge-error',
      ],
    },
    light: {
      type: String,
      default: () => 'badge-light',
    },
    outlined: {
      type: String,
      default: () => 'badge-outlined',
    },
    bright: {
      type: String,
      default: () => 'badge-bright',
    },
    attachTo: {
      type: Array as PropType<string[]>,
      default: () => [
        'attach-to-top-left',
        'attach-to-top-right',
        'attach-to-bottom-left',
        'attach-to-bottom-right',
      ],
    },
    withIcon: {
      type: Array as PropType<string[]>,
      default: () => ['badge-sm', '', 'badge-circle badge-sm', 'badge-circle'],
    },
    combinations: {
      type: Array as PropType<string[]>,
      default: () => [
        'badge-error badge-sm badge-outlined',
        'badge-light badge-lead badge-circle',
        'badge-outlined badge-circle badge-warning badge-sm',
        'badge-light badge-outlined badge-auxiliary',
        'badge-circle badge-light badge-lead attach-to-top-right',
        'badge-sm badge-highlight attach-to-top-right',
      ],
    },
  },
  setup(props) {
    const sectionClasses: ShowcaseSectionsClasses<Sections> = {
      Bright: 'bg-gray-700 p-8',
    }
    const sections = computed(() => {
      return {
        Default: [props.base],
        Sizes: props.sizes.map(addParentClasses(props.base)),
        Circle: props.sizes.map(addParentClasses(props.base, props.circle)),
        Colors: props.colors.map(addParentClasses(props.base)),
        Light: props.colors.map(addParentClasses(props.base, props.light)),
        Outlined: props.colors.map(addParentClasses(props.base, props.outlined)),
        Bright: props.colors.map(addParentClasses(props.base, props.bright)),
        AttachTo: props.attachTo.map(addParentClasses(props.base)),
        WithIcon: props.withIcon.map(addParentClasses(props.base)),
        Combinations: props.combinations.map(addParentClasses(props.base)),
      }
    })

    return {
      sectionClasses,
      sections,
    }
  },
})
</script>
