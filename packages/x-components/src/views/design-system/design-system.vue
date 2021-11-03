<template>
  <main class="x-design-system">
    <DesignSystemTypography />

    <DesignSystemIcon />

    <DesignSystemButton />

    <DesignSystemInput />

    <DesignSystemInputGroup />

    <DesignSystemFilter />

    <DesignSystemFacet />

    <DesignSystemSuggestion />

    <DesignSystemSuggestionGroup />

    <DesignSystemTag />

    <DesignSystemDropdown />

    <DesignSystemOptionList />

    <DesignSystemSlidingPanel />

    <DesignSystemList />

    <DesignSystemRow />

    <DesignSystemRowItem />

    <DesignSystemPicture />

    <DesignSystemResult />

    <DesignSystemBadge />

    <DesignSystemProgressBar />

    <DesignSystemMessage />

    <DesignSystemUtilities />

    <button @click="toggleTokens" class="info x-button x-button--tertiary x-button--round">
      i
    </button>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import DesignSystemBadge from './design-system-badge.vue';
  import DesignSystemButton from './design-system-button.vue';
  import DesignSystemDropdown from './design-system-dropdown.vue';
  import DesignSystemFacet from './design-system-facet.vue';
  import DesignSystemFilter from './design-system-filter.vue';
  import DesignSystemIcon from './design-system-icon.vue';
  import DesignSystemInputGroup from './design-system-input-group.vue';
  import DesignSystemInput from './design-system-input.vue';
  import DesignSystemList from './design-system-list.vue';
  import DesignSystemMessage from './design-system-message.vue';
  import DesignSystemOptionList from './design-system-option-list.vue';
  import DesignSystemPicture from './design-system-picture.vue';
  import DesignSystemProgressBar from './design-system-progress-bar.vue';
  import DesignSystemResult from './design-system-result.vue';
  import DesignSystemRowItem from './design-system-row-item.vue';
  import DesignSystemRow from './design-system-row.vue';
  import DesignSystemSlidingPanel from './design-system-sliding-panel.vue';
  import DesignSystemSuggestionGroup from './design-system-suggestion-group.vue';
  import DesignSystemSuggestion from './design-system-suggestion.vue';
  import DesignSystemTag from './design-system-tag.vue';
  import DesignSystemTypography from './design-system-typography.vue';
  import DesignSystemUtilities from './design-system-utilities.vue';

  @Component({
    components: {
      DesignSystemBadge,
      DesignSystemButton,
      DesignSystemDropdown,
      DesignSystemFacet,
      DesignSystemFilter,
      DesignSystemIcon,
      DesignSystemInput,
      DesignSystemInputGroup,
      DesignSystemList,
      DesignSystemMessage,
      DesignSystemOptionList,
      DesignSystemPicture,
      DesignSystemProgressBar,
      DesignSystemResult,
      DesignSystemRowItem,
      DesignSystemRow,
      DesignSystemSlidingPanel,
      DesignSystemSuggestion,
      DesignSystemSuggestionGroup,
      DesignSystemTag,
      DesignSystemTypography,
      DesignSystemUtilities
    }
  })
  export default class DesignSystem extends Vue {
    protected toggleTokens(): void {
      document.head.classList.toggle('show-tokens');
    }

    protected mounted(): void {
      Array.from(document.querySelectorAll<HTMLStyleElement>(`head style[type='text/css']`))
        .filter(element => element.innerText.startsWith(':root'))
        .forEach(element => element.setAttribute('contenteditable', 'true'));
    }
  }
</script>

<style lang="scss">
  .x-design-system {
    * {
      outline: none;
    }

    .x-title1,
    .x-title2 {
      width: 100%;
      margin: var(--x-size-base-04) 0 var(--x-size-base-02);
    }
  }
</style>

<style lang="scss" scoped>
  .info {
    position: fixed;
    right: var(--x-size-base-06);
    bottom: var(--x-size-base-04);
  }

  head {
    background: lightgoldenrodyellow;
    position: fixed;
    padding: var(--x-size-base-04) var(--x-size-base-09);
    bottom: var(--x-size-base-10);
    right: 0;
    height: 80%;
    overflow: auto;
    z-index: 10;

    &:before {
      font-family: var(--x-font-family);
      content: 'You can edit here the Design Tokens';
      display: block;
      font-size: var(--x-size-font-xl);
      padding-bottom: 10px;
    }

    style {
      white-space: pre;
      font-family: monospace;
      margin-block: var(--x-size-base-04);
    }
  }

  .show-tokens {
    display: block;

    [contenteditable='true'] {
      display: block;
    }
  }
</style>
