<template>
  <CollapseHeight>
    <div
      v-if="!isNoResults"
      ref="aiOverviewRef"
      class="x-ai-overview"
      data-test="ai-overview-wrapper"
    >
      <div class="x-ai-overview-main">
        <Fade mode="out-in">
          <span
            v-if="suggestionsLoading"
            class="x-ai-overview-title-loading"
            data-test="ai-overview-title-loading"
          >
            <span class="x-ai-overview-title-loading-indicator" />
            <span
              class="x-ai-overview-title-loading-text"
              data-test="ai-overview-title-loading-text"
            >
              <slot name="title-loading">
                {{ titleLoading }}
              </slot>
            </span>
          </span>
          <DisplayEmitter
            v-else
            :payload="tagging?.toolingDisplay ?? emptyTaggingRequest"
            :event-metadata="{
              feature: 'overview',
              displayOriginalQuery: query || 'overview-without-query',
              replaceable: false,
            }"
            data-test="ai-overview-display-emitter"
          >
            <span class="x-ai-overview-title" data-test="ai-overview-title">
              <AIStarIcon class="x-ai-overview-title-icon" />{{ !!title ? title : suggestionText }}
            </span>
          </DisplayEmitter>
        </Fade>
        <ChangeHeight>
          <div class="x-ai-overview-content-wrapper">
            <span
              v-if="title"
              class="x-ai-overview-content-title"
              data-test="ai-overview-content-title"
              >{{ suggestionText }}
            </span>
            <div
              :class="contentClasses"
              data-test="ai-overview-content"
              v-html="parsedResponseText"
            />
          </div>
        </ChangeHeight>
        <slot name="extra-content" />
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
            class="x-ai-overview-suggestions-loading"
            data-test="ai-overview-suggestions-loading"
          />
          <div
            v-else
            class="x-ai-overview-suggestions"
            data-test="ai-overview-suggestions-container"
          >
            <DisplayEmitter
              v-for="(
                { query: suggestionQuery, results: queriesResults }, suggestionIndex
              ) in suggestionsSearch"
              :key="suggestionQuery"
              :payload="
                tagging?.searchQueries[suggestionQuery].toolingDisplay ?? emptyTaggingRequest
              "
              :event-metadata="{
                feature: 'overview',
                displayOriginalQuery: query || 'overview-without-query',
                replaceable: false,
              }"
              data-test="ai-overview-query-display-emitter"
            >
              <div
                class="x-ai-overview-suggestion"
                data-test="ai-overview-suggestion"
                :class="{
                  'x-ai-overview-result-animation': shouldAnimateSuggestion,
                }"
                :style="{ animationDelay: `${suggestionIndex * 300}ms` }"
              >
                <BaseEventButton
                  class="x-ai-overview-suggestion-query-btn"
                  :events="{ UserAcceptedAQuery: suggestionQuery }"
                >
                  {{ suggestionQuery }}
                  <ArrowRightIcon class="x-ai-overview-suggestion-query-btn-icon" />
                </BaseEventButton>

                <DisplayClickProvider
                  :tooling-display-tagging="
                    tagging?.searchQueries[suggestionQuery].toolingDisplayClick
                  "
                  :tooling-add2-cart-tagging="
                    tagging?.searchQueries[suggestionQuery].toolingDisplayAdd2Cart
                  "
                  result-feature="overview"
                >
                  <slot name="sliding-panel" :results="queriesResults">
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
                          v-for="(result, resultIndex) in queriesResults"
                          :key="result.id"
                          data-test="ai-overview-suggestion-result"
                          :class="{
                            'x-ai-overview-result-animation': shouldAnimateSuggestion,
                          }"
                          :style="{
                            animationDelay: `${suggestionIndex * 300 + resultIndex * 300}ms`,
                          }"
                        >
                          <!-- @slot (required) result card -->
                          <slot name="result" :result="result" />
                        </li>
                      </ul>
                    </SlidingPanel>
                  </slot>
                </DisplayClickProvider>
              </div>
            </DisplayEmitter>
            <slot name="suggestions-extra-content" />
          </div>
        </div>
      </CollapseHeight>

      <Fade>
        <div
          v-if="queries.length"
          class="x-cursor-pointer"
          data-test="ai-overview-toggle-button-wrapper"
          @click="emitAndSetExpand(!expanded)"
        >
          <div v-show="!expanded" class="x-ai-overview-gradient" data-test="ai-overview-gradient" />
          <div class="x-ai-overview-toggle-wrapper">
            <button
              class="x-ai-overview-toggle-btn"
              data-test="ai-overview-toggle-button"
              @click.stop="emitAndSetExpand(!expanded)"
            >
              {{ buttonText }}
              <ChevronDownIcon
                class="x-ai-overview-toggle-btn-icon"
                :class="{ 'x-ai-overview-toggle-btn-icon-expanded': expanded }"
              />
            </button>
          </div>
        </div>
      </Fade>
    </div>
  </CollapseHeight>
</template>

<script lang="ts">
import type { TaggingRequest } from '@empathyco/x-types'
import { marked } from 'marked'
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import {
  AIStarIcon,
  ArrowRightIcon,
  BaseEventButton,
  ChangeHeight,
  ChevronDownIcon,
  CollapseHeight,
  DisplayClickProvider,
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
    DisplayClickProvider,
  },
  props: {
    /* The text displayed when the question ended loading */
    title: {
      type: String,
    },
    /* The text displayed when the question is loading. */
    titleLoading: {
      type: String,
      default: 'Generating with Empathy AI',
    },
    /* The text displayed on the toggle button when collapsed. */
    expandText: {
      type: String,
      default: 'Show more',
    },
    /* The text displayed on the toggle button when expanded. */
    collapseText: {
      type: String,
      default: 'Show less',
    },
    /* Auto expand the AI Overview when there are queries in AI and no-results in search. */
    autoExpandInSearchNoResults: {
      type: Boolean,
      default: true,
    },
    /* The classes added to the parsed response text container. */
    contentClasses: {
      type: String,
    },
    /* The classes added to each sliding panel for each query. */
    slidingPanelsClasses: {
      type: String,
    },
    /* The classes added to each sliding panel container of each query. */
    slidingPanelContainersClasses: {
      type: String,
    },
    /* The classes added to each sliding panel button of each query. */
    slidingPanelButtonsClasses: {
      type: String,
    },
  },
  setup(props) {
    const $x = use$x()
    const { query } = useGetter('ai')
    const {
      suggestionText,
      responseText,
      suggestionsSearch,
      suggestionsLoading,
      tagging,
      isNoResults,
      queries,
    } = useState('ai')

    const emptyTaggingRequest: TaggingRequest = { url: '', params: {} }

    const aiOverviewRef = ref<HTMLDivElement | null>(null)
    const expanded = ref(false)
    const shouldAnimateSuggestion = ref(true)
    const parsedResponseText = computed(() => marked.parse(responseText.value))

    const buttonText = computed(() => (expanded.value ? props.collapseText : props.expandText))

    function emitAndSetExpand(isExpanded: boolean) {
      $x.emit('UserClickedAiOverviewExpandButton', expanded.value, {
        suggestionText: suggestionText.value,
        toolingDisplayClick: tagging.value?.toolingDisplayClick,
      })

      expanded.value = isExpanded
      if (!expanded.value) {
        aiOverviewRef.value?.scrollIntoView({ behavior: 'smooth' })
        shouldAnimateSuggestion.value = false
      }
    }

    /* Expand AIOverview programmatically when the `autoExpandInSearchNoResults` prop is active,
    the request for suggestions has ended; there are queries in AI and no-results in search. */
    watch([suggestionsLoading, () => $x.noResults], () => {
      if (
        props.autoExpandInSearchNoResults &&
        !suggestionsLoading.value &&
        queries.value.length &&
        $x.noResults
      ) {
        emitAndSetExpand(true)
      }
    })

    $x.on('AiSuggestionsRequestUpdated', false).subscribe(() => {
      expanded.value = false
      shouldAnimateSuggestion.value = true
    })

    onMounted(() => {
      $x.emit('AiOverviewMounted', undefined, { feature: 'overview' })
    })

    return {
      aiOverviewRef,
      buttonText,
      emptyTaggingRequest,
      expanded,
      parsedResponseText,
      suggestionsLoading,
      suggestionsSearch,
      suggestionText,
      emitAndSetExpand,
      shouldAnimateSuggestion,
      query,
      tagging,
      isNoResults,
      queries,
    }
  },
})
</script>

<style lang="css">
.x-ai-overview {
  --color: var(--x-ai-overview-color, #bbc9cf);
  --color-lighter: var(--x-ai-overview-color-lighter, color-mix(in srgb, var(--color) 25%, white));

  position: relative;
  border-radius: 1.5rem;
  background-color: var(--color-lighter);
}

.x-ai-overview-main {
  padding: 1rem;
  max-width: var(--x-ai-overview-main-max-width, none);
  margin: 0 auto;
}

.x-ai-overview-title {
  display: flex;
  font-size: 0.875rem;
  font-weight: 700;
  gap: 0.25rem;
  align-items: center;
  margin-bottom: 0.5rem;
}

.x-ai-overview-title-loading {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.5rem;
}

.x-ai-overview-title-loading-indicator {
  width: 0.75rem;
  height: 0.75rem;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  border-radius: 9999px;
  background-color: var(--color);
}

.x-ai-overview-title-loading-text {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  font-size: 0.75rem;
}

.x-ai-overview-title-icon {
  height: 1rem;
  aspect-ratio: 1 / 1;
  color: var(--color);
  flex-shrink: 0;
}

.x-ai-overview-content-wrapper {
  display: flex;
  flex-direction: column;
  text-align: left;
  line-height: 1.25rem;
}

.x-ai-overview-content-title {
  font-weight: 500;
  margin-bottom: 8px;
}

.x-ai-overview-gradient {
  border-radius: 1.5rem;
  cursor: pointer;
  content: none;
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0;
  background-image: linear-gradient(to bottom, transparent 0%, var(--color-lighter) 100%);
}

.x-ai-overview-toggle-wrapper {
  display: flex;
  position: relative;
}

.x-ai-overview-toggle-btn {
  border-color: var(--button-color-50, #283034);
  background-color: #ffffff;
  color: var(--button-color-50, #283034);
  border-radius: 9999px;
  width: 100%;
  margin: auto;
  padding-right: 1rem;
  padding-left: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-style: solid;
  border-width: 1px;
  font-weight: 700;
  min-height: 2.5rem;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.x-ai-overview-toggle-btn:hover {
  border-color: var(--button-color-50, #283034);
  background-color: var(--button-color-50, #283034);
  color: #ffffff;
}

@media (min-width: 640px) {
  .x-ai-overview-toggle-btn {
    transition-property: all;
    transition-duration: 500ms;
    transform: translateY(50%);
    width: var(--expand-button-width, 200px);
  }
}

.x-ai-overview-toggle-btn-icon {
  transform: rotate(0deg);
  height: 1rem;
  aspect-ratio: 1 / 1;
  transition-property: all;
  transition-duration: 300ms;
}

.x-ai-overview-toggle-btn-icon-expanded {
  transform: rotate(180deg);
}

.x-ai-overview-suggestion-query-btn {
  border-color: transparent;
  background-color: transparent;
  margin-left: 1rem;
  margin-right: 1rem;
  font-weight: 700;
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.x-ai-overview-suggestion-query-btn-icon {
  height: 1rem;
  aspect-ratio: 1 / 1;
}

.x-ai-overview-suggestions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-bottom: 1rem;
}

.x-ai-overview-suggestions-loading {
  width: 2.5rem;
  height: 2.5rem;
  margin: auto;
  animation: x-spin 1s linear infinite;
}

.x-ai-overview-suggestion {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.x-ai-overview-suggestion-results {
  display: flex;
  gap: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
}

@keyframes x-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  50% {
    opacity: 0.5;
  }
}
</style>

<docs lang="mdx">
## AI Overview Examples

The `ai-overview` component provides an AI-generated summary and suggestions for queries. Below are usage examples in Vue 3 style, matching the format of previous documentation files.

### Basic usage

```vue
<template>
  <AiOverview
    :title="'AI Overview'"
    :title-loading="'Generating with Empathy AI'"
    :expand-text="'Show more'"
    :collapse-text="'Show less'"
    :content-classes="'my-content-class'"
    :sliding-panels-classes="'my-sliding-panel-class'"
    :sliding-panel-containers-classes="'my-sliding-panel-container-class'"
    :sliding-panel-buttons-classes="'my-sliding-panel-button-class'"
  >
    <template #result="{ result }">
      <ResultCard :result="result" />
    </template>
  </AiOverview>
</template>

<script setup>
import AiOverview from '@empathyco/x-components/js/x-modules/ai/components/ai-overview.vue'
import ResultCard from './ResultCard.vue'
</script>
```

### Customizing slots

You can customize the loading title, extra content, and sliding panel slots:

```vue
<template>
  <AiOverview
    :title="'AI Overview'"
    :title-loading="'Loading... Please wait'"
    :expand-text="'Show more'"
    :collapse-text="'Show less'"
  >
    <template #title-loading>
      <span>Custom loading title...</span>
    </template>
    <template #extra-content>
      <div>Extra content below the main overview</div>
    </template>
    <template #sliding-panels-addons="{ arrivedState }">
      <span v-if="arrivedState.left">Left end reached</span>
      <span v-if="arrivedState.right">Right end reached</span>
    </template>
    <template #result="{ result }">
      <ResultCard :result="result" />
    </template>
  </AiOverview>
</template>

<script setup>
import AiOverview from '@empathyco/x-components/js/x-modules/ai/components/ai-overview.vue'
import ResultCard from './ResultCard.vue'
</script>
```

### Notes

- The component is designed for Vue 3 and uses `<script setup>` syntax in all examples.
- All props are reactive and can be updated dynamically.
- The `result` slot is required for rendering each result card.
- You can use other named slots to customize loading, extra content, and sliding panel controls.
</docs>
