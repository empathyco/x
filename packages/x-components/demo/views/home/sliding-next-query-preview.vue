<template>
  <NextQueryPreview
    v-slot="{ results, totalResults, suggestion: nextQuerySuggestion }"
    :suggestion="suggestion"
    class="xds:flex xds:flex-col xds:gap-8"
  >
    <h1 class="xds:title2">Others clients have searched</h1>
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

<script lang="ts" setup>
import type { NextQuery as NextQueryModel } from '@empathyco/x-types'
import type { PropType } from 'vue'
import { SlidingPanel } from '@x/components'
import { NextQuery, NextQueryPreview } from '@x/x-modules/next-queries'
import Result from './result.vue'

defineProps({
  suggestion: {
    type: Object as PropType<NextQueryModel>,
    required: true,
  },
})
</script>
