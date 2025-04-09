<template>
  <Teleport :to="target">
    <div class="x-base-teleport-container" :class="containerClasses">
      <slot></slot>
    </div>
  </Teleport>
</template>

<script lang="ts">
  import { defineComponent, ref, watch, onMounted, computed } from 'vue';

  export default defineComponent({
    name: 'BaseTeleport',
    props: {
      target: {
        type: String,
        required: true
      },
      hideTargetContent: {
        type: Boolean,
        default: false
      }
    },
    setup(props) {
      const targetElement = ref<HTMLElement>();

      const containerClasses = computed(() => ({
        'x-base-teleport-container--hide-siblings': props.hideTargetContent
      }));

      const updateVisibility = () => {
        if (!props.hideTargetContent) {
          targetElement.value?.classList.add('x-base-teleport-parent-container');
        } else {
          targetElement.value?.classList.remove('x-base-teleport-parent-container');
        }
      };

      onMounted(() => {
        targetElement.value = document.querySelector(props.target);

        updateVisibility();
      });

      watch(() => props.hideTargetContent, updateVisibility);

      return {
        containerClasses
      };
    }
  });
</script>

<style lang="css">
  :has(> .x-base-teleport-container--hide-siblings) > *:not(.x-base-teleport-container) {
    display: none;
  }
</style>
