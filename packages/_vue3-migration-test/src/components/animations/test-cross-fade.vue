<template>
  <div>
    <button @click="open = !open">Toggle</button>
    <CrossFade>
      <p v-if="open">CrossFade</p>
    </CrossFade>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import CrossFade from '../../../../x-components/src/components/animations/cross-fade.vue';

  const open = ref(true);
</script>
