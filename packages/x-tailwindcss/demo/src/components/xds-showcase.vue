<template>
  <div class="x-flex x-flex-col x-gap-40 x-p-20">
    <XdsButton />
    <XdsIcon />
    <XdsHighlight />
    <XdsTypography />
    <XdsInput />
    <XdsInputGroup />
    <XdsSuggestion />
    <XdsSuggestionGroup />
    <XdsSlidingPanel />
    <XdsPicture />
    <XdsScroll />
    <XdsLayout />
    <XdsLayoutUtils />
    <XdsLayoutFixedHeader />
    <XdsLayoutSingleColumn />
    <XdsLayoutTwoColumns />
    <XdsTag />
    <XdsBadge />
  </div>
</template>
<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import XdsBadge from './xds-badge.vue';
  import XdsButton from './xds-button.vue';
  import XdsHighlight from './xds-highlight.vue';
  import XdsIcon from './xds-icon.vue';
  import XdsInputGroup from './xds-input-group.vue';
  import XdsSuggestion from './xds-suggestion.vue';
  import XdsTypography from './xds-typography.vue';
  import XdsInput from './xds-input.vue';
  import XdsSuggestionGroup from './xds-suggestion-group.vue';
  import XdsSlidingPanel from './xds-sliding-panel.vue';
  import XdsPicture from './xds-picture.vue';
  import XdsScroll from './xds-scroll.vue';
  import XdsLayout from './xds-layout.vue';
  import XdsLayoutUtils from './xds-layout-utils.vue';
  import XdsLayoutFixedHeader from './xds-layout-fixed-header.vue';
  import XdsLayoutSingleColumn from './xds-layout-single-column.vue';
  import XdsLayoutTwoColumns from './xds-layout-two-columns.vue';
  import XdsTag from './xds-tag.vue';

  @Component({
    components: {
      XdsBadge,
      XdsInputGroup,
      XdsTypography,
      XdsHighlight,
      XdsButton,
      XdsIcon,
      XdsInput,
      XdsLayout,
      XdsScroll,
      XdsLayoutFixedHeader,
      XdsLayoutSingleColumn,
      XdsLayoutTwoColumns,
      XdsSuggestion,
      XdsSuggestionGroup,
      XdsSlidingPanel,
      XdsPicture,
      XdsLayoutUtils,
      XdsTag
    }
  })
  export default class XdsShowcase extends Vue {}
</script>
