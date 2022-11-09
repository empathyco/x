<template>
  <XdsBaseShowcase
    #default="{ cssClass, copyCssClassesToClipboard, removeClassPrefix }"
    title="Suggestion"
    :sections="sections"
  >
    <div
      :key="cssClass"
      @click="copyCssClassesToClipboard"
      :class="cssClass"
      aria-hidden="true"
      title="Click me to copy CSS classes"
    >
      🔎
      {{ removeClassPrefix(cssClass, base) }}
      suggestion
    </div>
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

    @Prop({
      default: () => ['x-suggestion-tag x-suggestion-md', 'x-suggestion-tag x-suggestion-lg']
    })
    public combinations!: string[];

    protected get sections(): ShowcaseSections {
      return {
        Default: [this.base],
        Colors: this.colors.map(addParentClasses(this.base)),
        Sizes: this.sizes.map(addParentClasses(this.base)),
        Tag: this.colors.map(addParentClasses(this.base, this.tag)),
        Combinations: this.combinations.map(addParentClasses(this.base))
      };
    }
  }
</script>
