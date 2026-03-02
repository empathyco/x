<template>
  <div class="xds:flex xds:flex-col xds:gap-40">
    <Button />
    <ButtonGroup />
    <Icon />
    <Highlight />
    <Input />
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
import Input from './components/input.vue'
import Integration from './components/integration.vue'
import ProgressBar from './components/progress-bar.vue'
import Typography from './components/typography.vue'
</script>
