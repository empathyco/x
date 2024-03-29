<template>
  <XdsBaseShowcase
    #default="{ cssClass, section, copyCssClassesToClipboard, removeClassPrefix }"
    title="Suggestion"
    :sections="sections"
  >
    <button
      :key="cssClass"
      @click="copyCssClassesToClipboard"
      :class="cssClass"
      :style="section === 'Default' ? { width: '120px' } : ''"
      title="Click me to copy CSS classes"
    >
      <CuratedIcon class="x-icon" />
      <template v-if="section === 'Default'">
        very long default suggestion to test line wrap alignment
      </template>
      <template v-else>{{ removeClassPrefix(cssClass, base) }} suggestion</template>
    </button>
  </XdsBaseShowcase>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { ShowcaseSections } from '../types/types';
  import { addParentClasses } from '../utils';
  import CuratedIcon from './icons/curated.vue';
  import XdsBaseShowcase from './xds-base-showcase.vue';

  @Component({
    components: {
      CuratedIcon,
      XdsBaseShowcase
    }
  })
  export default class XdsSuggestion extends Vue {
    @Prop({ default: () => 'x-suggestion' })
    public base!: string;

    @Prop({
      default: () => ['x-suggestion-sm', 'x-suggestion-md', 'x-suggestion-lg']
    })
    public sizes!: string[];

    @Prop({
      default: () => [
        '',
        'x-suggestion-neutral',
        'x-suggestion-lead',
        'x-suggestion-auxiliary',
        'x-suggestion-accent',
        'x-suggestion-highlight',
        'x-suggestion-success',
        'x-suggestion-warning',
        'x-suggestion-error'
      ]
    })
    public colors!: string[];

    @Prop({ default: () => ['x-suggestion-outlined'] })
    public outlined!: string;

    @Prop({ default: () => ['x-suggestion-ghost'] })
    public ghost!: string;

    @Prop({
      default: () => [
        'x-suggestion x-suggestion-success x-suggestion-md',
        'x-suggestion x-suggestion-auxiliary x-suggestion-md',
        'x-suggestion-tag x-suggestion-error-50 x-suggestion-lg'
      ]
    })
    public combinations!: string[];

    protected get sections(): ShowcaseSections {
      return {
        Default: [this.base],
        Colors: this.colors.map(addParentClasses(this.base)),
        Sizes: this.sizes.map(addParentClasses(this.base)),
        Outlined: this.colors.map(addParentClasses(this.base, this.outlined)),
        'Outlined Sizes': this.sizes.map(addParentClasses(this.base, this.outlined)),
        Ghost: this.colors.map(addParentClasses(this.base, this.ghost)),
        'Ghost Sizes': this.sizes.map(addParentClasses(this.base, this.ghost)),
        Combinations: this.combinations.map(addParentClasses(this.base))
      };
    }
  }
</script>
