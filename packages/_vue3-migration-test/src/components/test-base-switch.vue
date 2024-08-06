<template>
  <p>Using props and events:</p>
  <BaseSwitch @change="value = !value" :value="value" />
  {{ value }}
  <br />
  <p>Using the `v-model` directive:</p>
  <BaseSwitch v-model="value2" />
  {{ value2 }}
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  import BaseSwitch from '../../../x-components/src/components/base-switch.vue';

  const value = ref(true);
  const value2 = ref(true);
</script>
