<template>
  <XdsBaseShowcase
    #default="{ cssClass, copyCssClassesToClipboard }"
    title="Product Image"
    :sections="sections"
  >
    <div
      :key="cssClass"
      @click="copyCssClassesToClipboard"
      @keydown="copyCssClassesToClipboard"
      :class="cssClass"
      title="Click me to copy CSS classes"
      style="width: 200px"
      class="x-bg-neutral-50/60"
    >
      <img
        src="https://assets.empathy.co/images-demo/2885.jpg"
        alt="Summer Sandal"
        role="presentation"
      />
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
  export default class XdsProductImageShowcase extends Vue {
    @Prop({ default: 'x-product-image' })
    public base!: string;

    @Prop({ default: () => 'x-product-image-zoom' })
    public zoom!: string;

    @Prop({ default: () => ['x-product-image-overlay'] })
    public overlay!: string;

    protected get sections(): ShowcaseSections {
      return {
        Default: [addParentClasses(this.base)(this.zoom)],
        Overlay: [addParentClasses(this.base)(this.overlay)]
      };
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep h2 {
    align-self: flex-start;
  }
</style>
