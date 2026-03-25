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
import { AnimateScale, BaseKeyboardNavigation, BaseResultLink, CrossTinyIcon } from '@x/components'
import { Empathize } from '@x/x-modules/empathize'
import { ClearHistoryQueries, HistoryQueries } from '@x/x-modules/history-queries'
import { IdentifierResult, IdentifierResults } from '@x/x-modules/identifier-results'
import { NextQueries } from '@x/x-modules/next-queries'
import { PopularSearches } from '@x/x-modules/popular-searches'
import { QuerySuggestions } from '@x/x-modules/query-suggestions'
import { defineComponent } from 'vue'

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
    const empathizeAnimation = AnimateScale
    return {
      empathizeAnimation,
    }
  },
})
</script>
