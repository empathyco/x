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
        <DisplayEmitter
          v-else
          :payload="tagging?.toolingDisplay ?? { url: '', params: {} }"
          :event-metadata="{
            feature: 'overview',
            displayOriginalQuery: query,
            replaceable: false,
          }"
        >
          <span class="x-ai-overview-title" data-test="ai-overview-title">
            <AIStarIcon class="x-ai-overview-title-icon" />{{ !!title ? title : suggestionText }}
          </span>
        </DisplayEmitter>
      </Fade>
      <ChangeHeight>
        <div class="x-ai-overview-content" data-test="ai-overview-content">
          <span v-if="title">{{ suggestionText }}</span>
          <p>{{ responseText }}</p>
        </div>
      </ChangeHeight>
    </div>
    <CollapseHeight
      :style="{
        '--x-collapse-height-transition-duration': `${300 * suggestionsSearch.length}ms`,
      }"
      data-test="ai-overview-collapse-height-suggestions"
    >
      <div v-show="expanded">
        <SpinnerIcon
          v-if="!suggestionsSearch.length"
          class="ai-overview-suggestions-loading"
          data-test="ai-overview-suggestions-loading"
        />
        <div v-else class="x-ai-overview-suggestions" data-test="ai-overview-suggestions-container">
          <div
            v-for="{ query: suggestionQuery, results: queriesResults } in suggestionsSearch"
            :key="suggestionQuery"
            class="x-ai-overview-suggestion"
          >
            <BaseEventButton
              v-if="queriesResults"
              class="x-ai-overview-suggestion-query-btn"
              :events="{ UserAcceptedAQuery: suggestionQuery }"
            >
              {{ suggestionQuery }}
              <ArrowRightIcon class="x-ai-overview-suggestion-query-btn-icon" />
            </BaseEventButton>

            <slot v-if="queriesResults" name="sliding-panel" :results="queriesResults">
              <SlidingPanel
                :class="slidingPanelsClasses"
                :scroll-container-class="slidingPanelContainersClasses"
                :button-class="slidingPanelButtonsClasses"
                :reset-on-content-change="false"
              >
                <template #sliding-panel-addons="{ arrivedState }">
                  <slot name="sliding-panels-addons" :arrived-state="arrivedState" />
                </template>
                <template #sliding-panel-left-button>
                  <slot name="sliding-panels-left-button" />
                </template>
                <template #sliding-panel-right-button>
                  <slot name="sliding-panels-right-button" />
                </template>
                <ul class="x-ai-overview-suggestion-results">
                  <li
                    v-for="result in queriesResults"
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
      </div>
    </CollapseHeight>
    <div v-if="responseText" class="x-cursor-pointer" @click="onExpandButtonClick(!expanded)">
      <div v-show="!expanded" class="x-ai-overview-gradient" data-test="ai-overview-gradient" />
      <div class="x-ai-overview-toggle-wrapper" data-test="ai-overview-toggle-button-wrapper">
        <button
          class="x-ai-overview-toggle-btn"
          data-test="ai-overview-toggle-button"
          @click.stop="onExpandButtonClick(!expanded)"
        >
          {{ buttonText }}
          <ChevronDownIcon
            class="x-ai-overview-toggle-btn-icon"
            :class="{ 'x-ai-overview-toggle-btn-icon-expanded': expanded }"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
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
  SpinnerIcon,
} from '../../../components'
import DisplayEmitter from '../../../components/display-emitter.vue'
import { use$x, useGetter, useState } from '../../../composables'
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
    SpinnerIcon,
    DisplayEmitter,
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

    /**
     * The classes added to each sliding panel for each query.
     *
     * @public
     */
    slidingPanelsClasses: {
      type: String as PropType<string>,
    },
    /**
     * The classes added to each sliding panel container of each query.
     *
     * @public
     */
    slidingPanelContainersClasses: {
      type: String as PropType<string>,
    },
    /**
     * The classes added to each sliding panel buttons of each query.
     *
     * @public
     */
    slidingPanelButtonsClasses: {
      type: String as PropType<string>,
    },
  },
  setup(props) {
    const $x = use$x()
    const { query } = useGetter('ai')
    const { suggestionText, responseText, suggestionsSearch, suggestionsLoading, tagging } =
      useState('ai')

    const expanded = ref(false)

    const buttonText = computed(() => (expanded.value ? props.collapseText : props.expandText))

    function onExpandButtonClick(newValue: boolean) {
      $x.emit('UserClickedAiOverviewExpandButton', expanded.value, {
        suggestionText: suggestionText.value,
        toolingDisplayClick: tagging.value?.toolingDisplayClick,
      })
      setExpanded(newValue)
    }

    function setExpanded(newValue: boolean) {
      expanded.value = newValue
    }

    watch(query, () => (expanded.value = false))

    return {
      buttonText,
      expanded,
      responseText,
      suggestionsLoading,
      suggestionsSearch,
      suggestionText,
      setExpanded,
      onExpandButtonClick,
      query,
      tagging,
    }
  },
})
</script>
<style lang="css">
.x-ai-overview {
  --color: var(--x-ai-overview-color, #bbc9cf);
  --color-lighter: var(--x-ai-overview-color-lighter, color-mix(in srgb, var(--color) 25%, white));

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
  @apply x-button x-button-outlined x-rounded-full x-w-full x-mx-auto sm:x-translate-y-1/2 sm:x-w-[var(--expand-button-width,200px)];
}
.x-ai-overview-toggle-btn-icon {
  @apply x-rotate-0 x-icon x-transition-all x-duration-300;
}
.x-ai-overview-toggle-btn-icon-expanded {
  @apply x-rotate-180;
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

.ai-overview-suggestions-loading {
  width: 2.5rem /* 40px */;
  height: 2.5rem /* 40px */;
  margin: auto;
  animation: x-spin 1s linear infinite;

  @keyframes x-spin {
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
