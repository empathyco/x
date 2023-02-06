<template>
  <div class="x-flex x-flex-col x-gap-40 x-p-20">
    <XdsButton />
    <XdsIcon />
    <XdsHighlight />
    <XdsTypography />
    <XdsInput />
    <XdsSuggestion />
    <XdsSuggestionGroup />
    <XdsSlidingPanel />
    <XdsPicture />
    <XdsScroll />
    <XdsLayout />
    <XdsLayoutTwoColumns />
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
  import XdsSuggestionGroup from './xds-suggestion-group.vue';
  import XdsSlidingPanel from './xds-sliding-panel.vue';
  import XdsPicture from './xds-picture.vue';
  import XdsLayout from './xds-layout.vue';
  import XdsScroll from './xds-scroll.vue';
  import XdsLayoutTwoColumns from './xds-layout-two-columns.vue';

  @Component({
    components: {
      XdsTypography,
      XdsHighlight,
      XdsButton,
      XdsIcon,
      XdsInput,
      XdsLayout,
      XdsScroll,
      XdsLayoutTwoColumns,
      XdsSuggestion,
      XdsSuggestionGroup,
      XdsSlidingPanel,
      XdsPicture
    }
  })
  export default class XdsShowcase extends Vue {}
</script>
