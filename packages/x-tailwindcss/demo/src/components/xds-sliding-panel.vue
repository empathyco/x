<template>
  <XdsBaseShowcase
    #default="{ cssClass, section, copyCssClassesToClipboard }"
    title="Sliding panel"
    :sections="sections"
  >
    <div
      @click="copyCssClassesToClipboard"
      @keydown="copyCssClassesToClipboard"
      :class="cssClass"
      title="Click me to copy CSS classes"
    >
      <button class="x-button x-sliding-panel-button-left">ᐸ</button>
      <div
        class="flex gap-3"
        :class="{
          'x-sliding-panel-fade': section === 'Fade',
          'x-sliding-panel-fade-sm':
            section === 'Combinations' && cssClass.includes('x-sliding-panel-buttons-outside'),
          'x-sliding-panel-fade-lg':
            section === 'Combinations' && cssClass.includes('x-sliding-panel-buttons-center')
        }"
      >
        <div
          v-for="(item, index) of items"
          :key="index"
          class="x-bg-lead-25 flex min-h-[100px] min-w-[100px] items-center justify-center"
        >
          <span>{{ item }}</span>
        </div>
      </div>
      <button class="x-button x-sliding-panel-button-right">ᐳ</button>
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
        default: 'x-sliding-panel'
      },
      buttonsPositionVariants: {
        type: Array as PropType<string[]>,
        default: () => ['', 'x-sliding-panel-buttons-center', 'x-sliding-panel-buttons-outside']
      },
      showButtonsOnHover: {
        type: Array as PropType<string[]>,
        default: () => [
          'x-sliding-panel-show-buttons-on-hover',
          'x-sliding-panel-show-buttons-on-hover x-sliding-panel-at-start',
          'x-sliding-panel-show-buttons-on-hover x-sliding-panel-at-end'
        ]
      },
      fadeSizes: {
        type: Array as PropType<string[]>,
        default: () => [
          '',
          'x-sliding-panel-at-start',
          'x-sliding-panel-at-end',
          'x-sliding-panel-at-start x-sliding-panel-at-end'
        ]
      }
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
          'Sarajevo'
        ],
        combinations: [
          'x-sliding-panel-buttons-center x-sliding-panel-show-buttons-on-hover',
          'x-sliding-panel-buttons-outside x-sliding-panel-show-buttons-on-hover',
          // eslint-disable-next-line max-len
          'x-sliding-panel-buttons-outside x-sliding-panel-show-buttons-on-hover x-sliding-panel-at-start',
          // eslint-disable-next-line max-len
          'x-sliding-panel-buttons-center x-sliding-panel-show-buttons-on-hover x-sliding-panel-at-end'
        ]
      };
    },
    computed: {
      sections(): ShowcaseSections {
        return {
          Default: [this.base],
          Buttons: this.buttonsPositionVariants.map(addParentClasses(this.base)),
          Hover: this.showButtonsOnHover.map(addParentClasses(this.base)),
          Fade: this.fadeSizes.map(addParentClasses(this.base)),
          Combinations: this.combinations.map(addParentClasses(this.base))
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

<style scoped></style>
