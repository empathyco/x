<template>
  <main>
    <!-- Search Section -->
    <SearchInput placeholder="Search" aria-label="Search for products" />
    <ClearSearchInput aria-label="Clear query">Clear</ClearSearchInput>
    <SearchButton aria-label="Search"><SearchIcon /></SearchButton>
    <!-- BaseColumnPickerList -->
    <h1>Column Picker</h1>
    <h2>Column Picker List</h2>
    <div class="column-picker-container">
      <BaseColumnPickerList #default="{ column }" v-model="currentColumn" :columns="[2, 4, 6]">
        <span>{{ column }}⇋</span>
      </BaseColumnPickerList>
    </div>
    <!-- BaseColumnPickerDropdown -->
    <h2>Column Picker Dropdown</h2>
    <div class="column-picker-container">
      <BaseColumnPickerDropdown v-model="currentColumn" :columns="[2, 4, 6]">
        <template #item="{ item }">
          <span>{{ item }}</span>
        </template>
      </BaseColumnPickerDropdown>
    </div>
    <!-- Recommendations -->
    <h1>Recommendations</h1>
    <BaseGrid :animation="staggeredFadeAndSlide" :items="recommendations" :columns="currentColumn">
      <template #Result="{ item }">
        <BaseResultLink :result="item" class="x-result-link">
          <BaseResultImage :result="item" />
          <span class="x-result__title">{{ item.name }}</span>
        </BaseResultLink>
      </template>
    </BaseGrid>
    <!-- Results -->
    <h1>Results</h1>
    <ResultsList :animation="staggeredFadeAndSlide">
      <template #layout="{ results, animation }">
        <BaseGrid :animation="animation" :items="results" :columns="currentColumn">
          <template #Result="{ item }">
            <BaseResultLink :result="item">
              <template #default="{ result }">
                <BaseResultImage :result="result" />
                <span>{{ result.name }}</span>
              </template>
            </BaseResultLink>
          </template>
        </BaseGrid>
      </template>
    </ResultsList>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { Result } from '@empathy/search-types';
  // eslint-disable-next-line max-len
  import BaseColumnPickerDropdown from '../components/column-picker/base-column-picker-dropdown.vue';
  import BaseColumnPickerList from '../components/column-picker/base-column-picker-list.vue';
  import BaseGrid from '../components/base-grid.vue';
  import { SearchIcon } from '../components/icons/index';
  import BaseResultLink from '../components/result/base-result-link.vue';
  import BaseResultImage from '../components/result/base-result-image.vue';
  import ClearSearchInput from '../x-modules/search-box/components/clear-search-input.vue';
  import Recommendations from '../x-modules/recommendations/components/recommendations.vue';
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
      ResultsList,
      BaseColumnPickerList,
      BaseColumnPickerDropdown,
      BaseGrid,
      BaseResultLink,
      BaseResultImage,
      ClearSearchInput,
      Recommendations,
      SearchButton,
      SearchIcon,
      SearchInput
    }
  })
  export default class BaseColumnPicker extends Vue {
    protected staggeredFadeAndSlide = StaggeredFadeAndSlide;
    protected currentColumn = 4;

    @State('recommendations', 'recommendations')
    public recommendations!: Result[];
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

  .x-base-grid {
    column-gap: 10px;
    row-gap: 10px;

    &__item {
      padding: 20px 0;
      text-align: center;
      border: 1px solid black;
      border-radius: 5px;
    }

    &__banner {
      grid-column: -1/1;
      border-color: crimson;
    }

    &__promoted {
      grid-column: 1 / span 2;
      border-color: darkgreen;
    }
  }
</style>
