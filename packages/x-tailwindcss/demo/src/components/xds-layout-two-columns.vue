<template>
  <XdsBaseShowcase #default="{ cssClass }" title="Layout two columns" :sections="sections">
    <label for="layout-two-columns-modal" class="x-button">Open layout example</label>
    <input id="layout-two-columns-modal" type="checkbox" class="modal-toggle" />

    <div class="modal x-bg-neutral-10">
      <div :class="[cssClass, 'x-layout-min-margin-48']">
        <div class="x-layout-item x-bg-neutral-0 border-b-1 x-border-neutral-25">
          <div class="flex items-center justify-between py-2">
            <span class="x-title3">TWO COLUMNS LAYOUT</span>
            <label for="layout-two-columns-modal" class="x-button x-button-ghost ml-auto">
              Close
            </label>
          </div>
        </div>

        <div class="x-layout-item border-b-1 x-border-neutral-25">
          <div class="flex items-center justify-between py-4">
            <div class="x-title3">HEADER START</div>
            <div class="x-title2">HEADER MIDDLE</div>
            <div class="x-title3">HEADER END</div>
          </div>
        </div>

        <div class="x-layout-item border-b-1 x-border-neutral-25">
          <div class="x-title3 flex justify-center p-4">SUB HEADER</div>
        </div>

        <div class="x-layout-item x-layout-no-margin-right x-layout-expand mb-4 mt-4">
          <div class="x-layout-expand flex gap-6">
            <div class="x-scroll w-[128px]">
              <div class="x-bg-neutral-25 flex h-[2000px] flex-col justify-between p-3">
                <span>ASIDE</span>
                <span class="place-self-end">ASIDE BOTTOM</span>
              </div>
            </div>

            <div class="x-scroll x-layout-expand">
              <div class="x-layout-item x-layout-no-margin-left">
                <div class="x-bg-neutral-25 flex h-[2000px] flex-col justify-between p-3">
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
