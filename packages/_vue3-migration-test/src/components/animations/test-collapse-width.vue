<template>
  <div>
    <button @click="open = !open">Toggle</button>
    <CollapseWidth>
      <p v-if="open">CollapseWidth</p>
    </CollapseWidth>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import CollapseWidth from '../../../../x-components/src/components/animations/collapse-width.vue';

  const open = ref(true);
</script>
