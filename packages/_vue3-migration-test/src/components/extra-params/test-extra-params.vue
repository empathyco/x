<template>
  <SnippetConfigExtraParams :values="{ catalog: 'empathy' }" />
  {{ params }}
</template>
<script setup lang="ts">
  import { provide } from 'vue';
  import SnippetConfigExtraParams from '../../../../x-components/src/x-modules/extra-params/components/snippet-config-extra-params.vue';
  import { useState } from '../../../../x-components/src/composables/use-state';
  const snippetConfig = window.InterfaceX?.getSnippetConfig();
  provide('snippetConfig', snippetConfig);
  const { params } = useState('extraParams', ['params']);
  window.InterfaceX?.setSnippetConfig({ store: 'demo', lang: 'es', warehouse: 1234 });
</script>
