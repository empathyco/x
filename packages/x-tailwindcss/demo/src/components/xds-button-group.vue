<template>
  <XdsBaseShowcase
    v-slot="{ cssClass, copyCssClassesToClipboard }"
    title="Button Group"
    :sections="sections"
  >
    <div class="flex flex-wrap gap-5">
      <div
        :class="cssClass"
        @click="copyCssClassesToClipboard"
        @keydown="copyCssClassesToClipboard"
      >
        <button class="x-button">BUTTON 1</button>
        <button class="x-button">BUTTON 2</button>
        <button class="x-button">BUTTON 3</button>
      </div>

      <div
        :class="cssClass"
        class="gap-2"
        @click="copyCssClassesToClipboard"
        @keydown="copyCssClassesToClipboard"
      >
        <button class="x-button">BUTTON 1</button>
        <span class="x-button-group-divider" />
        <button class="x-button">BUTTON 2</button>
        <span class="x-button-group-divider" />
        <button class="x-button">BUTTON 3</button>
      </div>

      <div
        :class="cssClass"
        @click="copyCssClassesToClipboard"
        @keydown="copyCssClassesToClipboard"
      >
        <button class="x-button x-button-outlined">BUTTON 1</button>
        <button class="x-button x-button-outlined">BUTTON 2</button>
        <button class="x-button">BUTTON 3</button>
      </div>

      <div
        :class="cssClass"
        class="gap-2"
        @click="copyCssClassesToClipboard"
        @keydown="copyCssClassesToClipboard"
      >
        <button class="x-button x-button-outlined">BUTTON 1</button>
        <button class="x-button x-button-outlined">BUTTON 2</button>
        <button class="x-button">BUTTON 3</button>
      </div>

      <div
        :class="cssClass"
        class="gap-2"
        @click="copyCssClassesToClipboard"
        @keydown="copyCssClassesToClipboard"
      >
        <button class="x-button x-button-outlined">BUTTON 1</button>
        <span class="x-button-group-divider" />
        <button class="x-button x-button-outlined">BUTTON 2</button>
        <span class="x-button-group-divider" />
        <button class="x-button">BUTTON 3</button>
      </div>

      <div
        :class="cssClass"
        class="text-red-500"
        @click="copyCssClassesToClipboard"
        @keydown="copyCssClassesToClipboard"
      >
        <button class="x-button x-button-ghost">BUTTON 1</button>
        <span class="x-button-group-divider" />
        <button class="x-button x-button-ghost">BUTTON 2</button>
        <span class="x-button-group-divider" />
        <button class="x-button x-button-ghost x-button-warning">BUTTON 3</button>
      </div>

      <div
        :class="cssClass"
        class="gap-2 text-red-500"
        @click="copyCssClassesToClipboard"
        @keydown="copyCssClassesToClipboard"
      >
        <button class="x-button x-button-tight">BUTTON 1</button>
        <button class="x-button x-button-tight">BUTTON 2</button>
        <button class="x-button x-button-tight x-button-warning">BUTTON 3</button>
      </div>

      <div
        :class="cssClass"
        class="text-red-500"
        @click="copyCssClassesToClipboard"
        @keydown="copyCssClassesToClipboard"
      >
        <button class="x-button x-button-highlight x-button-circle">
          <PlusIcon class="x-icon" />
        </button>
        <button class="x-button x-button-ghost x-button-success x-button-square">
          <PlusIcon class="x-icon" />
        </button>
      </div>

      <div
        :class="cssClass"
        class="text-red-500"
        @click="copyCssClassesToClipboard"
        @keydown="copyCssClassesToClipboard"
      >
        <button class="x-button x-button-highlight x-button-square">
          <PlusIcon class="x-icon" />
        </button>
        <button class="x-button x-button-ghost x-button-success x-button-square">
          <PlusIcon class="x-icon" />
        </button>
      </div>
    </div>
  </XdsBaseShowcase>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { ShowcaseSections } from '../types/types'
import { defineComponent } from 'vue'
import { addParentClasses } from '../utils'
import PlusIcon from './icons/plus.vue'
import XdsBaseShowcase from './xds-base-showcase.vue'

export default defineComponent({
  components: { XdsBaseShowcase, PlusIcon },
  props: {
    base: {
      type: String,
      default: 'x-button-group',
    },
    rounded: {
      type: Array as PropType<string[]>,
      default: () => ['x-rounded-md'],
    },
  },
  computed: {
    sections(): ShowcaseSections {
      return {
        Default: [this.base],
        Rounded: this.rounded.map(addParentClasses(this.base)),
      }
    },
  },
})
</script>
