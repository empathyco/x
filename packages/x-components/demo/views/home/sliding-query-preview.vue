<template>
  <QueryPreview
    v-slot="{ results, totalResults, query: queryPreview }"
    :debounce-time-ms="250"
    :query-preview-info="{ query }"
  >
    <div class="x-flex x-gap-8 x-mb-16">
      <h1 class="x-title2">{{ queryPreview }} ({{ totalResults }})</h1>
      <SlidingPanel :reset-on-content-change="false" scroll-container-class="x-sliding-panel-fade">
        <div class="x-flex x-flex-row x-gap-8">
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

<script lang="ts">
import { SlidingPanel } from '@x/components'
import { QueryPreview } from '@x/x-modules/queries-preview'
import { defineComponent } from 'vue'
import Result from './result.vue'

export default defineComponent({
  name: 'SlidingQueryPreview',
  components: {
    QueryPreview,
    Result,
    SlidingPanel,
  },
  props: {
    query: {
      type: String,
      required: true,
    },
  },
})
</script>
