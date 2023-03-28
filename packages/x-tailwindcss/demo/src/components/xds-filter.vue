<template>
  <XdsBaseShowcase
    #default="{ cssClass, copyCssClassesToClipboard, section }"
    title="Filter"
    :sections="sections"
  >
    <button
      @click="copyCssClassesToClipboard"
      :class="cssClass"
      :style="section === 'Default' ? { width: '120px' } : ''"
    >
      <CheckIcon class="x-icon" :class="{ 'x-icon-lg': cssClass.includes('x-filter-lg') }" />
      <template v-if="section === 'Default'">
        very long default filter to test line wrap alignment
      </template>
      <template v-else>Filter</template>
    </button>
  </XdsBaseShowcase>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { ShowcaseSections } from '../types/types';
  import { addParentClasses } from '../utils';
  import XdsBaseShowcase from './xds-base-showcase.vue';
  import CheckIcon from './icons/check.vue';

  @Component({
    components: { CheckIcon, XdsBaseShowcase }
  })
  export default class XdsFilterShowcase extends Vue {
    @Prop({ default: () => 'x-filter' })
    public base!: string;

    @Prop({ default: () => ['x-filter-sm', 'x-filter-md', 'x-filter-lg'] })
    public sizes!: string[];

    @Prop({ default: () => 'x-selected' })
    public selected!: string;

    @Prop({
      default: () => [
        '',
        'x-filter-neutral',
        'x-filter-lead',
        'x-filter-auxiliary',
        'x-filter-accent',
        'x-filter-highlight',
        'x-filter-success',
        'x-filter-warning',
        'x-filter-error'
      ]
    })
    public colors!: string[];

    protected get sections(): ShowcaseSections {
      return {
        Default: [this.base],
        Colors: this.colors.map(addParentClasses(this.base)),
        Sizes: this.sizes.map(addParentClasses(this.base)),
        Selected: this.colors.map(addParentClasses(this.base, this.selected))
      };
    }
  }
</script>
