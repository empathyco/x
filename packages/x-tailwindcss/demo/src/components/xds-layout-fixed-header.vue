<template>
  <XdsBaseShowcase #default="{ cssClass }" title="Layout fixed header" :sections="sections">
    <label for="layout-fixed-header-modal" class="x-button">Open layout example</label>
    <input id="layout-fixed-header-modal" type="checkbox" class="modal-toggle" />

    <div class="modal bg-white">
      <div :class="[cssClass, 'x-layout-min-margin-48 bg-gray-100']">
        <div class="x-scroll flex flex-col">
          <div class="x-layout-item bg-neutral-0 border-b-1 border-neutral-25 sticky top-0">
            <div class="flex items-center justify-between py-2">
              <span class="x-title3">FIXED HEADER LAYOUT</span>
              <label for="layout-fixed-header-modal" class="x-button x-button-ghost ml-auto">
                Close
              </label>
            </div>

            <div class="flex items-center justify-between py-4">
              <div class="x-title3">HEADER START</div>
              <div class="x-title2">HEADER MIDDLE</div>
              <div class="x-title3">HEADER END</div>
            </div>
          </div>

          <div class="x-layout-item border-b-1 x-border-neutral-25">
            <div class="x-title3 flex justify-center p-4">SUBHEADER</div>
          </div>

          <div class="x-layout-item">
            <div class="x-title3 flex justify-center bg-gray-100 p-4">TOOLBAR</div>
          </div>

          <div class="x-layout-item x-layout-expand">
            <div class="flex h-[2000px] flex-col justify-between bg-gray-200 p-3">
              <section>MAIN</section>
              <span class="place-self-end">MAIN BOTTOM</span>
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
  import { defineComponent } from 'vue';
  import { ShowcaseSections } from '../types/types';
  import XdsBaseShowcase from './xds-base-showcase.vue';

  export default defineComponent({
    components: {
      XdsBaseShowcase
    },
    props: {
      base: {
        type: String,
        default: 'x-layout-container x-layout-max-width-md'
      }
    },
    computed: {
      sections(): ShowcaseSections {
        return {
          '': [this.base]
        };
      }
    }
  });
</script>

<style lang="scss" scoped>
  code {
    text-decoration: underline;
  }
</style>
