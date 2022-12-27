<template>
  <XdsBaseShowcase
    #default="{ cssClass, section, copyCssClassesToClipboard, removeClassPrefix }"
    title="Suggestion Group"
    :sections="sections"
  >
    <div
      :key="cssClass"
      @click="copyCssClassesToClipboard"
      @keydown="copyCssClassesToClipboard"
      :class="cssClass"
      :style="section === 'Default' ? { width: '200px' } : ''"
      title="Click me to copy CSS classes"
    >
      <button class="x-suggestion">
        <CuratedIcon class="x-icon" />
        <template v-if="section === 'Default'">
          very long default suggestion to test line wrap alignment
        </template>
        <template v-else>{{ removeClassPrefix(cssClass, base) }} suggestion group</template>
      </button>
      <button
        v-if="section === 'Combinations layer'"
        class="x-suggestion-group-button x-suggestion-group-button-layout"
        :class="{
          'x-suggestion-group-button-lighter': cssClass.includes('x-suggestion-group-success'),
          'x-suggestion-group-button-ghost': !cssClass.includes('x-suggestion-group-success')
        }"
      >
        clear
      </button>
      <button v-if="section !== 'Combinations layer'" class="x-suggestion-group-button">
        <CrossIcon class="x-icon" />
      </button>
    </div>
  </XdsBaseShowcase>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { ShowcaseSections } from '../types/types';
  import { addParentClasses } from '../utils';
  import CuratedIcon from './icons/curated.vue';
  import CrossIcon from './icons/cross.vue';
  import XdsBaseShowcase from './xds-base-showcase.vue';

  @Component({
    components: {
      CuratedIcon,
      CrossIcon,
      XdsBaseShowcase
    }
  })
  export default class XdsSuggestionGroup extends Vue {
    @Prop({ default: () => 'x-suggestion-group' })
    public base!: string;

    @Prop({
      default: () => ['x-suggestion-group-sm', 'x-suggestion-group-md', 'x-suggestion-group-lg']
    })
    public sizes!: string[];

    @Prop({
      default: () => [
        '',
        'x-suggestion-group-neutral',
        'x-suggestion-group-lead',
        'x-suggestion-group-auxiliary',
        'x-suggestion-group-accent',
        'x-suggestion-group-highlight',
        'x-suggestion-group-success',
        'x-suggestion-group-warning',
        'x-suggestion-group-error'
      ]
    })
    public colors!: string[];

    @Prop({ default: () => ['x-suggestion-group-outlined'] })
    public outlined!: string;

    @Prop({ default: () => ['x-suggestion-group-ghost'] })
    public ghost!: string;

    @Prop({
      default: () => [
        'x-suggestion-group-success x-suggestion-group-sm',
        'x-suggestion-group-outlined x-suggestion-group-auxiliary x-suggestion-group-md ',
        'x-suggestion-group-ghost x-suggestion-group-lg'
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
        Combinations: this.combinations.map(addParentClasses(this.base)),
        'Combinations layer': this.combinations.map(addParentClasses(this.base))
      };
    }
  }
</script>
