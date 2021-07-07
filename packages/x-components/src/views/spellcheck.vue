<template>
  <main>
    <!-- Search Box -->
    <div class="x-search-box x-input-group x-input-group--card">
      <SearchInput placeholder="Search" aria-label="Search for products" />
      <ClearSearchInput aria-label="Clear query">Clear</ClearSearchInput>
      <SearchButton class="x-input-group__action" aria-label="Search">
        <SearchIcon />
      </SearchButton>
    </div>

    <!-- Spellcheck -->
    <Spellcheck>
      <template #default="{ query }">
        No results found for '{{ query }}'. We show you results for
        <SpellcheckButton />
      </template>
    </Spellcheck>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { SearchIcon } from '../components/icons/index';
  import SpellcheckButton from '../x-modules/search/components/spellcheck-button.vue';
  import Spellcheck from '../x-modules/search/components/spellcheck.vue';
  import ClearSearchInput from '../x-modules/search-box/components/clear-search-input.vue';
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
      SearchIcon,
      Spellcheck,
      SpellcheckButton
    }
  })
  export default class SpellcheckApp extends Vue {}
</script>

<style lang="scss">
  .x-search-box {
    max-width: 400px;
  }
</style>
