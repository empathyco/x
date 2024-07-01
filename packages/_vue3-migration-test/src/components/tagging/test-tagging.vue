<template>
  <label for="consent">
    Consent
    <input v-model="consent" id="consent" type="checkbox" />
  </label>
  <br />

  <label for="clickedResultStorageTTLMs">
    clickedResultStorageTTLMs
    <input v-model="clickedResultStorageTTLMs" id="clickedResultStorageTTLMs" type="number" />
  </label>
  <br />

  <label for="clickedResultStorageKey">
    clickedResultStorageKey
    <input v-model="clickedResultStorageKey" id="clickedResultStorageKey" />
  </label>
  <br />

  <label for="sessionTTLMs">
    sessionTTLMs
    <input v-model="sessionTTLMs" id="sessionTTLMs" type="number" />
  </label>
  <br />

  <label for="queryTaggingDebounceMs">
    queryTaggingDebounceMs
    <input v-model="queryTaggingDebounceMs" id="queryTaggingDebounceMs" type="number" />
  </label>
  <br />

  <Tagging
    :consent="consent"
    :clickedResultStorageTTLMs="clickedResultStorageTTLMs"
    :clickedResultStorageKey="clickedResultStorageKey"
    :sessionTTLMs="sessionTTLMs"
    :queryTaggingDebounceMs="queryTaggingDebounceMs"
  />
  <ul>
    <li v-for="(elem, index) of list" :key="index">
      {{ elem }}
    </li>
  </ul>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import Tagging from '../../../../x-components/src/x-modules/tagging/components/tagging.vue';
  import { useXBus } from '../../../../x-components/src/composables/use-x-bus';

  const xBus = useXBus();

  const list = ref<string[]>([]);

  const consent = ref(false);

  const clickedResultStorageTTLMs = ref();
  const clickedResultStorageKey = ref();
  const sessionTTLMs = ref();
  const queryTaggingDebounceMs = ref();

  xBus.on('ConsentProvided', true).subscribe(event => {
    list.value.push(`ConsentProvided emited: ${JSON.stringify(event.eventPayload)}`);
  });

  xBus.on('TaggingConfigProvided', true).subscribe(event => {
    list.value.push(`TaggingConfigProvided emited: ${JSON.stringify(event.eventPayload)}`);
  });
</script>
