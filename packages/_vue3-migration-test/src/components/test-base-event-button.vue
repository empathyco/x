<template>
  <BaseEventButton :events="{ myEvent: 'myEventPayload' }">myEventButton</BaseEventButton>
</template>

<script setup lang="ts">
  import BaseEventButton from '../../../x-components/src/components/base-event-button.vue';
</script>
