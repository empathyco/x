<template>
  <XdsBaseShowcase
    #default="{ cssClass, section, copyCssClassesToClipboard, removeClassPrefix }"
    title="Tag"
    :sections="sections"
  >
    <button
      :key="cssClass"
      @click="copyCssClassesToClipboard"
      :class="cssClass"
      title="Click me to copy CSS classes"
      :disabled="section === 'Disabled'"
    >
      {{ removeClassPrefix(cssClass, base) }} tag
      <PlusIcon class="x-icon" />
    </button>
  </XdsBaseShowcase>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { ShowcaseSections } from '../types/types';
  import { addParentClasses } from '../utils';
  import XdsBaseShowcase from './xds-base-showcase.vue';
  import PlusIcon from './icons/plus.vue';

  @Component({
    components: {
      XdsBaseShowcase,
      PlusIcon
    }
  })
  export default class XdsTagShowcase extends Vue {
    @Prop({ default: () => 'x-tag' })
    public base!: string;

    @Prop({ default: () => ['x-tag-sm', 'x-tag-md', 'x-tag-lg'] })
    public sizes!: string[];

    @Prop({
      default: () => [
        '',
        'x-tag-neutral',
        'x-tag-lead',
        'x-tag-auxiliary',
        'x-tag-accent',
        'x-tag-highlight',
        'x-tag-success',
        'x-tag-warning',
        'x-tag-error'
      ]
    })
    public colors!: string[];

    @Prop({ default: () => ['x-selected'] })
    public selected!: string;

    @Prop({ default: () => ['x-tag-outlined'] })
    public outlined!: string;

    @Prop({ default: () => ['x-tag-solid'] })
    public solid!: string;

    @Prop({ default: () => ['x-tag-ghost'] })
    public ghost!: string;

    @Prop({ default: () => ['x-tag-tight'] })
    public tight!: string;

    @Prop({
      default: () => [
        'x-tag-lead x-tag-sm',
        'x-tag-auxiliary x-tag-outlined x-tag-lg x-selected',
        'x-tag-highlight x-tag-solid x-tag-lg x-selected',
        'x-tag-success x-tag-tight x-tag-sm x-selected',
        'x-tag-warning x-tag-ghost x-selected'
      ]
    })
    public combinations!: string[];

    protected get sections(): ShowcaseSections {
      return {
        Default: [this.base],
        Sizes: this.sizes.map(addParentClasses(this.base)),
        Colors: this.colors.map(addParentClasses(this.base)),
        ['Default Selected']: this.colors.map(addParentClasses(this.base, this.selected)),
        Outlined: this.colors.map(addParentClasses(this.base, this.outlined)),
        ['Outlined Selected']: this.colors.map(
          addParentClasses(this.base, this.selected, this.outlined)
        ),
        Solid: this.colors.map(addParentClasses(this.base, this.solid)),
        ['Solid Selected']: this.colors.map(addParentClasses(this.base, this.selected, this.solid)),
        Ghost: this.colors.map(addParentClasses(this.base, this.ghost)),
        ['Ghost Selected']: this.colors.map(addParentClasses(this.base, this.selected, this.ghost)),
        Tight: this.colors.map(addParentClasses(this.base, this.tight)),
        ['Tight Selected']: this.colors.map(addParentClasses(this.base, this.selected, this.tight)),
        Disabled: [
          this.base,
          addParentClasses(this.base)(this.selected),
          addParentClasses(this.base)(this.outlined),
          addParentClasses(this.base, this.selected)(this.outlined),
          addParentClasses(this.base)(this.solid),
          addParentClasses(this.base, this.selected)(this.solid),
          addParentClasses(this.base)(this.ghost),
          addParentClasses(this.base, this.selected)(this.ghost),
          addParentClasses(this.base)(this.tight),
          addParentClasses(this.base, this.selected)(this.tight)
        ],
        Combinations: this.combinations.map(addParentClasses(this.base))
      };
    }
  }
</script>
