<template>
  <div
    class="x-ai-overview"
    :class="{ 'x-ai-overview--expanded': expanded, 'x-ai-overview--loading': loading }"
    data-test="ai-overview-container"
  >
    <div class="x-ai-overview-main">
      <Fade mode="out-in">
        <span
          v-if="loading"
          class="x-ai-overview-title-loading"
          data-test="ai-overview-title-loading"
        >
          <span class="x-ai-overview-title-loading-indicator" />
          <span
            v-typing="{ text: titleLoading, speed: 50 }"
            class="x-ai-overview-title-loading-text"
            data-test="ai-overview-title-loading-text"
          />
        </span>
        <span v-else class="x-ai-overview-title" data-test="ai-overview-title">
          <AIStarIcon class="x-ai-overview-title-icon" />{{ title }}
        </span>
      </Fade>
      <ChangeHeight>
        <div
          v-if="loading"
          class="x-ai-overview-loading-content"
          data-test="ai-overview-loading-content"
        >
          <span v-for="i in 4" :key="i" data-test="ai-overview-loading-item" />
        </div>
        <div v-else class="x-ai-overview-content" data-test="ai-overview-content">
          <span>{{ suggestionText }}</span>
          <p>{{ responseText }}</p>
        </div>
      </ChangeHeight>
    </div>
    <CollapseHeight
      v-if="suggestionsSearch.length"
      :style="{
        '--x-collapse-height-transition-duration': `${300 * suggestionsSearch.length}ms`,
      }"
      data-test="ai-overview-collapse-height-suggestions"
    >
      <div v-show="expanded" data-test="ai-overview-suggestions-container">
        <!-- @slot suggestions-search content -->
        <slot :suggestions-search="suggestionsSearch">
          <div class="x-ai-overview-suggestions">
            <div
              v-for="{ query, results } in suggestionsSearch"
              :key="query"
              class="x-ai-overview-suggestion"
            >
              <BaseEventButton
                class="x-ai-overview-suggestion-query-btn"
                :events="{ UserAcceptedAQuery: query }"
              >
                {{ query }}<ArrowRightIcon class="x-ai-overview-suggestion-query-btn-icon" />
              </BaseEventButton>
              <SlidingPanel :reset-on-content-change="false">
                <ul class="x-ai-overview-suggestion-results">
                  <li
                    v-for="result in results"
                    :key="result.id"
                    data-test="ai-overview-suggestion-result"
                  >
                    <!-- @slot (required) result card -->
                    <slot name="result" :result="result" />
                  </li>
                </ul>
              </SlidingPanel>
            </div>
          </div>
        </slot>
      </div>
    </CollapseHeight>
    <template v-if="!loading && !expanded">
      <div class="x-ai-overview-gradient" data-test="ai-overview-gradient" @click="open" />
      <div class="x-ai-overview-expand-wrapper">
        <button
          class="x-ai-overview-expand-btn"
          data-test="ai-overview-expand-button"
          @click="open"
        >
          {{ buttonText }}
          <ChevronDownIcon class="x-ai-overview-expand-btn-icon" />
        </button>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent, ref, watch } from 'vue'
import {
  AIStarIcon,
  ArrowRightIcon,
  BaseEventButton,
  ChangeHeight,
  ChevronDownIcon,
  CollapseHeight,
  Fade,
  SlidingPanel,
} from '../../../components'
import { useGetter, useState } from '../../../composables'
import { typing } from '../../../directives'
import { aiXModule } from '../x-module'

export default defineComponent({
  directives: {
    typing,
  },
  xModule: aiXModule.name,
  components: {
    AIStarIcon,
    ArrowRightIcon,
    BaseEventButton,
    ChevronDownIcon,
    CollapseHeight,
    ChangeHeight,
    Fade,
    SlidingPanel,
  },
  props: {
    /**
     * The text displayed when the question ended loading
     *
     * @public
     */
    title: {
      type: String as PropType<string>,
      default: 'Empathy AI Overview',
    },
    /**
     * The text displayed when the question is loading.
     *
     * @public
     */
    titleLoading: {
      type: String as PropType<string>,
      default: 'Generating with Empathy AI',
    },
    /**
     * The text displayed on the expand button.
     *
     * @public
     */
    buttonText: {
      type: String as PropType<string>,
      default: 'Show more',
    },
  },
  setup() {
    const { query, loading } = useGetter('ai')
    const { suggestionText, responseText, suggestionsSearch } = useState('ai')

    const expanded = ref(false)

    function open() {
      expanded.value = true
    }

    watch(query, () => (expanded.value = false))

    return {
      expanded,
      open,
      loading,
      suggestionText,
      responseText,
      suggestionsSearch,
    }
  },
})
</script>
<style lang="css">
.x-ai-overview {
  --color: var(--x-ai-overview-color, #bbc9cf);
  --color-lighter: var(--x-ai-overview-color-lighter, color-mix(in srgb, var(--color) 25%, white));
  --color-lightest: var(
    --x-ai-overview-color-lightest,
    color-mix(in srgb, var(--color) 75%, white)
  );

  @apply x-relative x-rounded-lg x-bg-[var(--color-lighter)];
}

.x-ai-overview:not(.x-ai-overview--loading, .x-ai-overview--expanded) {
  @apply x-rounded-b-3xl;
}

.x-ai-overview-main {
  @apply x-p-16 x-rounded-lg;
}

.x-ai-overview-title-loading {
  @apply x-flex x-items-center x-gap-1.5 x-mb-8;
}
.x-ai-overview-title-loading-indicator {
  @apply x-size-3 x-animate-pulse x-rounded-full x-bg-[var(--color)];
}
.x-ai-overview-title-loading-text {
  @apply x-animate-pulse x-text-xs;
}

.x-ai-overview-title {
  @apply x-flex x-text-sm x-font-bold x-gap-4 x-items-center x-mb-8;
}
.x-ai-overview-title-icon {
  @apply x-icon x-text-[var(--color)];
}

.x-ai-overview-loading-content {
  @apply x-flex x-w-full x-flex-col x-gap-4 x-animate-pulse;
}
.x-ai-overview-loading-content > span:first-child {
  @apply x-h-16 x-w-full x-rounded-full x-bg-gradient-to-r x-from-0% x-from-[var(--color)] x-to-100% x-to-[var(--color-lightest)];
}
.x-ai-overview-loading-content > span:nth-child(2) {
  @apply x-h-16 x-w-3/4 x-rounded-full x-bg-gradient-to-r x-from-0% x-from-[var(--color-lightest)] x-to-100% x-to-[var(--color)] x-opacity-50;
}
.x-ai-overview-loading-content > span:nth-child(3) {
  @apply x-h-16 x-w-11/12 x-rounded-full x-bg-gradient-to-r x-from-0% x-from-[var(--color)] x-to-100% x-to-[var(--color-lightest)];
}
.x-ai-overview-loading-content > span:nth-child(4) {
  @apply x-h-16 x-w-1/2 x-rounded-full x-bg-gradient-to-r x-from-0% x-from-[var(--color)] x-to-100% x-to-[var(--color-lightest)] x-opacity-75;
}

.x-ai-overview-content {
  @apply x-flex x-flex-col x-text-left x-leading-5 x-gap-2;
}
.x-ai-overview-content span {
  @apply x-font-medium;
}

.x-ai-overview-gradient {
  @apply x-cursor-pointer x-content-none x-absolute x-w-full x-h-80 x-bottom-5 x-bg-gradient-to-b x-from-0% x-from-transparent x-to-100% x-to-[var(--color-lighter)];
}

.x-ai-overview-expand-wrapper {
  @apply x-flex x-relative x-z-[1];
}
.x-ai-overview-expand-btn {
  @apply x-button x-button-outlined x-rounded-full x-w-full;
}
.x-ai-overview-expand-btn-icon {
  @apply x-icon;
}
.x-ai-overview-suggestion-query-btn {
  @apply x-button-tight x-mx-16 x-font-bold x-text-gray-900 x-w-fit x-min-h-fit x-flex x-gap-16 x-items-center;
}
.x-ai-overview-suggestion-query-btn-icon {
  @apply x-icon-md;
}
.x-ai-overview-suggestions {
  @apply x-flex x-flex-col x-gap-16;
}
.x-ai-overview-suggestion {
  @apply x-flex x-flex-col x-gap-8;
}
.x-ai-overview-suggestion-results {
  @apply x-flex x-gap-16 x-px-16;
}
</style>
