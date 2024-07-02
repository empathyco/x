<template>
  <span style="display: block">
    Controls:
    <b>{{ controls }}</b>
  </span>
  <ExperienceControls />
  <div v-for="(item, index) in items" :key="index">
    <div>This is an item {{ item }}-{{ index }}</div>
  </div>
</template>

<script setup>
  import ExperienceControls from '../../../../../x-components/src/x-modules/experience-controls/components/experience-controls.vue';
  import { useState } from '../../../../../x-components/src/composables/use-state.ts';

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const { controls } = useState('experienceControls', ['controls']);
  const items = controls.value.resultsPerCarousels;
</script>
