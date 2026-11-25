<template>
  <div class="xds:flex xds:flex-col xds:gap-40">
    <button
      class="xds:fixed xds:end-16 xds:top-16 xds:z-10 xds:button xds:button-sm xds:button-lead"
      data-test="toggle-direction"
      @click="toggleDirection"
    >
      dir: {{ direction }}
    </button>
    <Layout />
    <Button />
    <ButtonGroup />
    <FilterFacet />
    <Icon />
    <Highlight />
    <Input />
    <InputGroup />
    <Suggestion />
    <SuggestionGroup />
    <SlidingPanel />
    <Picture />
    <Scroll />
    <Tag />
    <Tabs />
    <Badge />
    <FilterFacet />
    <ProgressBar />
    <Typography />
    <Integration />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Badge from './components/badge.vue'
import ButtonGroup from './components/button-group.vue'
import Button from './components/button.vue'
import FilterFacet from './components/filter-facet.vue'
import Highlight from './components/highlight.vue'
import Icon from './components/icon.vue'
import InputGroup from './components/input-group/index.vue'
import Input from './components/input.vue'
import Integration from './components/integration.vue'
import Layout from './components/layout/index.vue'
import Picture from './components/picture.vue'
import ProgressBar from './components/progress-bar.vue'
import Scroll from './components/scroll.vue'
import SlidingPanel from './components/sliding-panel/index.vue'
import SuggestionGroup from './components/suggestion-group/index.vue'
import Suggestion from './components/suggestion.vue'
import Tabs from './components/tabs.vue'
import Tag from './components/tag.vue'
import Typography from './components/typography.vue'

const direction = ref<'ltr' | 'rtl'>('ltr')

/** Toggles the document direction to review every component in right-to-left. */
function toggleDirection() {
  direction.value = direction.value === 'ltr' ? 'rtl' : 'ltr'
  document.documentElement.dir = direction.value
}
</script>
