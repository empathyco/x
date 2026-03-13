<template>
  <div class="xds:flex xds:flex-col xds:gap-40">
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
    <Badge />
    <FilterFacet />
    <ProgressBar />
    <Typography />
    <Integration />
  </div>
</template>

<script setup lang="ts">
import Badge from './components/badge.vue'
import ButtonGroup from './components/button-group.vue'
import Button from './components/button.vue'
import FilterFacet from './components/filter-facet.vue'
import Highlight from './components/highlight.vue'
import Icon from './components/icon.vue'
import InputGroup from './components/input-group/index.vue'
import Input from './components/input.vue'
import Integration from './components/integration.vue'
import Picture from './components/picture.vue'
import ProgressBar from './components/progress-bar.vue'
import Scroll from './components/scroll.vue'
import SlidingPanel from './components/sliding-panel/index.vue'
import SuggestionGroup from './components/suggestion-group/index.vue'
import Suggestion from './components/suggestion.vue'
import Tag from './components/tag.vue'
import Typography from './components/typography.vue'
</script>
