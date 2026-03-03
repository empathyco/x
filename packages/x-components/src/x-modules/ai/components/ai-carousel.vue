<template>
  <CollapseHeight>
    <div v-if="suggestionsSearch.length" class="x-ai-carousel">
      <DisplayEmitter
        :payload="tagging?.toolingDisplay ?? emptyTaggingRequest"
        :event-metadata="{
          feature: 'ai-carousel',
          displayOriginalQuery: query || 'ai-carousel-without-query',
          replaceable: false,
        }"
        data-test="ai-carousel-display-emitter"
      >
        <span class="x-ai-carousel-title" data-test="ai-carousel-title">
          <AIStarIcon class="x-ai-carousel-title-icon" /> {{ title }}
        </span>
      </DisplayEmitter>
      <slot name="sliding-panel" :results="suggestionsSearchResults">
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
          <div class="x-flex x-gap-8">
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
                result-feature="ai-carousel"
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
import { computed, defineComponent, watch } from 'vue'
import { AIStarIcon, CollapseHeight, DisplayClickProvider, SlidingPanel } from '../../../components'
import DisplayEmitter from '../../../components/display-emitter.vue'
import { use$x, useState } from '../../../composables'
import { aiXModule } from '../x-module'

export default defineComponent({
  xModule: aiXModule.name,
  components: {
    DisplayClickProvider,
    DisplayEmitter,
    CollapseHeight,
    AIStarIcon,
    SlidingPanel,
  },
  props: {
    /* The text displayed when the question ended loading */
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

    const suggestionsSearchResults = computed(() =>
      suggestionsSearch.value.flatMap(suggestion => suggestion.results),
    )

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

    return {
      title,
      query,
      queries,
      tagging,
      emptyTaggingRequest,
      isNoResults,
      suggestionsSearch,
      suggestionsSearchResults,
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
  align-items: center;
  margin: 0 14px 8px;
}
.x-ai-carousel-title-icon {
  height: 1rem;
  aspect-ratio: 1 / 1;
  color: var(--color);
  flex-shrink: 0;
  margin-bottom: auto;
}
.x-ai-carousel-suggestion-results {
  display: flex;
  gap: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>
