<template>
  <XdsBaseShowcase v-slot="{ cssClass }" title="Layout single column" :sections="sections">
    <label for="layout-single-column-modal" class="button">Open layout example</label>
    <input id="layout-single-column-modal" type="checkbox" class="modal-toggle" />

    <div class="modal bg-white">
      <div class="layout-min-margin-48" :class="cssClass">
        <div class="layout-item border-b border-gray-400 bg-white">
          <div class="flex items-center justify-between py-2">
            <span class="title3">SINGLE COLUMN LAYOUT</span>
            <label for="layout-single-column-modal" class="button button-ghost ml-auto">
              Close
            </label>
          </div>
        </div>

        <div class="layout-item border-b border-gray-400">
          <div class="flex items-center justify-between py-4">
            <div class="title3">HEADER START</div>
            <div class="title2">HEADER MIDDLE</div>
            <div class="title3">HEADER END</div>
          </div>
        </div>

        <div class="layout-item border-b border-gray-400">
          <div class="title3 flex justify-center p-4">SUB HEADER</div>
        </div>

        <div class="scroll">
          <div class="layout-item layout-expand">
            <div class="flex h-[2000px] flex-col justify-between bg-gray-200 p-3">
              <section>MAIN</section>
              <span class="place-self-end">MAIN BOTTOM</span>
            </div>
          </div>
        </div>

        <div class="layout-item layout-overlap">
          <button class="button mb-4 self-end justify-self-center">FLOATING</button>
        </div>

        <div class="layout-item">
          <div class="title3 flex justify-center p-4">FOOTER</div>
        </div>
      </div>
    </div>
  </XdsBaseShowcase>
</template>

<script lang="ts">
import type { ShowcaseSections } from '../types/types'
import { defineComponent } from 'vue'
import XdsBaseShowcase from './xds-base-showcase.vue'

export default defineComponent({
  components: {
    XdsBaseShowcase,
  },
  props: {
    base: {
      type: String,
      default: 'layout-container layout-max-width-md',
    },
  },
  computed: {
    sections(): ShowcaseSections {
      return {
        '': [this.base],
      }
    },
  },
})
</script>

<style lang="scss" scoped>
code {
  text-decoration: underline;
}
</style>
