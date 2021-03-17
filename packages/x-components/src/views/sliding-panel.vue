<template>
  <main>
    <!-- Search Section -->
    <SearchInput placeholder="Search" aria-label="Search for products" />
    <ClearSearchInput aria-label="Clear query">Clear</ClearSearchInput>
    <SearchButton aria-label="Search"></SearchButton>
    <SlidingPanel>
      <RelatedTags :animation="staggeredFadeAndSlide" />
    </SlidingPanel>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import ClearSearchInput from '../x-modules/search-box/components/clear-search-input.vue';
  import RelatedTags from '../x-modules/related-tags/components/related-tags.vue';
  import SearchButton from '../x-modules/search-box/components/search-button.vue';
  import SearchInput from '../x-modules/search-box/components/search-input.vue';
  import SlidingPanel from '../components/sliding-panel.vue';
  import StaggeredFadeAndSlide from '../components/animations/staggered-fade-and-slide.vue';
  import { XInstaller } from '../x-installer/x-installer';
  import { baseInstallXOptions, baseSnippetConfig } from './base-config';

  @Component({
    beforeRouteEnter(_to, _from, next: () => void): void {
      new XInstaller(baseInstallXOptions).init(baseSnippetConfig);
      next();
    },
    components: {
      ClearSearchInput,
      RelatedTags,
      SearchButton,
      SearchInput,
      SlidingPanel
    }
  })
  export default class App extends Vue {
    protected staggeredFadeAndSlide = StaggeredFadeAndSlide;
  }
</script>

<style lang="scss">
  .x-sliding-panel {
    max-width: 200px;

    &__scroll {
      white-space: nowrap;

      > ul {
        padding: 0;

        & > li {
          display: inline-block;
          text-decoration: none;
        }
      }
    }
  }
</style>
