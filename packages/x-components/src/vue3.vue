<template>
  <SnippetConfigExtraParams :values="initialExtraParams" />
  <UrlHandler query="q" store="store" />
  <OpenMainModal>Start</OpenMainModal>
  <MainModal>
    <SearchInput />
    <ClearSearchInput />
    <SortPickerList :items="sortValues" #default="{ item }">
      {{ item || 'default' }}
    </SortPickerList>

    <Facets #default="{ facet }">
      <strong>{{ facet.label }}</strong>
      <span v-for="filter in facet.filters" style="font-size: 8px">{{ filter.label }}//</span>
    </Facets>

    <ResultsList>
      <BaseVariableColumnGrid :columns="12">
        <template #result="{ item: result }">
          <BaseResultImage :result="result" />
          <span>{{ result.name }}</span>
          <span>{{ result.price.value }}€</span>
        </template>
      </BaseVariableColumnGrid>
    </ResultsList>
  </MainModal>
</template>

<script setup lang="ts">
  import { useStore } from 'vuex';
  import BaseVariableColumnGrid from './components/base-variable-column-grid.vue';
  import MainModal from './components/modals/main-modal.vue';
  import OpenMainModal from './components/modals/open-main-modal.vue';
  import SnippetConfigExtraParams from './x-modules/extra-params/components/snippet-config-extra-params.vue';
  import Facets from './x-modules/facets/components/facets/facets.vue';
  import ClearSearchInput from './x-modules/search-box/components/clear-search-input.vue';
  import SearchInput from './x-modules/search-box/components/search-input.vue';
  import ResultsList from './x-modules/search/components/results-list.vue';
  import BaseResultImage from './components/result/base-result-image.vue';
  import SortPickerList from './x-modules/search/components/sort-picker-list.vue';
  import UrlHandler from './x-modules/url/components/url-handler.vue';

  const initialExtraParams = { store: 'Portugal' };
  const sortValues = ['', 'price asc', 'price desc'];

  const store = useStore();
  store.commit('x/increment');
</script>

<style>
  ul {
    padding: 0;
  }
</style>
