<template>
  <main>
    <OpenButton>Open search</OpenButton>
    <BaseModalContainer>
      <div class="modal-content">
        <CloseButton aria-label="Close search">x</CloseButton>
      </div>
    </BaseModalContainer>
    <SearchInput placeholder="Search" aria-label="Search for products" />
    <ClearSearchInput aria-label="Clear query">Clear</ClearSearchInput>
    <NoSuggestions message="We couldn't find any suggestion. Try searching for {query}." />
    <KeyboardNavigation>
      <div class="inline-flex">
        <h1>Query Suggestions</h1>
        <QuerySuggestions :animation="fadeAndSlide">
          <template #suggestion="{suggestion}">
            <QuerySuggestion
              :suggestion="suggestion"
              :aria-label="`Query suggestion: ${suggestion.query}`"
            />
          </template>
        </QuerySuggestions>
      </div>
      <div class="inline-flex">
        <h1>History</h1>
        <HistoryQueries :animation="fadeAndSlide">
          <template #suggestion-remove-content="{suggestion}">
            <span :aria-label="`Remove ${suggestion.query} from history`">x</span>
          </template>
        </HistoryQueries>
        <ClearHistoryQueries>Clear previous searches</ClearHistoryQueries>
      </div>
      <div class="inline-flex">
        <h1>Popular Searches</h1>
        <PopularSearches :animation="fadeAndSlide" />
      </div>
      <div class="inline-flex">
        <h1>Next Queries</h1>
        <NextQueries :animation="fadeAndSlide" :loadOnInit="loadOnInit" />
      </div>
      <div class="inline-flex">
        <h1>Related tags</h1>
        <RelatedTags :animation="fadeAndSlide" />
      </div>
    </KeyboardNavigation>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import BaseModalContainer from './components/base-modal-container.vue';
  import CloseButton from './components/close-button.vue';
  import OpenButton from './components/open-button.vue';
  import FadeAndSlide from './components/animations/fade-and-slide.vue';
  import { getURLParameter } from './utils/get-url-parameters';
  import KeyboardNavigation from './x-modules/empathize/components/keyboard-navigation.vue';
  // eslint-disable-next-line max-len
  import ClearHistoryQueries from './x-modules/history-queries/components/clear-history-queries.vue';
  import HistoryQueries from './x-modules/history-queries/components/history-queries.vue';
  import NextQueries from './x-modules/next-queries/components/next-queries.vue';
  import NoSuggestions from './x-modules/no-suggestions/components/no-suggestions.vue';
  import PopularSearches from './x-modules/popular-searches/components/popular-searches.vue';
  import QuerySuggestion from "./x-modules/query-suggestions/components/query-suggestion.vue";
  import QuerySuggestions from './x-modules/query-suggestions/components/query-suggestions.vue';
  import RelatedTags from './x-modules/related-tags/components/related-tags.vue';
  import ClearSearchInput from './x-modules/search-box/components/clear-search-input.vue';
  import SearchInput from './x-modules/search-box/components/search-input.vue';

  @Component({
    components: {
      QuerySuggestion,
      BaseModalContainer,
      ClearHistoryQueries,
      NoSuggestions,
      ClearSearchInput,
      CloseButton,
      HistoryQueries,
      KeyboardNavigation,
      NextQueries,
      OpenButton,
      PopularSearches,
      QuerySuggestions,
      RelatedTags,
      SearchInput
    }
  })
  export default class App extends Vue {
    protected loadOnInit = getURLParameter('loadOnInit') === 'true';
    // eslint-disable-next-line
    private fadeAndSlide = FadeAndSlide;
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

  .modal-content {
    background-color: white;
    height: 200px;
    width: 100%;
  }

  .inline-flex {
    display: inline-flex;
    flex-direction: column;
    width: 30%;
  }
</style>
