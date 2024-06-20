<template>
  <SnippetConfigExtraParams />
  {{ snippetConfig }}
</template>
<script setup lang="ts">
  import SnippetConfigExtraParams from '../../../../x-components/src/x-modules/extra-params/components/snippet-config-extra-params.vue';
  const snippetConfig = window.InterfaceX?.getSnippetConfig();
</script>
