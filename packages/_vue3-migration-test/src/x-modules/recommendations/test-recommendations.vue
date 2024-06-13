<template>
  <Recommendations #layout="{ recommendations }">
    <BaseVariableColumnGrid #default="{ item: result }" :items="recommendations">
      <li>{{ result.id }}</li>
    </BaseVariableColumnGrid>
  </Recommendations>
</template>

<script setup>
  import Recommendations from '../../../../x-components/src/x-modules/recommendations/components/recommendations.vue';
  import BaseVariableColumnGrid from '../../../../x-components/src/components/base-variable-column-grid.vue';
</script>
