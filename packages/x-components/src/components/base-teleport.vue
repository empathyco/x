<template>
  <Teleport :to="`.${teleportTarget}`">
    <slot></slot>
  </Teleport>
</template>

<script lang="ts">
import { computed, defineComponent, useId } from 'vue'

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
    const id = useId()
    const parentElement = document.querySelector(props.target)

    const teleportTarget = computed(() => `x-base-teleport--${id}`)

    if (parentElement) {
      const newTeleportElement = document.createElement('div')
      newTeleportElement.classList.add(teleportTarget.value)
      newTeleportElement.classList.add('x-base-teleport')
      if (props.hideSiblings) {
        newTeleportElement.classList.add('x-base-teleport--hide-siblings')
      }

      const children = parentElement.children
      const position = props.position ?? -1

      if (position >= children.length || position === -1) {
        parentElement.appendChild(newTeleportElement)
      } else {
        parentElement.insertBefore(newTeleportElement, children[position])
      }
    }

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
