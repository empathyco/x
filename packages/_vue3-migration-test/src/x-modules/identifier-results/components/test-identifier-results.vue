<template>
  <IdentifierResults #default="{ identifierResult }" :maxItemsToRender="3">
    <IdentifierResult :result="identifierResult" />
  </IdentifierResults>
</template>

<script setup>
  import IdentifierResults from '../../../../../x-components/src/x-modules/identifier-results/components/identifier-results.vue';
  import IdentifierResult from '../../../../../x-components/src/x-modules/identifier-results/components/identifier-result.vue';
</script>
