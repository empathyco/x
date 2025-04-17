<template>
  <Teleport :to="target">
    <div class="x-base-teleport">
      <slot></slot>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'

export default defineComponent({
  name: 'BaseTeleport',
  props: {
    target: {
      type: String,
      required: true,
    },
    hideSiblings: {
      type: Boolean,
      default: true,
    },
    position: {
      type: Number,
      required: false,
    },
  },
  setup(props) {
    onMounted(() => {
      const parentElement = document.querySelector(props.target)
      const teleportElement = parentElement?.querySelector('.x-base-teleport')

      if (!props.hideSiblings) {
        if (parentElement && teleportElement) {
          if (props.position && props.position < parentElement.children.length) {
            parentElement.insertBefore(teleportElement, parentElement.children[props.position])
          } else {
            // Add as the last child
            parentElement.appendChild(teleportElement)
          }
        }
      } else {
        teleportElement?.classList.add('x-base-teleport__hide-siblings')
      }
    })
  },
})
</script>

<style lang="css">
:has(> .x-base-teleport__hide-siblings) > *:not(.x-base-teleport) {
  display: none;
}
</style>
