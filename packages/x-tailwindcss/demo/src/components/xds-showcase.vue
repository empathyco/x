<template>
  <div class="x-flex x-flex-col x-gap-40 x-p-20">
    <XdsButton />
    <XdsIcon />
    <XdsSuggestion />
    <XdsHighlight />
    <XdsTypography
      v-for="(type, index) in typography"
      :key="index"
      :base="type.base"
      :sizes="type.sizes"
    />
  </div>
</template>
<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import XdsButton from './xds-button.vue';
  import XdsHighlight from './xds-highlight.vue';
  import XdsIcon from './xds-icon.vue';
  import XdsSuggestion from './xds-suggestion.vue';
  import XdsTypography from './xds-typography.vue';

  @Component({
    components: { XdsTypography, XdsHighlight, XdsButton, XdsIcon, XdsSuggestion }
  })
  export default class XdsShowcase extends Vue {
    protected get typography(): Record<string, Record<'base' | 'sizes', string | string[]>> {
      return {
        'x-text1': {
          base: 'x-text1',
          sizes: ['x-text1-sm', 'x-text1-md', 'x-text1-lg']
        },
        'x-text2': {
          base: 'x-text2',
          sizes: ['x-text2-sm', 'x-text2-md', 'x-text2-lg']
        },
        'x-title1': {
          base: 'x-title1',
          sizes: ['x-title1-sm', 'x-title1-md', 'x-title1-lg']
        },
        'x-title2': {
          base: 'x-title2',
          sizes: ['x-title2-sm', 'x-title2-md', 'x-title2-lg']
        },
        'x-title3': {
          base: 'x-title3',
          sizes: ['x-title3-sm', 'x-title3-md', 'x-title3-lg']
        }
      };
    }
  }
</script>
