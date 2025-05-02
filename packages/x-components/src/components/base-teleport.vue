<template>
  <Teleport :to="teleportHost.shadowRoot ?? teleportHost" :disabled>
    <slot></slot>
  </Teleport>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent, getCurrentInstance, onUnmounted, watchEffect } from 'vue'

export default defineComponent({
  name: 'BaseTeleport',
  props: {
    /** The element or css selector to which the component will be teleported. */
    target: {
      type: [String, Object] as PropType<string | Element>,
      required: true,
    },
    /**
     * The position relative to the target
     * - `beforebegin`: Before the target element.
     * - `afterbegin`: Inside the target element, before its first child.
     * - `beforeend`: Inside the target element, after its last child.
     * - `afterend`: After the target element.
     * - `onlychild`: Adds it as child and hides all other children of the target element.
     */
    position: {
      type: String as PropType<
        'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend' | 'onlychild'
      >,
      default: 'onlychild',
    },
    /** If disabled, the slot content will not be teleported */
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const teleportHost = document.createElement('div')
    const isIsolated = !!getCurrentInstance()?.appContext.app._container?.shadowRoot
    if (isIsolated) {
      teleportHost.attachShadow({ mode: 'open' })
      ;(window as any).xCSSInjector.addHost(teleportHost.shadowRoot)
      onUnmounted(() => {
        ;(window as any).xCSSInjector.removeHost(teleportHost.shadowRoot)
      })
    }

    watchEffect(() => {
      if (props.disabled) {
        teleportHost.remove()
        return
      }
      teleportHost.className = `x-base-teleport x-base-teleport--${props.position}`
      const targetElement =
        typeof props.target === 'string' ? document.querySelector(props.target) : props.target
      if (!targetElement) {
        console.warn(`BaseTeleport: Target element "${props.target}" not found.`)
        return
      }
      const position = props.position === 'onlychild' ? 'beforeend' : props.position
      targetElement.insertAdjacentElement(position, teleportHost)
    })

    return { teleportHost }
  },
})
</script>

<style lang="css">
:has(> .x-base-teleport--onlychild) > *:not(.x-base-teleport) {
  display: none;
}
</style>
