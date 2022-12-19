<template>
  <XdsBaseShowcase
    #default="{ cssClass, section, copyCssClassesToClipboard, removeClassPrefix }"
    title="Input"
    :sections="sections"
  >
    <input
      :key="cssClass"
      @click="copyCssClassesToClipboard"
      :class="cssClass"
      title="Click me to copy CSS classes"
      :disabled="section === 'Disabled'"
      :placeholder="removeClassPrefix(cssClass, base).trim() || 'input'"
    />
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
  export default class XdsInputShowcase extends Vue {
    @Prop({ default: () => 'x-input' })
    public base!: string;
    @Prop({ default: () => ['x-input-sm', 'x-input-md', 'x-input-lg'] })
    public sizes!: string[];
    @Prop({
      default: () => [
        'x-input-neutral',
        'x-input-lead',
        'x-input-auxiliary',
        'x-input-accent',
        'x-input-highlight',
        'x-input-success',
        'x-input-warning',
        'x-input-error'
      ]
    })
    public colors!: string[];

    @Prop({ default: () => ['x-input-line'] })
    public line!: string;

    protected get sections(): ShowcaseSections {
      return {
        Default: [this.base],
        Colors: this.colors.map(addParentClasses(this.base)),
        Sizes: this.sizes.map(addParentClasses(this.base)),
        line: this.colors.map(addParentClasses(this.base, this.line)),
        Disabled: [this.base, addParentClasses(this.base)(this.line)]
      };
    }
  }
</script>
