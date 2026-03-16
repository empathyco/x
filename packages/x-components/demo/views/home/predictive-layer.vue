<template>
  <BaseKeyboardNavigation>
    <Empathize :animation="empathizeAnimation">
      <div class="x-flex x-gap-24">
        <PopularSearches :max-items-to-render="10" />
        <HistoryQueries :max-items-to-render="controls.historyQueries.maxItemsToRender" />
        <ClearHistoryQueries class="x-button--ghost x-button--ghost-start">
          <CrossTinyIcon />
          <span>Clear previous searches</span>
        </ClearHistoryQueries>
        <QuerySuggestions :max-items-to-render="10" />
        <NextQueries :max-items-to-render="10" />

        <!-- IdentifierResults -->
        <IdentifierResults v-slot="{ identifierResult }">
          <BaseResultLink :result="identifierResult">
            <article class="x-suggestion">
              <IdentifierResult :result="identifierResult" />
              <span class="x-truncate" data-test="result-text">
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
import { defineComponent } from 'vue'
import { animateScale } from '../../../src/components/animations/animate-scale/animate-scale.factory'
import BaseKeyboardNavigation from '../../../src/components/base-keyboard-navigation.vue'
import CrossTinyIcon from '../../../src/components/icons/cross-tiny.vue'
import BaseResultLink from '../../../src/components/result/base-result-link.vue'
import Empathize from '../../../src/x-modules/empathize/components/empathize.vue'
import ClearHistoryQueries from '../../../src/x-modules/history-queries/components/clear-history-queries.vue'
import HistoryQueries from '../../../src/x-modules/history-queries/components/history-queries.vue'
import IdentifierResult from '../../../src/x-modules/identifier-results/components/identifier-result.vue'
import IdentifierResults from '../../../src/x-modules/identifier-results/components/identifier-results.vue'
import NextQueries from '../../../src/x-modules/next-queries/components/next-queries.vue'
import PopularSearches from '../../../src/x-modules/popular-searches/components/popular-searches.vue'
import QuerySuggestions from '../../../src/x-modules/query-suggestions/components/query-suggestions.vue'

export default defineComponent({
  name: 'PredictiveLayer',
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
    QuerySuggestions,
  },
  props: {
    controls: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const empathizeAnimation = animateScale()
    return {
      empathizeAnimation,
    }
  },
})
</script>
