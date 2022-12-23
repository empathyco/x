<template>
  <div class="x-flex x-flex-col x-gap-40 x-p-20">
    <XdsButton />
    <XdsIcon />
    <XdsSuggestion />
    <XdsHighlight />
    <XdsTypography />
    <XdsInput />
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
  import XdsInput from './xds-input.vue';

  @Component({
    components: { XdsTypography, XdsHighlight, XdsButton, XdsIcon, XdsSuggestion, XdsInput }
  })
  export default class XdsShowcase extends Vue {}
</script>
