<template>
  <div class="x-flex x-flex-col x-gap-16 x-bg-neutral-10 x-p-24 x-pl-16 x-pr-0 desktop:x-px-24">
    <div class="x-flex x-flex-col x-gap-16">
      <h1 class="x-text1 x-text1-lg x-pr-16 x-font-main x-text-neutral-90 desktop:x-pr-0">
        {{ relatedPrompt.suggestionText }}
      </h1>
      <SlidingPanel>
        <div class="x-flex x-gap-8 x-pr-8">
          <button
            v-for="(nextQuery, index) in relatedPrompt.nextQueries"
            :key="index"
            @click="onClick(nextQuery)"
            class="x-button x-button-lead x-button-sm x-button-outlined x-rounded-sm x-border-lead-50 x-text-neutral-75 hover:x-text-neutral-0 selected:x-text-neutral-0 selected:hover:x-bg-lead-50"
            :class="{ 'x-selected': selectedNextQuery === nextQuery }"
          >
            <span
              class="x-whitespace-nowrap"
              :class="
                selectedNextQuery === nextQuery ? 'x-title3 x-title3-md' : 'x-text1 x-text1-lg'
              "
            >
              {{ nextQuery }}
            </span>
            <CrossTinyIcon v-if="selectedNextQuery === nextQuery" class="x-icon" />
            <PlusIcon v-else class="x-icon" />
          </button>
        </div>
      </SlidingPanel>
    </div>
    <QueryPreview :queryPreviewInfo="queryPreviewInfo" #default="{ totalResults, results }">
      <SlidingPanel>
        <template #header>
          <QueryPreviewButton
            :queryPreviewInfo="queryPreviewInfo"
            class="x-button x-button-lead x-button-tight x-title3 x-title3-sm desktop:x-title3-md"
          >
            {{ queryPreviewInfo.query }}
            ({{ totalResults }})
            <ArrowRightIcon class="x-icon-lg" />
          </QueryPreviewButton>
        </template>

        <div class="x-transform-style-3d x-flex x-gap-16 x-pr-8 x-pt-8 desktop:x-pt-16">
          <Result
            v-for="result in results"
            :key="result.id"
            :result="result"
            class="x-w-[calc(38vw-16px)] x-min-w-[142px] desktop:x-w-[216px]"
          />
        </div>
      </SlidingPanel>
    </QueryPreview>
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, PropType, ref, ComputedRef } from 'vue';
  import { RelatedPrompt } from '@empathyco/x-types';
  import { relatedPromptsXModule } from '../x-module';
  import ArrowRightIcon from '../../../components/icons/arrow-right.vue';
  import CrossTinyIcon from '../../../components/icons/cross-tiny.vue';
  import PlusIcon from '../../../components/icons/plus.vue';
  // import { default as Result } from '../../../components/results/result.vue';
  import {
    QueryPreview,
    QueryPreviewButton,
    QueryPreviewInfo
  } from '../../../x-modules/queries-preview';
  import SlidingPanel from '../../../components/sliding-panel.vue';
  export default defineComponent({
    name: 'RelatedPrompt',
    components: {
      SlidingPanel,
      QueryPreview,
      QueryPreviewButton,
      // Result,
      ArrowRightIcon,
      CrossTinyIcon,
      PlusIcon
    },
    xModule: relatedPromptsXModule.name,
    props: {
      relatedPrompt: { type: Object as PropType<RelatedPrompt>, required: true }
    },
    setup(props) {
      const selectedNextQuery = ref(props.relatedPrompt.nextQueries[0]);
      const queryPreviewInfo: ComputedRef<QueryPreviewInfo> = computed(() => ({
        query: selectedNextQuery.value
      }));

      /**
       * Handles the click event on a next query button.
       *
       * @param nextQuery - The clicked next query.
       */
      function onClick(nextQuery: string): void {
        if (selectedNextQuery.value === nextQuery) {
          selectedNextQuery.value = '';
        } else {
          selectedNextQuery.value = nextQuery;
        }
      }

      return { queryPreviewInfo, selectedNextQuery, onClick };
    }
  });
</script>
