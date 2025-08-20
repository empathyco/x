<template>
  <div class="x-flex x-flex-col x-gap-6 md:x-gap-8">
    <div class="x-flex x-min-h-[248px] x-shrink-0 x-flex-col md:x-min-h-[296px]">
      <QueryPreviewList
        v-slot="{ queryPreviewInfo, results }"
        :max-items-to-render="10"
        :queries-preview-info="mappedQueries"
        :debounce-time-ms="0"
        persist-in-cache
        query-feature="related_prompts"
      >
        <QueryPreviewButton
          :query-preview-info="queryPreviewInfo"
          :metadata="{ feature: 'related_prompts' }"
          class="x-button-tight x-mx-8 x-pb-8 x-font-bold x-text-gray-900 md:x-mx-16"
        >
          <template #related-prompt-extra-content>
            <!--
             @slot related-prompt-extra-content - The slot to render related prompt extra information.
             @prop {Object} question - The related prompt object.
            -->
            <slot name="related-prompt-extra-content" />
          </template>
        </QueryPreviewButton>
        <SlidingPanel scroll-container-class="x-px-8 x-gap-16 md:x-px-16 x-pb-8 md:x-pb-16">
          <Result
            v-for="result in results"
            :key="result.id"
            :result="result"
            class="x-flex x-gap-8 x-flex-col x-shrink-0 x-p-8"
          />
        </SlidingPanel>
      </QueryPreviewList>
    </div>
  </div>
</template>

<script lang="ts">
import type { AiQuestion } from '@empathyco/x-types'
import type { PropType } from 'vue'
import { computed, defineComponent } from 'vue'
import SlidingPanel from '../../../components/sliding-panel.vue'
import Result from '../../../views/home/result.vue'
import { QueryPreviewButton, QueryPreviewList } from '../../queries-preview'

export default defineComponent({
  components: {
    Result,
    SlidingPanel,
    QueryPreviewButton,
    QueryPreviewList,
  },
  props: {
    question: {
      type: Object as PropType<AiQuestion>,
      required: true,
    },
  },
  setup(props) {
    const mappedQueries = computed(() => {
      return props.question?.content?.searchQueries.map(query => ({
        query,
      }))
    })

    return {
      mappedQueries,
    }
  },
})
</script>
