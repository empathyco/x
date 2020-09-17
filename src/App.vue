<template>
  <div id="app">
    <SearchInput :placeholder="$t('searchBox.placeholder')" />
    <ClearSearchInput>{{ $t('searchBox.clear') }}</ClearSearchInput>
    <SearchButton>&#128269;</SearchButton>
    <Empathize :animation="collapseFromTop">
      <BaseKeyboardNavigation>
        <h1>{{ $t('popularSearches.title') }}</h1>
        <PopularSearches :animation="suggestionsAnimation" />
        <h1>{{ $t('nextQueries.title') }}</h1>
        <NextQueries :animation="suggestionsAnimation" />
        <h1>{{ $t('querySuggestions.title') }}</h1>
        <QuerySuggestions :animation="suggestionsAnimation" />
        <h1>{{ $t('historyQueries.title') }}</h1>
        <HistoryQueries :animation="suggestionsAnimation">
          <template #suggestion="{ suggestion }">
            <HistoryQuery :suggestion="suggestion">
              <template #remove-button-content>
                <span
                  :aria-label="$t('historyQueries.removeLabel', { suggestion: suggestion.query })"
                >
                  &#215;
                </span>
              </template>
            </HistoryQuery>
          </template>
        </HistoryQueries>
        <ClearHistoryQueries>{{ $t('historyQueries.clear') }}</ClearHistoryQueries>
      </BaseKeyboardNavigation>
    </Empathize>
  </div>
</template>

<script lang="ts">
  import { BaseKeyboardNavigation, CollapseFromTop, FadeAndSlide } from '@empathy/x-components';
    import { Empathize } from '@empathy/x-components/empathize';
    import {
      ClearHistoryQueries,
      HistoryQueries,
      HistoryQuery
    } from '@empathy/x-components/history-queries';
    import { NextQueries } from '@empathy/x-components/next-queries';
    import { PopularSearches } from '@empathy/x-components/popular-searches';
    import { QuerySuggestions } from '@empathy/x-components/query-suggestions';
    import { ClearSearchInput, SearchButton, SearchInput } from '@empathy/x-components/search-box';
    import Vue from 'vue';
    import { Component } from 'vue-property-decorator';

    @Component({
      components: {
        BaseKeyboardNavigation,
        ClearHistoryQueries,
        ClearSearchInput,
        Empathize,
        HistoryQueries,
        HistoryQuery,
        NextQueries,
        PopularSearches,
        QuerySuggestions,
        SearchButton,
        SearchInput
      }
    })
    export default class App extends Vue {
      public suggestionsAnimation = FadeAndSlide;
      public collapseFromTop = CollapseFromTop;
    }
</script>

<style lang="scss">
  #x-components-app {
    text-align: center;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .x-empathize {
    background: #fff;
    border-radius: 2px;
    padding: 1rem;
    position: relative;
    width: 600px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);

    &__close {
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }
</style>
