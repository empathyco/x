<template>
  <XdsBaseShowcase
    #default="{ cssClass, section, copyCssClassesToClipboard }"
    title="Highlight"
    :sections="sections"
  >
    <button
      :key="cssClass"
      @click="copyCssClassesToClipboard"
      :class="cssClass"
      title="Click me to copy CSS classes"
    >
      <span>{{ section.substring(0, 3) }}</span>
      <span class="x-highlight-text-match">{{ section.substring(3) }}</span>
    </button>
  </XdsBaseShowcase>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { ShowcaseSections } from '../types/types';
  import XdsBaseShowcase from './xds-base-showcase.vue';

  @Component({
    components: {
      XdsBaseShowcase
    }
  })
  export default class XdsHighlightShowcase extends Vue {
    @Prop({ default: () => 'x-highlight-text' })
    public base!: string;

    protected get sections(): ShowcaseSections {
      return {
        Default: [this.base]
      };
    }
  }
</script>
