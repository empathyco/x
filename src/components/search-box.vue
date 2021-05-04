<template>
  <div class="x-search-box">
    <SearchButton>&#128269;</SearchButton>
    <SearchInput :placeholder="$t('searchBox.placeholder')" />
    <ClearSearchInput>{{ $t('searchBox.clear') }}</ClearSearchInput>
  </div>
</template>

<script lang="ts">
  import { ClearSearchInput, SearchButton, SearchInput } from '@empathy/x-components/search-box';
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';

  @Component({
    components: {
      ClearSearchInput,
      SearchButton,
      SearchInput
    }
  })
  export default class SearchBox extends Vue {}
</script>
