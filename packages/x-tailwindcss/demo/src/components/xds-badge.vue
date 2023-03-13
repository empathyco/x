<template>
  <XdsBaseShowcase
    #default="{ cssClass, removeClassPrefix, copyCssClassesToClipboard, section }"
    title="Badge"
    :sections="sections"
    :sectionsClasses="sectionClasses"
  >
    <button v-if="cssClass.includes('attach')" class="x-button x-attach-container">
      {{ removeClassPrefix(cssClass, base) }}
      <span
        @click="copyCssClassesToClipboard"
        @keydown="copyCssClassesToClipboard"
        :class="cssClass"
      >
        10
      </span>
    </button>
    <span
      v-else
      @click="copyCssClassesToClipboard"
      @keydown="copyCssClassesToClipboard"
      :class="cssClass"
    >
      <template v-if="section === 'WithIcon'">
        <CuratedIcon class="x-icon" />
      </template>
      <template v-else>
        {{ !cssClass.includes('circle') ? `${removeClassPrefix(cssClass, base)} badge` : '1' }}
      </template>
    </span>
  </XdsBaseShowcase>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { ShowcaseSectionsClasses, ShowcaseSections } from '../types/types';
  import { addParentClasses } from '../utils';
  import XdsBaseShowcase from './xds-base-showcase.vue';
  import CuratedIcon from './icons/curated.vue';

  type Sections =
    | 'Default'
    | 'Sizes'
    | 'Circle'
    | 'Colors'
    | 'Light'
    | 'Outlined'
    | 'Bright'
    | 'AttachTo'
    | 'WithIcon'
    | 'Combinations';

  @Component({
    components: {
      XdsBaseShowcase,
      CuratedIcon
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

    @Prop({
      default: () => [
        'x-attach-to-top-left',
        'x-attach-to-top-right',
        'x-attach-to-bottom-left',
        'x-attach-to-bottom-right'
      ]
    })
    public attachTo!: string[];

    @Prop({
      default: () => ['x-badge-sm', '', 'x-badge-circle x-badge-sm', 'x-badge-circle']
    })
    public withIcon!: string[];

    @Prop({
      default: () => [
        'x-badge-error x-badge-sm x-badge-outlined',
        'x-badge-light x-badge-lead x-badge-circle',
        'x-badge-outlined x-badge-circle x-badge-warning x-badge-sm',
        'x-badge-light x-badge-outlined x-badge-auxiliary',
        'x-badge-circle x-badge-light x-badge-lead x-attach-to-top-right',
        'x-badge-sm x-badge-highlight x-attach-to-top-right'
      ]
    })
    public combinations!: string[];

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
        Bright: this.colors.map(addParentClasses(this.base, this.bright)),
        AttachTo: this.attachTo.map(addParentClasses(this.base)),
        WithIcon: this.withIcon.map(addParentClasses(this.base)),
        Combinations: this.combinations.map(addParentClasses(this.base))
      };
    }
  }
</script>
