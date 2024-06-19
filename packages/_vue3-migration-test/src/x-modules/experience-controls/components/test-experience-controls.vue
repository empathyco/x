<template>
  <span style="display: block">
    Controls:
    <b>{{ experienceControls }}</b>
  </span>
  <ExperienceControls />
  <div v-for="(item, index) in items" :key="index">
    <div>{{ item }}-{{ index }}</div>
  </div>
</template>

<script setup>
  import ExperienceControls from '../../../../../x-components/src/x-modules/experience-controls/components/experience-controls.vue';
  import { useState } from '../../../../../x-components/src';

  const experienceControls = useState('experienceControls', ['controls']);
  const items = experienceControls.resultsPerCarousels;
</script>
