<template>
  <div>
    <button @click="visible = !visible">Toggle</button>
    <AnimateWidth>
      <div v-if="visible" style="width: 300px">Element to animate</div>
    </AnimateWidth>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import AnimateWidth from '../../../../x-components/src/components/animations/animate-width.vue';

  const visible = ref(true);
</script>
