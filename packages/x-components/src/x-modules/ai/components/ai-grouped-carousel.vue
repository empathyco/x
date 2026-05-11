<template>
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
    <ul class="x-ai-carousel-suggestion-results">
      <DisplayClickProvider
        v-for="suggestion in suggestionsSearch"
        :key="suggestion.query"
        :tooling-display-tagging="tagging?.searchQueries[suggestion.query].toolingDisplayClick"
        :tooling-add2-cart-tagging="tagging?.searchQueries[suggestion.query].toolingDisplayAdd2Cart"
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
  </SlidingPanel>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { DisplayClickProvider, SlidingPanel } from '../../../components'
import { useState } from '../../../composables'

export default defineComponent({
  components: {
    DisplayClickProvider,
    SlidingPanel,
  },
  props: {
    /* The title text displayed */
    title: String,
    /* The classes added to the sliding panel. */
    slidingPanelClasses: String,
    /* The classes added to the sliding panel container. */
    slidingPanelContainerClasses: String,
    /* The classes added to the sliding panel buttons. */
    slidingPanelButtonsClasses: String,
  },
  setup() {
    const { suggestionsSearch, tagging } = useState('ai')

    return {
      suggestionsSearch,
      tagging,
    }
  },
})
</script>
