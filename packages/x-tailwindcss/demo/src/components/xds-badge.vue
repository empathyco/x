<template>
  <XdsBaseShowcase
    #default="{ cssClass, removeClassPrefix, copyCssClassesToClipboard }"
    title="Badge"
    :sections="sections"
    :sectionsClasses="sectionClasses"
  >
    <span @click="copyCssClassesToClipboard" @keydown="copyCssClassesToClipboard" :class="cssClass">
      {{ !cssClass.includes('circle') ? `${removeClassPrefix(cssClass, base)} badge` : '1' }}
    </span>
  </XdsBaseShowcase>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { ShowcaseSectionsClasses, ShowcaseSections } from '../types/types';
  import { addParentClasses } from '../utils';
  import XdsBaseShowcase from './xds-base-showcase.vue';

  type Sections = 'Default' | 'Sizes' | 'Circle' | 'Colors' | 'Light' | 'Outlined' | 'Bright';

  @Component({
    components: {
      XdsBaseShowcase
    }
  })
  export default class XdsBadgeShowcase extends Vue {
    @Prop({ default: () => 'x-badge' })
    public base!: string;

    @Prop({ default: () => ['x-badge-sm', 'x-badge-md'] })
    public sizes!: string[];

    @Prop({ default: () => 'x-badge-circle' })
    public circle!: string;

    @Prop({
      default: () => [
        '',
        'x-badge-neutral',
        'x-badge-lead',
        'x-badge-auxiliary',
        'x-badge-accent',
        'x-badge-highlight',
        'x-badge-success',
        'x-badge-warning',
        'x-badge-error'
      ]
    })
    public colors!: string[];

    @Prop({ default: () => 'x-badge-light' })
    public light!: string;

    @Prop({ default: () => 'x-badge-outlined' })
    public outlined!: string;

    @Prop({ default: () => 'x-badge-bright' })
    public bright!: string;

    public sectionClasses: ShowcaseSectionsClasses<Sections> = {
      Bright: 'x-bg-neutral-90 x-p-8'
    };

    protected get sections(): ShowcaseSections<Sections> {
      return {
        Default: [this.base],
        Sizes: this.sizes.map(addParentClasses(this.base)),
        Circle: this.sizes.map(addParentClasses(this.base, this.circle)),
        Colors: this.colors.map(addParentClasses(this.base)),
        Light: this.colors.map(addParentClasses(this.base, this.light)),
        Outlined: this.colors.map(addParentClasses(this.base, this.outlined)),
        Bright: this.colors.map(addParentClasses(this.base, this.bright))
      };
    }
  }
</script>
