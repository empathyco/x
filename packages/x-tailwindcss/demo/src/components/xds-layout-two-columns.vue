<template>
  <XdsBaseShowcase v-slot="{ cssClass }" title="Layout two columns" :sections="sections">
    <label for="layout-two-columns-modal" class="x-button">Open layout example</label>
    <input id="layout-two-columns-modal" type="checkbox" class="modal-toggle" />

    <div class="modal bg-gray-100">
      <div class="x-layout-min-margin-48" :class="cssClass">
        <div class="x-layout-item border-b-1 border-gray-300 bg-white">
          <div class="flex items-center justify-between py-2">
            <span class="x-title3">TWO COLUMNS LAYOUT</span>
            <label for="layout-two-columns-modal" class="x-button x-button-ghost ml-auto">
              Close
            </label>
          </div>
        </div>

        <div class="x-layout-item border-b-1 border-gray-300">
          <div class="flex items-center justify-between py-4">
            <div class="x-title3">HEADER START</div>
            <div class="x-title2">HEADER MIDDLE</div>
            <div class="x-title3">HEADER END</div>
          </div>
        </div>

        <div class="x-layout-item border-b-1 border-gray-300">
          <div class="x-title3 flex justify-center p-4">SUB HEADER</div>
        </div>

        <div class="x-layout-item x-layout-no-margin-right x-layout-expand mb-4 mt-4">
          <div class="x-layout-expand flex gap-6">
            <div class="x-scroll w-[128px]">
              <div class="flex h-[2000px] flex-col justify-between bg-gray-200 p-3">
                <span>ASIDE</span>
                <span class="place-self-end">ASIDE BOTTOM</span>
              </div>
            </div>

            <div class="x-scroll x-layout-expand">
              <div class="x-layout-item x-layout-no-margin-left">
                <div class="flex h-[2000px] flex-col justify-between bg-gray-200 p-3">
                  <section>MAIN</section>
                  <span class="place-self-end">MAIN BOTTOM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="x-layout-item x-layout-overlap">
          <button
            class="x-layout-on-margin-right x-button x-button-sm x-button-circle mb-4 self-end justify-self-start"
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
      default: 'x-layout-container x-layout-max-width-md',
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
