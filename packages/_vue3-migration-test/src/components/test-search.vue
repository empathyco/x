<template>
  <SnippetConfigExtraParams />
  <SearchInput />
  <ClearSearchInput />
  <SearchButton />
  <!--  No Results Message  -->
  <div
    v-if="_$x.noResults && !_$x.fromNoResultsWithFilters"
    class="x-p-28 x-flex x-flex-col x-gap-8 x-items-center x-bg-lead-25 x-my-8"
    data-test="no-results-message"
  >
    <p>
      There are no results for
      <span class="x-font-bold">{{ _$x.query.search }}</span>
    </p>
  </div>
  <ResultsList>
    <BaseVariableColumnGrid
      style="--x-size-min-width-grid-item: 150px"
      class="x-gap-12"
      :columns="4"
    >
      <template #result="{ item: result }">
        <BaseResultLink :result="result">
          <h1 class="x-text1 x-text1-lg">{{ result.name }}</h1>
        </BaseResultLink>
      </template>
    </BaseVariableColumnGrid>
  </ResultsList>
</template>

<script setup lang="ts">
  import SnippetConfigExtraParams from '../../../x-components/src/x-modules/extra-params/components/snippet-config-extra-params.vue';
  import SearchInput from '../../../x-components/src/x-modules/search-box/components/search-input.vue';
  import ResultsList from '../../../x-components/src/x-modules/search/components/results-list.vue';
  import BaseResultLink from '../../../x-components/src/components/result/base-result-link.vue';
  import BaseVariableColumnGrid from '../../../x-components/src/components/base-variable-column-grid.vue';
  import ClearSearchInput from '../../../x-components/src/x-modules/search-box/components/clear-search-input.vue';
  import SearchButton from '../../../x-components/src/x-modules/search-box/components/search-button.vue';
  import { use$x } from '../../../x-components/src/composables/use-$x';
  // TODO `$x` name cannot be used while XPlugin defines its own `this.$x` in the mixin
  const _$x = use$x();
</script>

<style lang="scss" scoped></style>
