<template>
  <div>
    <button @click="shouldRender = !shouldRender">Toggle</button>
    <Fade>
      <p v-if="shouldRender">León is southern Spain</p>
    </Fade>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import Fade from '../../../../x-components/src/components/animations/fade.vue';

  const shouldRender = ref(false);
</script>
