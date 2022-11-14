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
      <span v-if="cssClass.includes('matching')">
        {{ removeClassPrefix(cssClass, base) }}
        <span class="x-suggestion-matching-part">sugge</span>
        <span>stion</span>
      </span>
      <template v-else-if="section === 'Default'">
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
      default: () => ['x-suggestion-md', 'x-suggestion-lg']
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

    @Prop({ default: () => ['x-suggestion-tag'] })
    public tag!: string;

    @Prop({ default: () => ['x-suggestion-matching'] })
    public matching!: string[];

    @Prop({
      default: () => ['x-suggestion-tag x-suggestion-md', 'x-suggestion-tag x-suggestion-lg']
    })
    public tagSizes!: string[];

    @Prop({
      default: () => [
        'x-suggestion x-suggestion-accent x-suggestion-md',
        'x-suggestion x-suggestion-matching x-suggestion-auxiliary x-suggestion-md',
        'x-suggestion-tag x-suggestion-success x-suggestion-lg'
      ]
    })
    public combinations!: string[];

    protected get sections(): ShowcaseSections {
      return {
        Default: [this.base],
        Colors: this.colors.map(addParentClasses(this.base)),
        Sizes: this.sizes.map(addParentClasses(this.base)),
        Tag: this.colors.map(addParentClasses(this.base, this.tag)),
        'Tag Sizes': this.tagSizes.map(addParentClasses(this.base)),
        Matching: this.matching.map(addParentClasses(this.base)),
        Combinations: this.combinations.map(addParentClasses(this.base))
      };
    }
  }
</script>
