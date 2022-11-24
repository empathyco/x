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
      <span class="x-highlight-match">{{ section.substring(3) }}</span>
    </button>
  </XdsBaseShowcase>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { ShowcaseSections } from '../types/types';
  import XdsBaseShowcase from './xds-base-showcase.vue';
  import CuratedIcon from './icons/curated.vue';

  @Component({
    components: {
      XdsBaseShowcase,
      CuratedIcon
    }
  })
  export default class XdsHighlightShowcase extends Vue {
    @Prop({ default: () => 'x-highlight-text' })
    public base!: string;

    @Prop({ default: () => 'x-highlight-text-invert' })
    public inverted!: string;

    protected get sections(): ShowcaseSections {
      return {
        Default: [this.base],
        Inverted: [this.inverted]
      };
    }
  }
</script>
