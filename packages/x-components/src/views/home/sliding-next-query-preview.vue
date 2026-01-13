<template>
  <NextQueryPreview
    v-slot="{ results, totalResults, suggestion: nextQuerySuggestion }"
    :suggestion="nextQuerySuggestion"
    class="xds:flex xds:flex-col xds:gap-8"
  >
    <h1 class="x-title2">Others clients have searched</h1>
    <NextQuery class="xds:suggestion xds:text1 xds:text1-lg" :suggestion="nextQuerySuggestion">
      <span class="xds:font-bold">{{ nextQuerySuggestion.query }}</span>
      ({{ totalResults }})
    </NextQuery>
    <SlidingPanel :reset-on-content-change="false">
      <div class="xds:flex xds:flex-col xds:gap-8">
        <Result
          v-for="result in results"
          :key="result.id"
          :result="result"
          style="max-width: 180px"
        />
      </div>
    </SlidingPanel>
  </NextQueryPreview>
</template>

<script lang="ts">
import type { NextQuery as NextQueryModel } from '@empathyco/x-types'
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import SlidingPanel from '../../components/sliding-panel.vue'
import NextQueryPreview from '../../x-modules/next-queries/components/next-query-preview.vue'
import NextQuery from '../../x-modules/next-queries/components/next-query.vue'
import Result from './result.vue'

export default defineComponent({
  name: 'SlidingNextQueryPreview',
  components: {
    NextQueryPreview,
    NextQuery,
    SlidingPanel,
    Result,
  },
  props: {
    suggestion: {
      type: Object as PropType<NextQueryModel>,
      required: true,
    },
  },
})
</script>
