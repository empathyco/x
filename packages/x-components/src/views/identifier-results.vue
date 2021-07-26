<template>
  <main class="x-list x-list--vertical x-list--gap-06">
    <!-- Search Box -->
    <div class="x-search-box x-input-group x-input-group--card">
      <SearchInput placeholder="Search" aria-label="Search for products" />
      <ClearSearchInput aria-label="Clear query">Clear</ClearSearchInput>
      <SearchButton class="x-input-group__action" aria-label="Search">
        <SearchIcon />
      </SearchButton>
    </div>
    <!-- Identifier Results -->
    <h1 v-if="$x.identifierResults.length" class="x-title1">Identifier Results</h1>
    <BaseGrid :animation="staggeredFadeAndSlide" :items="identifierResults" :columns="1">
      <template #Result="{ item }">
        <BaseResultLink :result="item" class="x-result-link">
          <template #default="{ result }">
            <IdentifierResult :result="result" data-test="identifier-results-item" />
          </template>
        </BaseResultLink>
      </template>
    </BaseGrid>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { Result } from '@empathyco/x-types';
  import BaseGrid from '../components/base-grid.vue';
  import { SearchIcon } from '../components/icons/index';
  import BaseResultLink from '../components/result/base-result-link.vue';
  import ClearSearchInput from '../x-modules/search-box/components/clear-search-input.vue';
  import IdentifierResult from '../x-modules/identifier-results/components/identifier-result.vue';
  import IdentifierResults from '../x-modules/identifier-results/components/identifier-results.vue';
  import SearchButton from '../x-modules/search-box/components/search-button.vue';
  import SearchInput from '../x-modules/search-box/components/search-input.vue';
  import StaggeredFadeAndSlide from '../components/animations/staggered-fade-and-slide.vue';
  import { State } from '../components/decorators/store.decorators';
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
      BaseGrid,
      BaseResultLink,
      ClearSearchInput,
      IdentifierResult,
      IdentifierResults,
      SearchButton,
      SearchInput,
      SearchIcon
    }
  })
  export default class IdResults extends Vue {
    protected staggeredFadeAndSlide = StaggeredFadeAndSlide;

    @State('identifierResults', 'identifierResults')
    public identifierResults!: Result[];
  }
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    margin-top: 60px;
    text-align: center;
    color: #2c3e50;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  :root {
    --x-size-gap-grid: 12px;
  }

  .x-search-box {
    max-width: 400px;
  }
</style>
