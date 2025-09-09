<template>
  <div class="x-ai-overview">
    <div class="x-ai-overview-main">
      <Fade mode="out-in">
        <span
          v-if="suggestionsLoading"
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
        <div class="x-ai-overview-content" data-test="ai-overview-content">
          <span>{{ suggestionText }}</span>
          <p>{{ responseText }}</p>
        </div>
      </ChangeHeight>
    </div>
    <CollapseHeight
      v-if="queries.length"
      :style="{
        '--x-collapse-height-transition-duration': `${300 * suggestionsSearch.length}ms`,
      }"
      data-test="ai-overview-collapse-height-suggestions"
    >
      <div v-show="expanded" data-test="ai-overview-suggestions-container">
        <!-- @slot suggestions-search content -->
        <slot :suggestions-search="suggestionsSearch" :queries="queries">
          <div class="x-ai-overview-suggestions">
            <div v-for="{ query } in queries" :key="query" class="x-ai-overview-suggestion">
              <BaseEventButton
                class="x-ai-overview-suggestion-query-btn"
                :events="{ UserAcceptedAQuery: query }"
              >
                {{ query }}<ArrowRightIcon class="x-ai-overview-suggestion-query-btn-icon" />
              </BaseEventButton>
              <!-- @slot suggestion query result list -->
              <slot name="query-results" :query-results="queriesResults[query]">
                <SlidingPanel v-if="queriesResults[query]" :reset-on-content-change="false">
                  <ul class="x-ai-overview-suggestion-results">
                    <li
                      v-for="result in queriesResults[query].results"
                      :key="result.id"
                      data-test="ai-overview-suggestion-result"
                    >
                      <!-- @slot (required) result card -->
                      <slot name="result" :result="result" />
                    </li>
                  </ul>
                </SlidingPanel>
              </slot>
            </div>
          </div>
        </slot>
      </div>
    </CollapseHeight>
    <div v-show="queries.length">
      <div
        v-show="!expanded"
        class="x-ai-overview-gradient"
        data-test="ai-overview-gradient"
        @click="toggleVisibility"
      />
      <div class="x-ai-overview-toggle-wrapper">
        <!-- @slot toggle button -->
        <slot name="toggle-button" v-bind="{ expanded, toggleVisibility, buttonText }">
          <button
            class="x-ai-overview-toggle-btn"
            data-test="ai-overview-toggle-button"
            @click="toggleVisibility"
          >
            {{ buttonText }}
            <ChevronDownIcon
              class="x-ai-overview-toggle-btn-icon"
              :class="
                expanded
                  ? 'x-ai-overview-toggle-btn-icon-expanded'
                  : 'x-ai-overview-toggle-btn-icon-collapsed'
              "
            />
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { AiSuggestionSearch } from '@empathyco/x-types'
import type { PropType } from 'vue'
import { computed, defineComponent, ref, watch } from 'vue'
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
     * The text displayed on the toggle button when collapsed.
     *
     * @public
     */
    expandText: {
      type: String as PropType<string>,
      default: 'Show more',
    },
    /**
     * The text displayed on the toggle button when expanded.
     *
     * @public
     */
    collapseText: {
      type: String as PropType<string>,
      default: 'Show less',
    },
  },
  setup(props) {
    const { query } = useGetter('ai')
    const { suggestionText, responseText, queries, suggestionsSearch, suggestionsLoading } =
      useState('ai')

    const expanded = ref(false)

    const queriesResults = computed(() => {
      return suggestionsSearch.value.reduce(
        (
          acc: Record<string, { results: AiSuggestionSearch['results']; numFound: number }>,
          { query, results, numFound },
        ) => {
          acc[query] = { results, numFound }
          return acc
        },
        {},
      )
    })

    const buttonText = computed(() => (expanded.value ? props.collapseText : props.expandText))

    function toggleVisibility() {
      expanded.value = !expanded.value
    }

    watch(query, () => (expanded.value = false))

    return {
      buttonText,
      expanded,
      queries,
      responseText,
      suggestionsLoading,
      queriesResults,
      suggestionsSearch,
      suggestionText,
      toggleVisibility,
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

  @apply x-relative x-rounded-3xl x-bg-[var(--color-lighter)];
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

.x-ai-overview-content {
  @apply x-flex x-flex-col x-text-left x-leading-5 x-gap-2;
}
.x-ai-overview-content span {
  @apply x-font-medium;
}

.x-ai-overview-gradient {
  @apply x-cursor-pointer x-content-none x-absolute x-w-full x-h-80 x-bottom-5 x-bg-gradient-to-b x-from-0% x-from-transparent x-to-100% x-to-[var(--color-lighter)];
}

.x-ai-overview-toggle-wrapper {
  @apply x-flex x-relative x-z-[1];
}
.x-ai-overview-toggle-btn {
  @apply x-button x-button-outlined x-rounded-full x-w-full;
}
.x-ai-overview-toggle-btn-icon {
  @apply x-icon x-transition-all x-duration-300;
}
.x-ai-overview-toggle-btn-icon-expanded {
  @apply x-rotate-180;
}
.x-ai-overview-toggle-btn-icon-collapsed {
  @apply x-rotate-0;
}
.x-ai-overview-suggestion-query-btn {
  @apply x-button-tight x-mx-16 x-font-bold x-text-gray-900 x-w-fit x-min-h-fit x-flex x-gap-16 x-items-center;
}
.x-ai-overview-suggestion-query-btn-icon {
  @apply x-icon-md;
}
.x-ai-overview-suggestions {
  @apply x-flex x-flex-col x-gap-16 x-pb-16;
}
.x-ai-overview-suggestion {
  @apply x-flex x-flex-col x-gap-8;
}
.x-ai-overview-suggestion-results {
  @apply x-flex x-gap-16 x-px-16;
}
</style>
