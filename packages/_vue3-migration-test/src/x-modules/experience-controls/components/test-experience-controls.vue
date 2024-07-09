<template>
  <span style="display: block">
    Controls:
    <b>{{ controls }}</b>
  </span>
  <SnippetConfigExtraParams :values="{ catalog: 'empathy' }" />
  <ExperienceControls />
  SemanticQueriesConfigProvided with {{ message }}
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import ExperienceControls from '../../../../../x-components/src/x-modules/experience-controls/components/experience-controls.vue';
  import { useState } from '../../../../../x-components/src/composables/use-state';
  import { useXBus } from '../../../../../x-components/src/composables/use-x-bus';
  import SnippetConfigExtraParams from '../../../../../x-components/src/x-modules/extra-params/components/snippet-config-extra-params.vue';
  import { XEvent } from '../../../../../x-components/src/wiring/events.types';

  const xBus = useXBus();
  const message = ref('');

  xBus
    .on('SemanticQueriesConfigProvided' as XEvent, true)
    .subscribe(event => (message.value = event.eventPayload as string));

  const { controls } = useState('experienceControls', ['controls']);
</script>
