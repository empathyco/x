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
      <CuratedIcon class="x-icon" />
      <span v-if="!cssClass.includes('circle') && !cssClass.includes('square')">
        {{ removeClassPrefix(cssClass, base) || 'button' }}
      </span>
    </button>
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

    @Prop({ default: () => ['x-button-outlined'] })
    public outline!: string;

    @Prop({ default: () => ['x-button-ghost'] })
    public ghost!: string;

    @Prop({ default: () => ['x-button-tight'] })
    public tight!: string;

    @Prop({ default: () => ['x-button-link'] })
    public link!: string;

    @Prop({
      default: () => [
        'x-button-lead x-button-sm',
        'x-button-auxiliary x-button-circle x-button-outlined',
        'x-button-accent x-button-tight ',
        'x-button-warning x-button-ghost'
      ]
    })
    public combinations!: string[];

    protected get sections(): ShowcaseSections {
      return {
        Default: [this.base],
        Colors: this.colors.map(addParentClasses(this.base)),
        Sizes: this.sizes.map(addParentClasses(this.base)),
        Layout: this.layouts.map(addParentClasses(this.base)),
        Outline: this.colors.map(addParentClasses(this.base, this.outline)),
        Ghost: this.colors.map(addParentClasses(this.base, this.ghost)),
        Tight: this.colors.map(addParentClasses(this.base, this.tight)),
        Link: this.colors.map(addParentClasses(this.base, this.link)),
        Disabled: [
          this.base,
          addParentClasses(this.base)(this.outline),
          addParentClasses(this.base)(this.ghost),
          addParentClasses(this.base)(this.tight),
          addParentClasses(this.base)(this.link)
        ],
        Combinations: this.combinations.map(addParentClasses(this.base))
      };
    }
  }
</script>
