<template>
  <QueryPreview
    v-slot="{ results, totalResults, query: queryPreview }"
    :debounce-time-ms="250"
    :query="query"
  >
    <div class="flex gap-8 mb-16">
      <h1 class="x-title2">{{ queryPreview }} ({{ totalResults }})</h1>
      <SlidingPanel :reset-on-content-change="false" scroll-container-class="x-sliding-panel-fade">
        <div class="flex flex-row gap-8">
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
import { defineComponent } from 'vue'
import SlidingPanel from '../../components/sliding-panel.vue'
import QueryPreview from '../../x-modules/queries-preview/components/query-preview.vue'
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
