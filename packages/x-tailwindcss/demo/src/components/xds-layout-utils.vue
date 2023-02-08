<template>
  <XdsBaseShowcase
    #default="{ cssClass, copyCssClassesToClipboard, removeClassPrefix, section }"
    title="Layout utilities"
    :sections="sections"
  >
    {{ removeClassPrefix(cssClass, base) }}
    <div
      class="x-layout-container x-layout-min-margin-216 x-layout-max-width-lg x-w-[100vw] x-h-[80px] x-bg-neutral-25"
    >
      <template v-if="section === 'Overlap'">
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

      <template v-else-if="section === 'On margin'">
        <div class="x-layout-item">
          <div v-if="cssClass === 'x-layout-on-margin-right'" class="x-bg-lead-25 x-p-8">item</div>
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
          <div v-if="cssClass === 'x-layout-on-margin-left'" class="x-bg-lead-25 x-p-8">item</div>
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
  export default class XdsLayoutUtilsShowcase extends Vue {
    @Prop({ default: 'x-layout-item' })
    public base!: string;

    @Prop({
      default: () => ['x-layout-no-margin', 'x-layout-no-margin-left', 'x-layout-no-margin-right']
    })
    public noMargin!: string[];

    @Prop({
      default: () => ['x-layout-on-margin-left', 'x-layout-on-margin-right']
    })
    public onMargin!: string[];

    @Prop({
      default: () => ['x-layout-overlap', 'x-layout-overlap-from-top']
    })
    public overlap!: string[];

    @Prop({
      default: () => ['x-layout-expand']
    })
    public expand!: string[];

    protected get sections(): ShowcaseSections {
      return {
        Default: [this.base],
        'No margin': this.noMargin.map(addParentClasses(this.base)),
        'On margin': this.onMargin,
        Overlap: this.overlap.map(addParentClasses(this.base)),
        Expand: this.expand.map(addParentClasses(this.base))
      };
    }
  }
</script>
