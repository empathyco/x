<template>
  <div>
    <button @click="open = !open">Toggle</button>
    <CollapseHeight>
      <p v-if="open">CollapseHeight</p>
    </CollapseHeight>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import CollapseHeight from '../../../../x-components/src/components/animations/collapse-height.vue';

  const open = ref(true);
</script>
