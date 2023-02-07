<template>
  <XdsBaseShowcase
    #default="{ cssClass, copyCssClassesToClipboard, removeClassPrefix }"
    title="Layout"
    :sections="sections"
  >
    <div v-if="cssClass.includes('x-layout-min-margin-12')" class="x-text-md x-mb-16">
      There are as many classes as spacing variables declared in the Tailwind theme:
      <code>x-layout-min-margin-[spacing-value]</code>
    </div>
    {{ removeClassPrefix(cssClass, base) }}
    <div
      :key="cssClass"
      @click="copyCssClassesToClipboard"
      @keydown="copyCssClassesToClipboard"
      :class="cssClass"
      title="Click me to copy CSS classes"
      class="x-bg-neutral-50 x-w-[100vw]"
    >
      <div class="x-layout-item"><span class="x-bg-accent-50 x-p-8">item</span></div>
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

    protected get sections(): ShowcaseSections {
      return {
        Default: [this.base],
        'Max width': this.maxWidth.map(addParentClasses(this.base)),
        'Min margin': this.minMargin.map(addParentClasses(this.base))
      };
    }
  }
</script>
