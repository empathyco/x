<template>
  <XdsBaseShowcase
    #default="{ cssClass, copyCssClassesToClipboard, removeClassPrefix }"
    :title="`Typography || ${base}`"
    :sections="sections"
  >
    <h1>{{ removeClassPrefix(cssClass, base) }}</h1>
    <p
      :key="cssClass"
      @click="copyCssClassesToClipboard"
      @keydown="copyCssClassesToClipboard"
      :class="cssClass"
      title="Click me to copy CSS classes"
    >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce gravida posuere nisi, sed
      porttitor sem semper ac. Aliquam erat volutpat
    </p>
  </XdsBaseShowcase>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { ShowcaseSections } from '../types/types';
  import { addParentClasses } from '../utils';
  import XdsBaseShowcase from './xds-base-showcase.vue';
  import CuratedIcon from './icons/curated.vue';

  @Component({
    components: {
      XdsBaseShowcase,
      CuratedIcon
    }
  })
  export default class XdsTypographyShowCase extends Vue {
    @Prop({ default: () => 'x-text1' })
    public base!: string;
    @Prop({ default: () => ['x-text1-sm', 'x-text1-md', 'x-text1-lg'] })
    public sizes!: string[];

    protected get sections(): ShowcaseSections {
      return {
        Default: [this.base],
        Sizes: this.sizes.map(addParentClasses(this.base))
      };
    }
  }
</script>
