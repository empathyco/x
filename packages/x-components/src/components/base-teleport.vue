<template>
  <Teleport :to="`.${teleportTarget}`">
    <slot></slot>
  </Teleport>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'

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
    const parentElement = document.querySelector(props.target)

    const teleportTarget = computed(() => `x-base-teleport--${props.target.replace(/[.#]/g, '')}`)

    if (parentElement) {
      const newTeleportElement = document.createElement('div')
      newTeleportElement.classList.add(teleportTarget.value)
      newTeleportElement.classList.add('x-base-teleport')

      const children = parentElement.children
      const position = props.position ?? -1

      if (position >= children.length || position === -1) {
        parentElement.appendChild(newTeleportElement)
      } else {
        parentElement.insertBefore(newTeleportElement, children[position])
      }
    }
    onMounted(() => {
      const teleportElement = parentElement?.querySelector('.x-base-teleport')

      if (props.hideSiblings) {
        teleportElement?.classList.add('x-base-teleport--hide-siblings')
      }
    })

    return {
      teleportTarget,
    }
  },
})
</script>

<style lang="css">
:has(> .x-base-teleport--hide-siblings) > *:not(.x-base-teleport) {
  display: none;
}
</style>
