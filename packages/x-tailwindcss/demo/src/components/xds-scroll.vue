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
      class="x-h-[200px] x-w-[200px]"
    >
      <div :key="cssClass" class="x-h-[1000px] x-bg-warning-50"></div>
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
