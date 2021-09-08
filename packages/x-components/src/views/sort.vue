<template>
  <main>
    <!-- Search Section -->
    <SearchInput placeholder="Search" aria-label="Search for products" />
    <ClearSearchInput aria-label="Clear query">Clear</ClearSearchInput>
    <SearchButton aria-label="Search"><SearchIcon /></SearchButton>
    <!-- Sort -->
    <h1>SortDropdown</h1>
    <SortDropdown :items="sortValues">
      <template #toggle="{ item, isOpen }">
        <span>{{ item || 'Default' }}</span>
        <ChevronUpIcon v-if="isOpen" />
        <ChevronDownIcon v-else />
      </template>
      <template #item="{ item, isHighlighted, isSelected }">
        <span v-if="isSelected"><CheckIcon /></span>
        {{ item || 'Default' }}
      </template>
    </SortDropdown>
    <h1>SortList</h1>
    <SortList :items="sortValues">
      <template #default="{ item, isSelected }">
        <span v-if="isSelected"><CheckIcon /></span>
        {{ item || 'Default' }}
      </template>
    </SortList>
    <!-- Results -->
    <h1>Results</h1>
    <ResultsList #default="{ items, animation }" :animation="staggeredFadeAndSlide">
      <BaseGrid :animation="animation" :items="items" :columns="currentColumn">
        <template #Result="{ item }">
          <BaseResultLink :result="item">
            <template #default="{ result }">
              <span data-test="result-price">{{ result.price.value }}</span>
              <BaseResultImage :result="result" />
              <span>{{ result.name }}</span>
            </template>
          </BaseResultLink>
        </template>
      </BaseGrid>
    </ResultsList>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { Result, Sort } from '@empathyco/x-types';
  import { getBannersStub } from '../__stubs__/banners-stubs.factory';
  import { getPromotedsStub } from '../__stubs__/promoteds-stubs.factory';
  import BaseGrid from '../components/base-grid.vue';
  import { CheckIcon, ChevronDownIcon, ChevronUpIcon, SearchIcon } from '../components/icons/index';
  import BaseResultLink from '../components/result/base-result-link.vue';
  import BaseResultImage from '../components/result/base-result-image.vue';
  import { ListItem } from '../utils/types';
  import SortDropdown from '../x-modules/search/components/sort-dropdown.vue';
  import SortList from '../x-modules/search/components/sort-list.vue';
  import ClearSearchInput from '../x-modules/search-box/components/clear-search-input.vue';
  import SearchButton from '../x-modules/search-box/components/search-button.vue';
  import SearchInput from '../x-modules/search-box/components/search-input.vue';
  import StaggeredFadeAndSlide from '../components/animations/staggered-fade-and-slide.vue';
  import { State } from '../components/decorators/store.decorators';
  import ResultsList from '../x-modules/search/components/results-list.vue';
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
      CheckIcon,
      ChevronDownIcon,
      ChevronUpIcon,
      ResultsList,
      BaseGrid,
      BaseResultLink,
      BaseResultImage,
      ClearSearchInput,
      SearchButton,
      SearchIcon,
      SearchInput,
      SortDropdown,
      SortList
    }
  })
  export default class SortView extends Vue {
    protected staggeredFadeAndSlide = StaggeredFadeAndSlide;
    protected currentColumn = 4;

    @State('search', 'results')
    public results!: Result[];

    protected get gridItems(): ListItem[] {
      return [...getBannersStub(), ...getPromotedsStub(), ...this.results];
    }

    public sortValues: Sort[] = ['', 'priceSort asc', 'priceSort desc'];
  }
</script>

<style lang="scss">
  .x-column {
    display: inline-flex;
    flex-direction: column;
    width: 30%;
  }

  .x-base-grid {
    column-gap: 10px;
    row-gap: 10px;

    &__item {
      padding: 20px 0;
      text-align: center;
      border: 1px solid black;
      border-radius: 5px;
    }
  }
</style>
