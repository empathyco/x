<template>
  <XdsBaseShowcase
    #default="{ cssClass, copyCssClassesToClipboard, removeClassPrefix }"
    title="Layout"
    :sections="sections"
  >
    {{ removeClassPrefix(cssClass, base) }}
    <div
      :key="cssClass"
      @click="copyCssClassesToClipboard"
      @keydown="copyCssClassesToClipboard"
      :class="cssClass"
      title="Click me to copy CSS classes"
      class="x-bg-warning-50"
    >
      <div v-for="index in 5" :key="index" class="x-layout-item x-bg-neutral-50">
        Layout Item {{ index }}
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
      default: () => [
        'x-layout-container-sm',
        'x-layout-container-md',
        'x-layout-container-lg',
        'x-layout-container-full'
      ]
    })
    public sizes!: string[];

    @Prop({
      default: () => [
        'x-layout-container-min-margin-12',
        'x-layout-container-min-margin-20',
        'x-layout-container-min-margin-32',
        'x-layout-container-min-margin-48'
      ]
    })
    public minMargin!: string[];

    protected get sections(): ShowcaseSections {
      return {
        Default: [this.base],
        Sizes: this.sizes.map(addParentClasses(this.base)),
        Margins: this.minMargin.map(addParentClasses(this.base))
      };
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep h2 {
    align-self: flex-start;
  }

  .x-layout-item {
    max-width: var(--x-layout-max-width);
    width: 2100px;
    margin: 0 var(--x-layout-min-margin);
  }
</style>
