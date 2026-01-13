<template>
  <XdsBaseShowcase
    v-slot="{ cssClass, section, copyCssClassesToClipboard }"
    title="Sliding panel"
    :sections="sections"
  >
    <div
      :class="cssClass"
      title="Click me to copy CSS classes"
      @click="copyCssClassesToClipboard"
      @keydown="copyCssClassesToClipboard"
    >
      <button class="button sliding-panel-button-left">ᐸ</button>
      <div
        class="flex gap-3"
        :class="{
          'sliding-panel-fade': section === 'Fade',
          'sliding-panel-fade-sm':
            section === 'Combinations' && cssClass.includes('sliding-panel-buttons-outside'),
          'sliding-panel-fade-lg':
            section === 'Combinations' && cssClass.includes('sliding-panel-buttons-center'),
        }"
      >
        <div
          v-for="(item, index) of items"
          :key="index"
          class="flex min-h-[100px] min-w-[100px] items-center justify-center bg-gray-300"
        >
          <span>{{ item }}</span>
        </div>
      </div>
      <button class="button sliding-panel-button-right">ᐳ</button>
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
      default: 'sliding-panel',
    },
    buttonsPositionVariants: {
      type: Array as PropType<string[]>,
      default: () => ['', 'sliding-panel-buttons-center', 'sliding-panel-buttons-outside'],
    },
    showButtonsOnHover: {
      type: Array as PropType<string[]>,
      default: () => [
        'sliding-panel-show-buttons-on-hover',
        'sliding-panel-show-buttons-on-hover sliding-panel-at-start',
        'sliding-panel-show-buttons-on-hover sliding-panel-at-end',
      ],
    },
    fadeSizes: {
      type: Array as PropType<string[]>,
      default: () => [
        '',
        'sliding-panel-at-start',
        'sliding-panel-at-end',
        'sliding-panel-at-start sliding-panel-at-end',
      ],
    },
  },
  data() {
    return {
      items: [
        'Baghdad',
        'Nairobi',
        'Ankara',
        'Thais',
        'Edron',
        'Venore',
        'Carlin',
        'Belgrado',
        'Zagreb',
        'Sarajevo',
      ],
      combinations: [
        'sliding-panel-buttons-center sliding-panel-show-buttons-on-hover',
        'sliding-panel-buttons-outside sliding-panel-show-buttons-on-hover',

        'sliding-panel-buttons-outside sliding-panel-show-buttons-on-hover sliding-panel-at-start',

        'sliding-panel-buttons-center sliding-panel-show-buttons-on-hover sliding-panel-at-end',
      ],
    }
  },
  computed: {
    sections(): ShowcaseSections {
      return {
        Default: [this.base],
        Buttons: this.buttonsPositionVariants.map(addParentClasses(this.base)),
        Hover: this.showButtonsOnHover.map(addParentClasses(this.base)),
        Fade: this.fadeSizes.map(addParentClasses(this.base)),
        Combinations: this.combinations.map(addParentClasses(this.base)),
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

<style scoped></style>
