<template>
  <XdsBaseShowcase
    #default="{ cssClass, section, copyCssClassesToClipboard, removeClassPrefix }"
    title="Button"
    :sections="sections"
  >
    <button
      :key="cssClass"
      @click="copyCssClassesToClipboard"
      :class="cssClass"
      title="Click me to copy CSS classes"
      :disabled="section === 'Disabled'"
    >
      {{ removeClassPrefix(cssClass, base) || 'button' }}
    </button>
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
  export default class XdsButtonShowcase extends Vue {
    @Prop({ default: () => 'x-button' })
    public base!: string;
    @Prop({ default: () => ['x-button-sm', 'x-button-md', 'x-button-lg', 'x-button-xl'] })
    public sizes!: string[];
    @Prop({
      default: () => [
        'x-button-neutral',
        'x-button-lead',
        'x-button-auxiliary',
        'x-button-accent',
        'x-button-highlight',
        'x-button-success',
        'x-button-warning',
        'x-button-error'
      ]
    })
    public colors!: string[];

    @Prop({ default: () => ['x-button-circle', 'x-button-square'] })
    public layouts!: string[];

    @Prop({ default: () => ['x-button-ghost'] })
    public ghost!: string;

    @Prop({ default: () => ['x-button-outlined'] })
    public outline!: string;

    @Prop({
      default: () => [
        'x-button-lead x-button-sm',
        'x-button-auxiliary x-button-circle x-button-outlined'
      ]
    })
    public combinations!: string[];

    protected get sections(): ShowcaseSections {
      return {
        Default: [this.base],
        Disabled: [this.base],
        Colors: this.colors.map(addParentClasses(this.base)),
        Sizes: this.sizes.map(addParentClasses(this.base)),
        Layout: this.layouts.map(addParentClasses(this.base)),
        Outline: this.colors.map(addParentClasses(this.base, this.outline)),
        Ghost: this.colors.map(addParentClasses(this.base, this.ghost)),
        Combinations: this.combinations.map(addParentClasses(this.base))
      };
    }
  }
</script>
