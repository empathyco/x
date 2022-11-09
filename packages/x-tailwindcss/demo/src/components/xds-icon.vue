<template>
  <XdsBaseShowcase
    #default="{ cssClass, section, copyCssClassesToClipboard, removeClassPrefix }"
    title="Icon"
    :sections="sections"
  >
    <h3 class="x-text-xxs">{{ removeClassPrefix(cssClass, base) }}</h3>
    <slot v-bind="{ cssClass, section, copyCssClassesToClipboard }">
      <div class="x-flex">
        <CheckIcon @click.native="copyCssClassesToClipboard" :class="cssClass" />
        <CheckFillIcon @click.native="copyCssClassesToClipboard" :class="cssClass" />
        <CuratedIcon @click.native="copyCssClassesToClipboard" :class="cssClass" />
        <CuratedFillIcon @click.native="copyCssClassesToClipboard" :class="cssClass" />
        <OptionIcon @click.native="copyCssClassesToClipboard" :class="cssClass" />
        <CheckAltIcon @click.native="copyCssClassesToClipboard" :class="cssClass" />
      </div>
    </slot>
  </XdsBaseShowcase>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { ShowcaseSections } from '../types/types';
  import { addParentClasses } from '../utils';
  import XdsBaseShowcase from './xds-base-showcase.vue';
  import CheckIcon from './icons/check.vue';
  import CheckFillIcon from './icons/check-fill.vue';
  import CuratedIcon from './icons/curated.vue';
  import CuratedFillIcon from './icons/curated-fill.vue';
  import OptionIcon from './icons/option.vue';
  import CheckAltIcon from './icons/check-alt.vue';

  @Component({
    components: {
      XdsBaseShowcase,
      CheckIcon,
      CheckFillIcon,
      CuratedIcon,
      CuratedFillIcon,
      OptionIcon,
      CheckAltIcon
    }
  })
  export default class XdsButtonShowcase extends Vue {
    @Prop({ default: () => 'x-icon' })
    public base!: string;

    @Prop({ default: () => ['x-icon-sm', 'x-icon-md', 'x-icon-lg', 'x-icon-xl'] })
    public sizes!: string[];

    @Prop({
      default: () => [
        'x-icon-neutral',
        'x-icon-lead',
        'x-icon-auxiliary',
        'x-icon-accent',
        'x-icon-highlight',
        'x-icon-success',
        'x-icon-warning',
        'x-icon-error',
        'x-icon-neutral-0',
        'x-icon-neutral-10',
        'x-icon-neutral-25',
        'x-icon-neutral-50',
        'x-icon-neutral-75',
        'x-icon-neutral-90',
        'x-icon-neutral-100',
        'x-icon-lead-25',
        'x-icon-lead-50',
        'x-icon-lead-75',
        'x-icon-auxiliary-25',
        'x-icon-auxiliary-50',
        'x-icon-auxiliary-75',
        'x-icon-accent-25',
        'x-icon-accent-50',
        'x-icon-accent-75',
        'x-icon-highlight-25',
        'x-icon-highlight-50',
        'x-icon-highlight-75',
        'x-icon-success-25',
        'x-icon-success-50',
        'x-icon-success-75',
        'x-icon-warning-25',
        'x-icon-warning-50',
        'x-icon-warning-75',
        'x-icon-error-25',
        'x-icon-error-50',
        'x-icon-error-75'
      ]
    })
    public colors!: string[];

    @Prop({
      default: () => [
        'x-icon-bg-neutral',
        'x-icon-bg-lead',
        'x-icon-bg-auxiliary',
        'x-icon-bg-accent',
        'x-icon-bg-highlight',
        'x-icon-bg-success',
        'x-icon-bg-warning',
        'x-icon-bg-error',
        'x-icon-bg-neutral-0',
        'x-icon-bg-neutral-10',
        'x-icon-bg-neutral-25',
        'x-icon-bg-neutral-50',
        'x-icon-bg-neutral-75',
        'x-icon-bg-neutral-90',
        'x-icon-bg-neutral-100',
        'x-icon-bg-lead-25',
        'x-icon-bg-lead-50',
        'x-icon-bg-lead-75',
        'x-icon-bg-auxiliary-25',
        'x-icon-bg-auxiliary-50',
        'x-icon-bg-auxiliary-75',
        'x-icon-bg-accent-25',
        'x-icon-bg-accent-50',
        'x-icon-bg-accent-75',
        'x-icon-bg-highlight-25',
        'x-icon-bg-highlight-50',
        'x-icon-bg-highlight-75',
        'x-icon-bg-success-25',
        'x-icon-bg-success-50',
        'x-icon-bg-success-75',
        'x-icon-bg-warning-25',
        'x-icon-bg-warning-50',
        'x-icon-bg-warning-75',
        'x-icon-bg-error-25',
        'x-icon-bg-error-50',
        'x-icon-bg-error-75'
      ]
    })
    public backgroundColors!: string[];

    @Prop({
      default: () => ['x-icon-sharp']
    })
    public sharp!: string[];

    @Prop({
      default: () => [
        'x-icon-stroke-width-sm',
        'x-icon-stroke-width-md',
        'x-icon-stroke-width-lg',
        'x-icon-stroke-width-xl'
      ]
    })
    public strokeWidth!: string[];

    @Prop({
      default: () => [
        'x-icon-lead x-icon-xl x-icon-stroke-width-lg x-icon-sharp',
        'x-icon-error x-icon-bg-warning x-icon-lg'
      ]
    })
    public combinations!: string[];

    protected get sections(): ShowcaseSections {
      return {
        Default: [this.base],
        Sizes: this.sizes.map(addParentClasses(this.base)),
        Colors: this.colors.map(addParentClasses(this.base)),
        'Background Colors': this.backgroundColors.map(addParentClasses(this.base)),
        Sharp: this.sharp.map(addParentClasses(this.base)),
        'Stroke Width': this.strokeWidth.map(addParentClasses(this.base)),
        Combinations: this.combinations.map(addParentClasses(this.base))
      };
    }
  }
</script>
