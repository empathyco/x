<template>
  <XdsBaseShowcase
    #default="{ cssClass, copyCssClassesToClipboard }"
    title="Sliding panel"
    :sections="sections"
  >
    <div
      @click="copyCssClassesToClipboard"
      @keydown="copyCssClassesToClipboard"
      :class="cssClass"
      title="Click me to copy CSS classes"
    >
      <button class="x-button x-sliding-panel__button x-sliding-panel__button-left">ᐸ</button>
      <div class="x-sliding-panel__scroll x-gap-12">
        <div
          v-for="(item, index) of items"
          :key="index"
          class="
            x-min-h-[100px] x-min-w-[100px] x-flex x-justify-center x-items-center x-bg-lead-25
          "
        >
          <span>{{ item }}</span>
        </div>
      </div>
      <button class="x-button x-sliding-panel__button x-sliding-panel__button-right">ᐳ</button>
    </div>
  </XdsBaseShowcase>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { ShowcaseSections } from '../types/types';
  import { addParentClasses } from '../utils';
  import XdsBaseShowcase from './xds-base-showcase.vue';
  @Component({
    components: {
      XdsBaseShowcase
    }
  })
  export default class XdsSlidingPanel extends Vue {
    public items = [
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
    ];

    @Prop({ default: () => 'x-sliding-panel' })
    public base!: string;

    @Prop({
      default: () => ['x-buttons-center', 'x-buttons-outside', '']
    })
    public buttonsPositionVariants!: string[];

    @Prop({
      default: () => [
        'x-sliding-panel-show-buttons-on-hover',
        'x-sliding-panel-show-buttons-on-hover x-sliding-panel--at-start',
        'x-sliding-panel-show-buttons-on-hover x-sliding-panel--at-end'
      ]
    })
    public showButtonsOnHover!: string[];

    @Prop({
      default: () => ['x-fade-sm', 'x-fade-md', 'x-fade-lg']
    })
    public fadeSizes!: string[];

    public combinations = [
      'x-buttons-center x-fade-sm',
      'x-buttons-outside x-fade-lg',
      'x-fade-md',
      'x-sliding-panel-show-buttons-on-hover x-fade-lg x-buttons-outside',
      'x-sliding-panel-show-buttons-on-hover x-fade-md x-buttons-center'
    ];

    protected get sections(): ShowcaseSections {
      return {
        Default: [this.base],
        Buttons: this.buttonsPositionVariants.map(addParentClasses(this.base)),
        Hover: this.showButtonsOnHover.map(addParentClasses(this.base)),
        Fade: this.fadeSizes.map(addParentClasses(this.base)),
        Combinations: this.combinations.map(addParentClasses(this.base))
      };
    }
  }
</script>

<style scoped></style>
