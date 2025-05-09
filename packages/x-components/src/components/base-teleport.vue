<template>
  <Teleport :to="teleportHost.shadowRoot ?? teleportHost" :disabled>
    <slot></slot>
  </Teleport>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import {
  defineComponent,
  getCurrentInstance,
  onBeforeUnmount,
  onUnmounted,
  ref,
  watchEffect,
} from 'vue'

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
    const targetElement = ref(
      typeof props.target === 'string' ? document.querySelector(props.target) : props.target,
    )

    let targetAddedObserver: MutationObserver

    const targetRemovedObserver = new MutationObserver(() => {
      if (!targetElement.value?.isConnected) {
        targetRemovedObserver.disconnect()
        targetAddedObserver.observe(document.body, { childList: true, subtree: true })
        targetElement.value = null
      }
    })

    targetAddedObserver = new MutationObserver(() => {
      const target =
        typeof props.target === 'string' ? document.querySelector(props.target) : props.target
      if (target?.isConnected) {
        targetAddedObserver.disconnect()
        targetRemovedObserver.observe(target.parentElement!, { childList: true })
        targetElement.value = target
      }
    })

    if (targetElement.value) {
      targetRemovedObserver.observe(targetElement.value.parentElement!, {
        childList: true,
      })
    } else {
      targetAddedObserver.observe(document.body, { childList: true, subtree: true })
    }

    onBeforeUnmount(() => {
      teleportHost.remove()
      targetAddedObserver.disconnect()
      targetRemovedObserver.disconnect()
    })

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

      if (!targetElement.value) {
        console.warn(`BaseTeleport: Target element "${props.target}" not found.`)
        return
      }
      const position = props.position === 'onlychild' ? 'beforeend' : props.position
      targetElement.value.insertAdjacentElement(position, teleportHost)
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
