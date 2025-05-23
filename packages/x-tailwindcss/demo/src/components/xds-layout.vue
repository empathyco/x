<template>
  <XdsBaseShowcase v-slot="{ copyCssClassesToClipboard }" title="Layout" :sections="sections">
    <label for="layout-modal" class="x-button">See layouts</label>
    <input id="layout-modal" type="checkbox" class="modal-toggle" />

    <div class="modal bg-white">
      <div class="flex p-4">
        <div class="x-title2">Layouts</div>
        <label for="layout-modal" class="x-button x-button-link ml-auto">Close</label>
      </div>

      <div v-for="(sectionClasses, sectionName) in modalContent" :key="sectionName">
        <div class="x-title3 mt-8 px-4 pb-2">{{ sectionName }}</div>
        <div v-for="cssClass in sectionClasses" :key="cssClass" class="flex flex-col pb-3">
          <div v-if="cssClass.includes('x-layout-min-margin-12')" class="mb-4 px-4 text-xl">
            There are as many classes as spacing variables declared in the Tailwind theme:
            <code>x-layout-min-margin-[spacing-value]</code>
          </div>
          <div v-if="cssClass.includes('x-layout-container-mx-128')" class="mb-4 px-4 text-xl">
            Custom alignment is available with Tailwind spacing classes or arbitrary values:
          </div>
          <code class="px-4 py-2">{{ cssClass }}</code>
          <div
            :class="cssClass"
            title="Click me to copy CSS classes"
            class="w-full bg-gray-300"
            @click="copyCssClassesToClipboard"
            @keydown="copyCssClassesToClipboard"
          >
            <div class="x-layout-item"><span class="bg-gray-400 p-2">item</span></div>
          </div>
        </div>
      </div>
    </div>
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
      default: 'x-layout-container',
    },
    maxWidth: {
      type: Array as PropType<string[]>,
      default: () => ['x-layout-max-width-md', 'x-layout-max-width-lg', 'x-layout-max-width-full'],
    },
    minMargin: {
      type: Array as PropType<string[]>,
      default: () => [
        'x-layout-min-margin-12',
        'x-layout-min-margin-20',
        'x-layout-min-margin-32',
        'x-layout-min-margin-48',
      ],
    },
    customAlign: {
      type: Array as PropType<string[]>,
      default: () => [
        'x-layout-container-mx-128',
        'x-layout-container-mr-128',
        'x-layout-container-ml-128',
        'x-layout-container-ml-[375px]',
      ],
    },
  },
  data() {
    return {
      modalContent: {
        Layout: [this.base],
        'Max Width': this.maxWidth.map(addParentClasses(this.base)),
        'Min Width': this.minMargin.map(addParentClasses(this.base)),
        'Custom Alignment': this.customAlign.map(addParentClasses(this.base)),
      },
    }
  },
  computed: {
    sections(): ShowcaseSections {
      return {
        '': [this.base],
      }
    },
  },
  methods: {
    copyCssClassesToClipboard(event: MouseEvent): void {
      navigator.clipboard.writeText((event.currentTarget as HTMLElement).classList.value)
    },
  },
})
</script>
