<template>
  <XdsBaseShowcase #default="{ cssClass, removeClassPrefix }" title="Badge" :sections="sections">
    <span :class="cssClass">{{ removeClassPrefix(cssClass, base) || 'badge' }}</span>
  </XdsBaseShowcase>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { ShowcaseSections } from '../types/types';
  import { addParentClasses } from '../utils';
  import XdsBaseShowcase from './xds-base-showcase.vue';

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

    @Prop({
      default: () => [
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

    protected get sections(): ShowcaseSections {
      return {
        Default: [this.base],
        Sizes: this.sizes.map(addParentClasses(this.base)),
        Colors: this.colors.map(addParentClasses(this.base))
      };
    }
  }
</script>
