<template>
  <XdsBaseShowcase #default="{ cssClass }" title="Layout two columns" :sections="sections">
    <label for="layout-two-columns-modal" class="x-button">Open layout example</label>
    <input id="layout-two-columns-modal" type="checkbox" class="modal-toggle" />

    <div class="modal x-bg-neutral-10">
      <div :class="[cssClass, 'x-layout-min-margin-48']">
        <div class="x-layout-item x-bg-neutral-0 x-border-b-1 x-border-neutral-25">
          <div class="x-flex x-justify-between x-items-center x-py-8">
            <span class="x-title3">TWO COLUMNS LAYOUT</span>
            <label for="layout-two-columns-modal" class="x-button x-button-ghost x-ml-auto">
              Close
            </label>
          </div>
        </div>

        <div class="x-layout-item x-border-b-1 x-border-neutral-25">
          <div class="x-flex x-justify-between x-items-center x-py-16">
            <div class="x-title3">HEADER START</div>
            <div class="x-title2">HEADER MIDDLE</div>
            <div class="x-title3">HEADER END</div>
          </div>
        </div>

        <div class="x-layout-item x-border-b-1 x-border-neutral-25">
          <div class="x-flex x-justify-center x-p-16 x-title3">SUB HEADER</div>
        </div>

        <div class="x-layout-item x-layout-no-margin-right x-layout-expand x-mt-16 x-mb-16">
          <div class="x-flex x-layout-expand x-gap-24">
            <div class="x-scroll x-w-128">
              <div class="x-flex x-flex-col x-justify-between x-h-[2000px] x-p-12 x-bg-neutral-25">
                <span>ASIDE</span>
                <span class="x-place-self-end">ASIDE BOTTOM</span>
              </div>
            </div>

            <div class="x-scroll x-layout-expand">
              <div class="x-layout-item x-layout-no-margin-left">
                <div
                  class="x-flex x-flex-col x-justify-between x-h-[2000px] x-p-12 x-bg-neutral-25"
                >
                  <section>MAIN</section>
                  <span class="x-place-self-end">MAIN BOTTOM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="x-layout-item x-layout-overlap">
          <button
            class="x-layout-on-margin-right x-justify-self-start x-self-end x-button x-button-sm x-button-circle x-mb-16"
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
