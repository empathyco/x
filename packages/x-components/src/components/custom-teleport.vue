<template>
  <Teleport :to="target">
    <div ref="teleportContainer" class="x-teleport-container" :class="containerClasses">
      <slot></slot>
    </div>
  </Teleport>
</template>

<script lang="ts">
  import { defineComponent, ref, watch, onMounted, computed } from 'vue';

  export default defineComponent({
    name: 'CustomTeleport',
    props: {
      target: {
        type: String,
        required: true
      },
      hideTeleportContent: {
        type: Boolean,
        default: false
      }
    },
    setup(props) {
      const teleportContainer = ref<HTMLElement | null>(null);
      const targetElement = ref<HTMLElement | null>(null);

      const containerClasses = computed(() => ({
        'x-teleport-container--hidden': props.hideTeleportContent
      }));

      const updateVisibility = () => {
        if (!targetElement.value) {
          return;
        }

        if (!props.hideTeleportContent) {
          targetElement.value.classList.add('x-teleport-parent-container');
        } else {
          targetElement.value.classList.remove('x-teleport-parent-container');
        }
      };

      onMounted(() => {
        targetElement.value = document.querySelector(props.target);

        updateVisibility();
      });

      watch(() => props.hideTeleportContent, updateVisibility);

      return {
        teleportContainer,
        containerClasses
      };
    }
  });
</script>

<style lang="css">
  .x-teleport-parent-container > *:not(.x-teleport-container) {
    display: none;
  }

  .x-teleport-container--hidden {
    display: none;
  }
</style>
