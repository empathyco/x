<template>
  <BaseKeyboardNavigation>
    <Empathize :animation="empathizeAnimation">
      <div class="xds:flex xds:gap-24">
        <PopularSearches :max-items-to-render="10" />
        <HistoryQueries :max-items-to-render="controls.historyQueries.maxItemsToRender" />
        <ClearHistoryQueries class="xds:button-ghost">
          <CrossTinyIcon />
          <span>Clear previous searches</span>
        </ClearHistoryQueries>
        <QuerySuggestions :max-items-to-render="10" />
        <NextQueries :max-items-to-render="10" />

        <!-- IdentifierResults -->
        <IdentifierResults v-slot="{ identifierResult }">
          <BaseResultLink :result="identifierResult">
            <article class="xds:suggestion">
              <IdentifierResult :result="identifierResult" />
              <span data-test="result-text">
                {{ identifierResult.name }}
              </span>
            </article>
          </BaseResultLink>
        </IdentifierResults>
      </div>
    </Empathize>
  </BaseKeyboardNavigation>
</template>

<script lang="ts" setup>
import { animateScale, BaseKeyboardNavigation, BaseResultLink, CrossTinyIcon } from '@x/components'
import { Empathize } from '@x/x-modules/empathize'
import { ClearHistoryQueries, HistoryQueries } from '@x/x-modules/history-queries'
import { IdentifierResult, IdentifierResults } from '@x/x-modules/identifier-results'
import { NextQueries } from '@x/x-modules/next-queries'
import { PopularSearches } from '@x/x-modules/popular-searches'
import { QuerySuggestions } from '@x/x-modules/query-suggestions'

defineProps({
  controls: {
    type: Object,
    required: true,
  },
})
const empathizeAnimation = animateScale()
</script>
