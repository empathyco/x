<template>
  <CollapseHeight>
    <div v-if="suggestionsSearch.length" class="x-ai-carousel">
      <DisplayEmitter
        :payload="tagging?.toolingDisplay ?? emptyTaggingRequest"
        :event-metadata="{
          feature: 'ai_carousel',
          displayOriginalQuery: query || 'ai-carousel-without-query',
          replaceable: false,
        }"
        data-test="ai-carousel-display-emitter"
      >
        <span
          class="x-ai-carousel-title"
          :class="{ 'x-ai-carousel-title--expanded': titleExpanded }"
          data-test="ai-carousel-title"
          @click="toggleTitleExpansion"
        >
          <AIStarIcon class="x-ai-carousel-title-icon" />
          <ChangeHeight>
            <span
              ref="titleRef"
              class="x-ai-carousel-title-text"
              :class="{ 'x-ai-carousel-title-text--expanded': titleExpanded }"
            >
              {{ title }}
            </span>
          </ChangeHeight>
          <button
            v-if="isTitleOverflowing"
            class="x-ai-carousel-title-button"
            data-test="ai-carousel-title-button"
            :aria-label="titleExpanded ? 'Collapse' : 'Expand'"
          >
            <ChevronDownIcon
              class="x-ai-carousel-title-button-icon"
              :class="{ 'x-ai-carousel-title-button-icon--expanded': titleExpanded }"
            />
          </button>
        </span>
      </DisplayEmitter>
      <slot name="sliding-panel" :suggestions="suggestionsSearch" :tagging="tagging">
        <SlidingPanel
          :class="slidingPanelClasses"
          :scroll-container-class="slidingPanelContainerClasses"
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
          <div class="x-ai-carousel-suggestion">
            <ul class="x-ai-carousel-suggestion-results">
              <DisplayClickProvider
                v-for="suggestion in suggestionsSearch"
                :key="suggestion.query"
                :tooling-display-tagging="
                  tagging?.searchQueries[suggestion.query].toolingDisplayClick
                "
                :tooling-add2-cart-tagging="
                  tagging?.searchQueries[suggestion.query].toolingDisplayAdd2Cart
                "
                result-feature="ai_carousel"
              >
                <li
                  v-for="result in suggestion.results"
                  :key="result.id"
                  data-test="ai-carousel-suggestion-result"
                >
                  <!-- @slot (required) result card -->
                  <slot name="result" :result="result" />
                </li>
              </DisplayClickProvider>
            </ul>
          </div>
        </SlidingPanel>
      </slot>
      <slot name="extra-content" />
      <slot name="cta-button" />
    </div>
  </CollapseHeight>
</template>

<script lang="ts">
import type { TaggingRequest } from '@empathyco/x-types'
import { useResizeObserver } from '@vueuse/core'
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import {
  AIStarIcon,
  ChangeHeight,
  ChevronDownIcon,
  CollapseHeight,
  DisplayClickProvider,
  SlidingPanel,
} from '../../../components'
import DisplayEmitter from '../../../components/display-emitter.vue'
import { use$x, useState } from '../../../composables'
import { aiXModule } from '../x-module'

export default defineComponent({
  xModule: aiXModule.name,
  components: {
    ChangeHeight,
    DisplayClickProvider,
    DisplayEmitter,
    CollapseHeight,
    AIStarIcon,
    ChevronDownIcon,
    SlidingPanel,
  },
  props: {
    /* The title text displayed */
    title: {
      type: String,
    },
    /* The classes added to the sliding panel. */
    slidingPanelClasses: {
      type: String,
    },
    /* The classes added to the sliding panel container. */
    slidingPanelContainerClasses: {
      type: String,
    },
    /* The classes added to the sliding panel buttons. */
    slidingPanelButtonsClasses: {
      type: String,
    },
  },
  setup(props) {
    const $x = use$x()
    const { query, isNoResults, suggestionsSearch, queries, tagging } = useState('ai')
    const emptyTaggingRequest: TaggingRequest = { url: '', params: {} }

    const titleRef = ref<HTMLElement | null>(null)
    const titleExpanded = ref(false)
    const isTitleOverflowing = ref(false)

    /**
     * Checks if the title is overflowing and updates the state.
     */
    function updateTitleOverflow() {
      if (titleExpanded.value) {
        return
      }
      if (titleRef.value) {
        isTitleOverflowing.value = titleRef.value.scrollWidth > titleRef.value.clientWidth
      }
    }

    /**
     * Toggles the title expanded state if it is overflowing.
     */
    function toggleTitleExpansion() {
      if (isTitleOverflowing.value) {
        titleExpanded.value = !titleExpanded.value
      }
    }

    const title = computed(() => {
      if (!props.title) {
        const queriesList = new Intl.ListFormat('en', {
          style: 'long',
          type: 'conjunction',
        }).format(queries.value.map(({ query }) => query))
        return `Searching for ${queriesList}`
      }
      return props.title
    })

    watch(queries, () => {
      if (queries.value.length > 0) {
        $x.emit('AiSuggestionsSearchRequestUpdated')
      }
    })

    onMounted(() => {
      $x.emit('AiComponentMounted', undefined, { feature: 'ai_carousel' })
    })

    useResizeObserver(titleRef, updateTitleOverflow)

    return {
      emptyTaggingRequest,
      isNoResults,
      isTitleOverflowing,
      queries,
      query,
      suggestionsSearch,
      tagging,
      title,
      titleExpanded,
      titleRef,
      toggleTitleExpansion,
    }
  },
})
</script>
<style lang="css">
.x-ai-carousel {
  --color: var(--x-ai-carousel-color, #bbc9cf);
  --color-lighter: var(--x-ai-carousel-color-lighter, color-mix(in srgb, var(--color) 25%, white));

  padding: 8px 0;
  position: relative;
  border-radius: 1.5rem;
  background-color: var(--color-lighter);
}

.x-ai-carousel-title {
  display: flex;
  font-size: 12px;
  gap: 8px;
  align-items: flex-start;
  margin: 0 14px 8px;
  cursor: pointer;
}
.x-ai-carousel-title-text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.x-ai-carousel-title-text--expanded {
  white-space: normal;
}
.x-ai-carousel-title-icon {
  height: 1rem;
  aspect-ratio: 1 / 1;
  color: var(--color);
  flex-shrink: 0;
  margin-bottom: auto;
}
.x-ai-carousel-title-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color);
  margin-bottom: auto;
}
.x-ai-carousel-title-button-icon {
  height: 1rem;
  aspect-ratio: 1 / 1;
  transition: transform 0.3s ease;
}
.x-ai-carousel-title-button-icon--expanded {
  transform: rotate(180deg);
}

.x-ai-carousel-suggestion {
  display: flex;
  gap: 8px;
}

.x-ai-carousel-suggestion-results {
  display: flex;
  gap: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>
