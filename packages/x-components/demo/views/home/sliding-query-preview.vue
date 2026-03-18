<template>
  <QueryPreview
    v-slot="{ results, totalResults, query: queryPreview }"
    :debounce-time-ms="250"
    :query-preview-info="{ query }"
  >
    <div class="xds:mb-16 xds:flex xds:gap-8">
      <h1 class="xds:title2">{{ queryPreview }} ({{ totalResults }})</h1>
      <SlidingPanel
        :reset-on-content-change="false"
        scroll-container-class="xds:sliding-panel-fade"
      >
        <div class="xds:flex xds:flex-row xds:gap-8">
          <Result
            v-for="result in results"
            :key="result.id"
            :result="result"
            style="max-width: 180px"
          />
        </div>
      </SlidingPanel>
    </div>
  </QueryPreview>
</template>

<script lang="ts" setup>
import { SlidingPanel } from '@x/components'
import { QueryPreview } from '@x/x-modules/queries-preview'
import Result from './result.vue'

defineProps({
  query: {
    type: String,
    required: true,
  },
})
</script>
