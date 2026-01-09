<template>
  <XdsBaseShowcase v-slot="{ cssClass }" title="Layout fixed header" :sections="sections">
    <label for="layout-fixed-header-modal" class="button">Open layout example</label>
    <input id="layout-fixed-header-modal" type="checkbox" class="modal-toggle" />

    <div class="modal bg-white">
      <div class="layout-min-margin-48 bg-gray-100" :class="cssClass">
        <div class="scroll flex flex-col">
          <div class="layout-item border-b-1 sticky top-0 border-gray-300 bg-white">
            <div class="flex items-center justify-between py-2">
              <span class="title3">FIXED HEADER LAYOUT</span>
              <label for="layout-fixed-header-modal" class="button button-ghost ml-auto">
                Close
              </label>
            </div>

            <div class="flex items-center justify-between py-4">
              <div class="title3">HEADER START</div>
              <div class="title2">HEADER MIDDLE</div>
              <div class="title3">HEADER END</div>
            </div>
          </div>

          <div class="layout-item border-b-1 border-gray-300">
            <div class="title3 flex justify-center p-4">SUBHEADER</div>
          </div>

          <div class="layout-item">
            <div class="title3 flex justify-center bg-gray-100 p-4">TOOLBAR</div>
          </div>

          <div class="layout-item layout-expand">
            <div class="flex h-[2000px] flex-col justify-between bg-gray-200 p-3">
              <section>MAIN</section>
              <span class="place-self-end">MAIN BOTTOM</span>
            </div>
          </div>
        </div>

        <div class="layout-item layout-overlap">
          <button
            class="layout-on-margin-right button button-sm button-circle mb-4 self-end justify-self-start"
          >
            ▲
          </button>
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
