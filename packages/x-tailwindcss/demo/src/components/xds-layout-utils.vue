<template>
  <XdsBaseShowcase
    v-slot="{ copyCssClassesToClipboard }"
    title="Layout utilities"
    :sections="sections"
  >
    <label for="layout-utils-modal" class="x-button">See layout utils</label>
    <input id="layout-utils-modal" type="checkbox" class="modal-toggle" />

    <div class="modal bg-white">
      <div class="flex p-4">
        <div class="x-title2">Layout utilities</div>
        <label for="layout-utils-modal" class="x-button x-button-link ml-auto">Close</label>
      </div>

      <div v-for="(sectionClasses, sectionName) in modalContent" :key="sectionName">
        <div class="x-title3 mt-8 px-4 pb-2">{{ sectionName }}</div>
        <div class="mb-4 px-4 text-xl">
          {{ sectionDescriptions[sectionName] }}
        </div>
        <div v-for="cssClass in sectionClasses" :key="cssClass" class="flex flex-col pb-3">
          <code class="px-4 py-2">{{ cssClass }}</code>
          <div
            class="x-layout-container x-layout-min-margin-256 x-layout-max-width-md h-[80px] w-full bg-gray-200"
          >
            <template v-if="sectionName === 'Overlap'">
              <div v-if="cssClass.split(' ')[1] === 'x-layout-overlap'" class="x-layout-item">
                <span class="h-[60px] bg-gray-300 p-2">item</span>
              </div>

              <div
                :key="cssClass"
                :class="cssClass"
                title="Click me to copy CSS classes"
                @click="copyCssClassesToClipboard"
                @keydown="copyCssClassesToClipboard"
              >
                <span class="w-[80%] justify-self-center bg-gray-400 p-2">This is overlapping</span>
              </div>

              <div v-if="cssClass.includes('x-layout-overlap-from-top')" class="x-layout-item">
                <span class="h-[60px] bg-gray-300 p-2">item</span>
              </div>
            </template>

            <template v-else-if="sectionName === 'On margin'">
              <div class="x-layout-item">
                <div v-if="cssClass === 'x-layout-on-margin-right'" class="bg-gray-300 p-2">
                  item
                </div>
                <div
                  :key="cssClass"
                  :class="cssClass"
                  title="Click me to copy CSS classes"
                  @click="copyCssClassesToClipboard"
                  @keydown="copyCssClassesToClipboard"
                >
                  <div class="bg-gray-400 p-2">
                    {{ cssClass }}
                  </div>
                </div>
                <div v-if="cssClass === 'x-layout-on-margin-left'" class="bg-gray-300 p-2">
                  item
                </div>
              </div>
            </template>

            <div
              v-else
              :key="cssClass"
              :class="cssClass"
              title="Click me to copy CSS classes"
              @click="copyCssClassesToClipboard"
              @keydown="copyCssClassesToClipboard"
            >
              <span class="self-stretch bg-gray-300 p-2">item</span>
            </div>
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
      default: 'x-layout-item',
    },
    noMargin: {
      type: Array as PropType<string[]>,
      default: () => ['x-layout-no-margin', 'x-layout-no-margin-left', 'x-layout-no-margin-right'],
    },
    onMargin: {
      type: Array as PropType<string[]>,
      default: () => ['x-layout-on-margin-left', 'x-layout-on-margin-right'],
    },
    overlap: {
      type: Array as PropType<string[]>,
      default: () => ['x-layout-overlap', 'x-layout-overlap-from-top'],
    },
    expand: {
      type: Array as PropType<string[]>,
      default: () => ['x-layout-expand'],
    },
  },
  data() {
    return {
      modalContent: {
        'No margin': this.noMargin.map(addParentClasses(this.base)),
        'On margin': this.onMargin,
        Overlap: this.overlap.map(addParentClasses(this.base)),
        Expand: this.expand.map(addParentClasses(this.base)),
      },
      sectionDescriptions: {
        'No margin': 'Removes the margin from one or both sides of the layout item.',
        'On margin': 'Positions an element in one of the side margins of the layout.',
        Overlap: 'Positions an element over a layout item.',
        Expand: 'Makes a layout item to fit the container height.',
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
