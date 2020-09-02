<template>
  <main>
    <router-view />
  </main>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import CollapseFromTop from './components/animations/collapse-from-top.vue';
  import FadeAndSlide from './components/animations/fade-and-slide.vue';
  import BaseCloseButton from './components/base-close-button.vue';
  import BaseKeyboardNavigation from './components/base-keyboard-navigation.vue';
  import BaseModalContainer from './components/base-modal-container.vue';
  import BaseOpenButton from './components/base-open-button.vue';
  import BaseResultLink from './components/base-result-link.vue';
  import { getURLParameter } from './utils/get-url-parameters';
  import Empathize from './x-modules/empathize/components/empathize.vue';
  // eslint-disable-next-line max-len
  import ClearHistoryQueries from './x-modules/history-queries/components/clear-history-queries.vue';
  import HistoryQueries from './x-modules/history-queries/components/history-queries.vue';
  import IdentifierResult from './x-modules/identifier-results/components/identifier-result.vue';
  import IdentifierResults from './x-modules/identifier-results/components/identifier-results.vue';
  import NextQueries from './x-modules/next-queries/components/next-queries.vue';
  import NoSuggestions from './x-modules/no-suggestions/components/no-suggestions.vue';
  import PopularSearches from './x-modules/popular-searches/components/popular-searches.vue';
  import QuerySuggestion from './x-modules/query-suggestions/components/query-suggestion.vue';
  import QuerySuggestions from './x-modules/query-suggestions/components/query-suggestions.vue';
  import Recommendations from './x-modules/recommendations/components/recommendations.vue';
  import RelatedTags from './x-modules/related-tags/components/related-tags.vue';
  import ClearSearchInput from './x-modules/search-box/components/clear-search-input.vue';
  import SearchInput from './x-modules/search-box/components/search-input.vue';

  @Component({
    components: {
      BaseCloseButton,
      BaseKeyboardNavigation,
      BaseModalContainer,
      BaseOpenButton,
      BaseResultLink,
      ClearHistoryQueries,
      ClearSearchInput,
      Empathize,
      HistoryQueries,
      IdentifierResult,
      IdentifierResults,
      NextQueries,
      NoSuggestions,
      PopularSearches,
      QuerySuggestion,
      QuerySuggestions,
      Recommendations,
      RelatedTags,
      SearchInput
    }
  })
  export default class App extends Vue {
    protected showEmpathize = getURLParameter('showEmpathize') === 'true';
    protected loadOnInit = getURLParameter('loadOnInit') === 'true';
    protected fadeAndSlide = FadeAndSlide;
    protected collapseFromTop = CollapseFromTop;
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

  .x-modal-content {
    background-color: white;
    height: 200px;
    width: 100%;
  }

  .x-column {
    display: inline-flex;
    flex-direction: column;
    width: 30%;
  }

  .x-empathize {
    background-color: white;
    border: 1px dashed black;
    border-radius: 20px;
    z-index: 2;
    width: 600px;
    position: relative;

    &__close {
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }
</style>
