<template>
  <div id="app">
    <SearchInput :placeholder="$t('searchBox.placeholder')" />
    <ClearSearchInput>{{ $t('searchBox.clear') }}</ClearSearchInput>
    <SearchButton>&#128269;</SearchButton>
    <Transition appear duration="400" name="collapse">
      <Empathize
        :eventsToCloseEmpathize="empathizeEventsToCloseEmpathize"
        :eventsToOpenEmpathize="empathizeEventsToOpenEmpathize"
      >
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
    </Transition>
  </div>
</template>

<script lang="ts">
  import { BaseKeyboardNavigation, FadeAndSlide } from '@empathy/x-components';
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
    protected empathizeEventsToCloseEmpathize = [
      'UserClosedEmpathize',
      'UserSelectedASuggestion',
      'UserPressedEnterKey'
    ];
    protected empathizeEventsToOpenEmpathize = ['UserFocusedSearchBox'];
  }
</script>

<style lang="scss">
  #app {
    text-align: center;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .x-empathize {
    border: solid 1px lightgrey;
  }

  .collapse {
    &-enter,
    &-leave-to {
      transform: scaleY(0);

      > * {
        opacity: 0;
      }
    }

    &-enter-active,
    &-leave-active {
      transition: transform 0.2s ease-out;
      transform-origin: top center;

      > * {
        transition: opacity 0.2s ease-out 0.2s;
      }
    }
  }
</style>
