<template>
  <XdsBaseShowcase
    #default="{ cssClass, section, copyCssClassesToClipboard, removeClassPrefix }"
    title="Input Group"
    :sections="sections"
  >
    <div
      :key="cssClass"
      @click="copyCssClassesToClipboard"
      @keydown="copyCssClassesToClipboard"
      :class="cssClass"
      title="Click me to copy CSS classes"
      :disabled="section === 'Disabled'"
    >
      <CuratedIcon class="x-icon" />
      <input
        class="x-input"
        :disabled="section === 'Disabled'"
        :placeholder="removeClassPrefix(cssClass, base).trim() || 'input-group'"
      />
      <button
        @click.stop="copyCssClassesToClipboard"
        :disabled="section === 'Disabled'"
        class="x-button x-input-group-button"
      >
        <CrossIcon class="x-icon" />
      </button>
      <button
        @click.stop="copyCssClassesToClipboard"
        :disabled="section === 'Disabled'"
        class="x-button x-input-group-button x-input-group-button-rectangle"
      >
        clear
      </button>
      <button
        @click.stop="copyCssClassesToClipboard"
        :disabled="section === 'Disabled'"
        class="x-button x-input-group-button-primary"
        :class="{
          'x-input-group-button-outlined': section.includes('Outlined'),
          'x-input-group-button-ghost': section.includes('Ghost')
        }"
      >
        <CheckIcon class="x-icon" />
      </button>
    </div>
  </XdsBaseShowcase>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { ShowcaseSections } from '../types/types';
  import { addParentClasses } from '../utils';
  import CrossIcon from './icons/cross.vue';
  import XdsBaseShowcase from './xds-base-showcase.vue';
  import CheckIcon from './icons/check.vue';
  import CuratedIcon from './icons/curated.vue';

  @Component({
    components: {
      XdsBaseShowcase,
      CheckIcon,
      CrossIcon,
      CuratedIcon
    }
  })
  export default class XdsInputGroupShowcase extends Vue {
    @Prop({ default: () => 'x-input-group' })
    public base!: string;

    @Prop({ default: () => ['x-input-group-sm', 'x-input-group-md', 'x-input-group-lg'] })
    public sizes!: string[];

    @Prop({
      default: () => [
        'x-input-group-neutral',
        'x-input-group-lead',
        'x-input-group-auxiliary',
        'x-input-group-accent',
        'x-input-group-highlight',
        'x-input-group-success',
        'x-input-group-warning',
        'x-input-group-error'
      ]
    })
    public colors!: string[];

    @Prop({ default: () => ['x-input-group-line'] })
    public line!: string;

    @Prop({
      default: () => [
        'x-input-group-lead x-input-group-sm',
        'x-input-group-auxiliary x-input-group-line x-input-group-sm',
        'x-input-group-accent x-input-group-lg ',
        'x-input-group-warning x-input-group-line x-input-group-lg'
      ]
    })
    public combinations!: string[];

    protected get sections(): ShowcaseSections {
      return {
        Default: [this.base],
        Sizes: this.sizes.map(addParentClasses(this.base)),
        Colors: this.colors.map(addParentClasses(this.base)),
        Outlined: ['', ...this.colors].map(addParentClasses(this.base)),
        Ghost: ['', ...this.colors].map(addParentClasses(this.base)),
        Line: [this.base + ' ' + this.line],
        'Line Sizes': this.sizes.map(addParentClasses(this.base, this.line)),
        'Line Colors': this.colors.map(addParentClasses(this.base, this.line)),
        'Line Button Outlined': ['', ...this.colors].map(addParentClasses(this.base, this.line)),
        'Line Button Ghost': ['', ...this.colors].map(addParentClasses(this.base, this.line)),
        Disabled: [this.base, addParentClasses(this.base)(this.line)],
        Combinations: this.combinations.map(addParentClasses(this.base))
      };
    }
  }
</script>
