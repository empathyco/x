<template>
  <XdsBaseShowcase
    #default="{ cssClass, copyCssClassesToClipboard }"
    title="Scroll"
    :sections="sections"
  >
    <div
      @keydown="copyCssClassesToClipboard"
      @click="copyCssClassesToClipboard"
      :class="cssClass"
      class="x-h-[200px] x-w-[200px] x-bg-warning-25"
    >
      <div :key="cssClass" class="x-h-[1000px]"></div>
    </div>
  </XdsBaseShowcase>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { ShowcaseSections } from '../types/types';
  import XdsBaseShowcase from './xds-base-showcase.vue';

  @Component({
    components: {
      XdsBaseShowcase
    }
  })
  export default class XdsScroll extends Vue {
    @Prop({ default: () => 'x-scroll' })
    public base!: string;

    protected get sections(): ShowcaseSections {
      return {
        Default: [this.base]
      };
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep h2 {
    align-self: flex-start;
  }
</style>
