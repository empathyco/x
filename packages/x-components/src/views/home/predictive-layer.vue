<template>
  <BaseKeyboardNavigation>
    <Empathize :animation="empathizeAnimation">
      <div
        class="x-list x-list--horizontal x-list--padding-05 x-list--padding-bottom x-list--gap-06"
      >
        <PopularSearches max-items-to-render="10" />
        <HistoryQueries :max-items-to-render="controls.historyQueries.maxItemsToRender" />
        <ClearHistoryQueries class="x-button--ghost x-button--ghost-start">
          <CrossTinyIcon />
          <span>Clear previous searches</span>
        </ClearHistoryQueries>
        <QuerySuggestions max-items-to-render="10">
          <template #suggestion-content="{ suggestion, filter }">
            <span>{{ suggestion.query }}</span>
            <template v-if="filter">
              <span>|</span>
              <span>{{ filter.label }}</span>
            </template>
          </template>
        </QuerySuggestions>
        <NextQueries max-items-to-render="10" />

        <!-- IdentifierResults -->
        <IdentifierResults #default="{ identifierResult }">
          <BaseResultLink :result="identifierResult">
            <article class="x-suggestion">
              <IdentifierResult :result="identifierResult" />
              <span class="x-ellipsis" data-test="result-text">
                {{ identifierResult.name }}
              </span>
            </article>
          </BaseResultLink>
        </IdentifierResults>
      </div>
    </Empathize>
  </BaseKeyboardNavigation>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { animateScale } from '../../components/animations/animate-scale/animate-scale.factory';
  import BaseKeyboardNavigation from '../../components/base-keyboard-navigation.vue';
  import CrossTinyIcon from '../../components/icons/cross-tiny.vue';
  import BaseResultLink from '../../components/result/base-result-link.vue';
  import Empathize from '../../x-modules/empathize/components/empathize.vue';
  // eslint-disable-next-line max-len
  import ClearHistoryQueries from '../../x-modules/history-queries/components/clear-history-queries.vue';
  import HistoryQueries from '../../x-modules/history-queries/components/history-queries.vue';
  // eslint-disable-next-line max-len
  import IdentifierResult from '../../x-modules/identifier-results/components/identifier-result.vue';
  // eslint-disable-next-line max-len
  import IdentifierResults from '../../x-modules/identifier-results/components/identifier-results.vue';
  import NextQueries from '../../x-modules/next-queries/components/next-queries.vue';
  import PopularSearches from '../../x-modules/popular-searches/components/popular-searches.vue';
  import QuerySuggestions from '../../x-modules/query-suggestions/components/query-suggestions.vue';

  @Component({
    components: {
      BaseKeyboardNavigation,
      BaseResultLink,
      ClearHistoryQueries,
      CrossTinyIcon,
      Empathize,
      HistoryQueries,
      IdentifierResult,
      IdentifierResults,
      NextQueries,
      PopularSearches,
      QuerySuggestions
    }
  })
  export default class PredictiveLayer extends Vue {
    @Prop()
    protected controls!: any;

    protected empathizeAnimation = animateScale();
  }
</script>
