<template>
  <XdsBaseShowcase
    #default="{ copyCssClassesToClipboard }"
    title="Layout utilities"
    :sections="sections"
  >
    <label for="layout-utils-modal" class="x-button">See layout utils</label>
    <input id="layout-utils-modal" type="checkbox" class="modal-toggle" />

    <div class="modal x-bg-neutral-0">
      <div class="x-flex x-p-16">
        <div class="x-title2">Layout utilities</div>
        <label for="layout-utils-modal" class="x-button x-button-link x-ml-auto">Close</label>
      </div>

      <div v-for="(sectionClasses, sectionName) in modalContent" :key="sectionName">
        <div class="x-title3 x-mt-32 x-pb-8 x-px-16">{{ sectionName }}</div>
        <div class="x-text-md x-mb-16 x-px-16">
          {{ sectionDescriptions[sectionName] }}
        </div>
        <div v-for="cssClass in sectionClasses" :key="cssClass" class="x-flex x-flex-col x-pb-12">
          <code class="x-py-8 x-px-16">{{ cssClass }}</code>
          <div
            class="x-layout-container x-layout-min-margin-256 x-layout-max-width-md x-w-full x-h-[80px] x-bg-neutral-25"
          >
            <template v-if="sectionName === 'Overlap'">
              <div v-if="cssClass.split(' ')[1] === 'x-layout-overlap'" class="x-layout-item">
                <span class="x-bg-lead-25 x-p-8 x-h-[60px]">item</span>
              </div>

              <div
                :key="cssClass"
                @click="copyCssClassesToClipboard"
                @keydown="copyCssClassesToClipboard"
                :class="cssClass"
                title="Click me to copy CSS classes"
              >
                <span class="x-justify-self-center x-bg-lead-50 x-p-8 x-w-[80%]">
                  This is overlapping
                </span>
              </div>

              <div v-if="cssClass.includes('x-layout-overlap-from-top')" class="x-layout-item">
                <span class="x-bg-lead-25 x-p-8 x-h-[60px]">item</span>
              </div>
            </template>

            <template v-else-if="sectionName === 'On margin'">
              <div class="x-layout-item">
                <div v-if="cssClass === 'x-layout-on-margin-right'" class="x-bg-lead-25 x-p-8">
                  item
                </div>
                <div
                  :key="cssClass"
                  @click="copyCssClassesToClipboard"
                  @keydown="copyCssClassesToClipboard"
                  :class="cssClass"
                  title="Click me to copy CSS classes"
                >
                  <div class="x-bg-lead-50 x-p-8">
                    {{ cssClass }}
                  </div>
                </div>
                <div v-if="cssClass === 'x-layout-on-margin-left'" class="x-bg-lead-25 x-p-8">
                  item
                </div>
              </div>
            </template>

            <div
              v-else
              :key="cssClass"
              @click="copyCssClassesToClipboard"
              @keydown="copyCssClassesToClipboard"
              :class="cssClass"
              title="Click me to copy CSS classes"
            >
              <span class="x-bg-lead-25 x-p-8 x-self-stretch">item</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </XdsBaseShowcase>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { ShowcaseSections } from '../types/types';
  import { addParentClasses } from '../utils';
  import XdsBaseShowcase from './xds-base-showcase.vue';

  export default defineComponent({
    components: {
      XdsBaseShowcase
    },
    props: {
      base: {
        type: String,
        default: 'x-layout-item'
      },
      noMargin: {
        type: Array as PropType<string[]>,
        default: () => ['x-layout-no-margin', 'x-layout-no-margin-left', 'x-layout-no-margin-right']
      },
      onMargin: {
        type: Array as PropType<string[]>,
        default: () => ['x-layout-on-margin-left', 'x-layout-on-margin-right']
      },
      overlap: {
        type: Array as PropType<string[]>,
        default: () => ['x-layout-overlap', 'x-layout-overlap-from-top']
      },
      expand: {
        type: Array as PropType<string[]>,
        default: () => ['x-layout-expand']
      }
    },
    data() {
      return {
        modalContent: {
          'No margin': this.noMargin.map(addParentClasses(this.base)),
          'On margin': this.onMargin,
          Overlap: this.overlap.map(addParentClasses(this.base)),
          Expand: this.expand.map(addParentClasses(this.base))
        },
        sectionDescriptions: {
          'No margin': 'Removes the margin from one or both sides of the layout item.',
          'On margin': 'Positions an element in one of the side margins of the layout.',
          Overlap: 'Positions an element over a layout item.',
          Expand: 'Makes a layout item to fit the container height.'
        }
      };
    },
    computed: {
      sections(): ShowcaseSections {
        return {
          '': [this.base]
        };
      }
    },
    methods: {
      copyCssClassesToClipboard(event: MouseEvent): void {
        navigator.clipboard.writeText((event.currentTarget as HTMLElement).classList.value);
      }
    }
  });
</script>

<style lang="scss" scoped>
  :deep(h2) {
    align-self: flex-start;
  }
</style>
