<template>
  <main>
    <!-- Search Section -->
    <div>
      <SearchInput placeholder="Search" aria-label="Search for products" />
      <ClearSearchInput aria-label="Clear query">Clear</ClearSearchInput>
    </div>
    <!-- Related Tags -->
    <div class="x-column">
      <h1>Related tags</h1>
      <RelatedTags />
    </div>
    <!-- Testing purpose -->
    <h1>Results</h1>
    <div v-if="$x.status.search === 'loading'" data-test="loading">Loading...</div>
    <ul>
      <li v-for="result in results" :key="result.id" data-test="result-item">
        {{ result.name }}
      </li>
    </ul>
  </main>
</template>

<script lang="ts">
  import { Result } from '@empathy/search-types';
  import { deepMerge } from '@empathybroker/deep-merge';
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { State } from '../components/decorators/store.decorators';
  import { XPlugin } from '../plugins/x-plugin';
  import { XInstaller } from '../x-installer/x-installer';
  import RelatedTags from '../x-modules/related-tags/components/related-tags.vue';
  import ClearSearchInput from '../x-modules/search-box/components/clear-search-input.vue';
  import SearchInput from '../x-modules/search-box/components/search-input.vue';
  import { searchXModule } from '../x-modules/search/x-module';
  import { baseInstallXOptions, baseSnippetConfig } from './base-config';

  @Component({
    beforeRouteEnter(to, _from, next: () => void): void {
      XPlugin.registerXModule(searchXModule);
      let customQueryConfig = JSON.parse(to.query.xModules?.toString() ?? '{}');
      const configRelatedTagsView = deepMerge(baseInstallXOptions, {
        xModules: deepMerge(customQueryConfig)
      });
      new XInstaller(configRelatedTagsView).init(baseSnippetConfig);
      next();
    },
    components: {
      ClearSearchInput,
      RelatedTags,
      SearchInput
    }
  })
  export default class RelatedTagsView extends Vue {
    /* Testing purpose */
    @State('search', 'results')
    public results!: Result[];
  }
</script>

<style lang="scss">
  .x-column {
    display: inline-flex;
    flex-direction: column;
    width: 30%;
  }
</style>
