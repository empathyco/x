<template>
  <div>
    <XdsBaseShowcase
      v-for="(type, key) in typography"
      :key="key"
      v-slot="{ cssClass, copyCssClassesToClipboard, removeClassPrefix }"
      :title="key"
      :sections="sections(type)"
    >
      <h1>{{ removeClassPrefix(cssClass, type.base) }}</h1>
      <p
        :key="cssClass"
        :class="cssClass"
        title="Click me to copy CSS classes"
        @click="copyCssClassesToClipboard"
        @keydown="copyCssClassesToClipboard"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce gravida posuere nisi, sed
        porttitor sem semper ac. Aliquam erat volutpat
      </p>
    </XdsBaseShowcase>
  </div>
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
  computed: {
    typography(): Record<string, { base: string; sizes: string[] }> {
      return {
        'Text 1': {
          base: 'text1',
          sizes: ['text1-sm', 'text1-md', 'text1-lg'],
        },
        'Text 2': {
          base: 'text2',
          sizes: ['text2-sm', 'text2-md', 'text2-lg'],
        },
        'Title 1': {
          base: 'title1',
          sizes: ['title1-sm', 'title1-md', 'title1-lg'],
        },
        'Title 2': {
          base: 'title2',
          sizes: ['title2-sm', 'title2-md', 'title2-lg'],
        },
        'Title 3': {
          base: 'title3',
          sizes: ['title3-sm', 'title3-md', 'title3-lg'],
        },
        'Title 4': {
          base: 'title4',
          sizes: ['title4-sm', 'title4-md', 'title4-lg'],
        },
      }
    },
  },
  methods: {
    sections(type: { base: string; sizes: string[] }): ShowcaseSections {
      return {
        Default: [type.base],
        Sizes: type.sizes.map(addParentClasses(type.base)),
      }
    },
    copyCssClassesToClipboard(event: MouseEvent): void {
      navigator.clipboard.writeText((event.currentTarget as HTMLElement).classList.value)
    },
    removeClassPrefix(cssClasses: string, prefix: string): string {
      return cssClasses.replace(new RegExp(`${prefix}-?`, 'g'), '')
    },
  },
})
</script>
