<template>
  <Teleport :to="target">
    <div v-if="visible" class="x-base-teleport">
      <slot></slot>
    </div>
  </Teleport>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'BaseTeleport',
    props: {
      target: {
        type: String,
        required: true
      },
      visible: {
        type: Boolean,
        default: false
      }
    }
  });
</script>

<style lang="css">
  :has(> .x-base-teleport) > *:not(.x-base-teleport) {
    display: none;
  }
</style>
