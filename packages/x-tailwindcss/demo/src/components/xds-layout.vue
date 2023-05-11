<template>
  <XdsBaseShowcase #default="{ copyCssClassesToClipboard }" title="Layout" :sections="sections">
    <label for="layout-modal" class="x-button">See layouts</label>
    <input id="layout-modal" type="checkbox" class="modal-toggle" />

    <div class="modal x-bg-neutral-0">
      <div class="x-flex x-p-16">
        <div class="x-title2">Layouts</div>
        <label for="layout-modal" class="x-button x-button-link x-ml-auto">Close</label>
      </div>

      <div v-for="(sectionClasses, sectionName) in modalContent" :key="sectionName">
        <div class="x-title3 x-mt-32 x-pb-8 x-px-16">{{ sectionName }}</div>
        <div v-for="cssClass in sectionClasses" :key="cssClass" class="x-flex x-flex-col x-pb-12">
          <div v-if="cssClass.includes('x-layout-min-margin-12')" class="x-text-md x-mb-16 x-px-16">
            There are as many classes as spacing variables declared in the Tailwind theme:
            <code>x-layout-min-margin-[spacing-value]</code>
          </div>
          <div
            v-if="cssClass.includes('x-layout-container-mx-128')"
            class="x-text-md x-mb-16 x-px-16"
          >
            Custom alignment is available with Tailwind spacing classes or arbitrary values:
          </div>
          <code class="x-py-8 x-px-16">{{ cssClass }}</code>
          <div
            @click="copyCssClassesToClipboard"
            @keydown="copyCssClassesToClipboard"
            :class="cssClass"
            title="Click me to copy CSS classes"
            class="x-bg-neutral-25 x-w-full"
          >
            <div class="x-layout-item"><span class="x-bg-lead-25 x-p-8">item</span></div>
          </div>
        </div>
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
  export default class XdsLayoutShowcase extends Vue {
    @Prop({ default: 'x-layout-container' })
    public base!: string;

    @Prop({
      default: () => ['x-layout-max-width-md', 'x-layout-max-width-lg', 'x-layout-max-width-full']
    })
    public maxWidth!: string[];

    @Prop({
      default: () => [
        'x-layout-min-margin-12',
        'x-layout-min-margin-20',
        'x-layout-min-margin-32',
        'x-layout-min-margin-48'
      ]
    })
    public minMargin!: string[];

    @Prop({
      default: () => [
        'x-layout-container-mx-128',
        'x-layout-container-mr-128',
        'x-layout-container-ml-128',
        'x-layout-container-ml-[375px]'
      ]
    })
    public customAlign!: string[];

    public modalContent = {
      Layout: [this.base],
      'Max Width': this.maxWidth.map(addParentClasses(this.base)),
      'Min Width': this.minMargin.map(addParentClasses(this.base)),
      'Custom Alignment': this.customAlign.map(addParentClasses(this.base))
    };

    protected get sections(): ShowcaseSections {
      return {
        '': [this.base]
      };
    }
  }
</script>
