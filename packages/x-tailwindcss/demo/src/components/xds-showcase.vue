<template>
  <div class="x-flex x-flex-col x-gap-40 x-p-20">
    <XdsButton />
    <XdsButtonGroup />
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
    <XdsFacetFilter />
    <XdsProgressBar />
  </div>
</template>
<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import XdsBadge from './xds-badge.vue';
  import XdsButton from './xds-button.vue';
  import XdsButtonGroup from './xds-button-group.vue';
  import XdsFacetFilter from './xds-facet-filter.vue';
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
  import XdsProgressBar from './xds-progress-bar.vue';

  @Component({
    components: {
      XdsBadge,
      XdsInputGroup,
      XdsTypography,
      XdsHighlight,
      XdsButton,
      XdsButtonGroup,
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
      XdsTag,
      XdsFacetFilter,
      XdsProgressBar
    }
  })
  export default class XdsShowcase extends Vue {}
</script>
<style lang="scss">
  .modal {
    pointer-events: none;
    visibility: hidden;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;
    overflow-y: auto;
  }
  .modal-toggle {
    position: fixed;
    height: 0;
    width: 0;
    -webkit-appearance: none;
    appearance: none;
    opacity: 0;
  }
  .modal-toggle:checked + .modal {
    pointer-events: auto;
    visibility: visible;
    opacity: 1;
  }
  html:has(.modal-toggle:checked) {
    overflow: hidden;
  }
</style>
