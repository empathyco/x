<template>
  <main>
    <!-- Search Section -->
    <SearchInput placeholder="Search" aria-label="Search for products" />
    <ClearSearchInput aria-label="Clear query">Clear</ClearSearchInput>
    <SearchButton aria-label="Search"></SearchButton>
    <!--  <SortDropdown />
      <SortList /> -->
    <!-- Results -->
    <ul>
      <h1>Results</h1>
      <ResultsList v-slot="{ result }">
        {{ result.name }}
      </ResultsList>
    </ul>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import ClearSearchInput from '../x-modules/search-box/components/clear-search-input.vue';
  import ResultsList from '../x-modules/search/components/results-list.vue';
  import SearchButton from '../x-modules/search-box/components/search-button.vue';
  import SearchInput from '../x-modules/search-box/components/search-input.vue';
  import { searchXModule } from '../x-modules/search/x-module';
  import { XInstaller } from '../x-installer/x-installer';
  import { XPlugin } from '../plugins/x-plugin';
  import { baseInstallXOptions, baseSnippetConfig } from './base-config';

  @Component({
    beforeRouteEnter(_to, _from, next: () => void): void {
      XPlugin.registerXModule(searchXModule);
      new XInstaller(baseInstallXOptions).init(baseSnippetConfig);
      next();
    },
    components: {
      ClearSearchInput,
      SearchButton,
      SearchInput,
      ResultsList
    }
  })
  export default class App extends Vue {}
</script>
