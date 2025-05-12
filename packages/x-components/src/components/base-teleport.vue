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
  watch,
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
    const targetElement = ref()

    const targetAddedObserver = new MutationObserver(targetAdded)
    const targetRemovedObserver = new MutationObserver(targetRemoved)

    onBeforeUnmount(() => {
      teleportHost.remove()
      targetAddedObserver.disconnect()
      targetRemovedObserver.disconnect()
    })

    const isIsolated =
      getCurrentInstance()?.appContext.app._container?.parentNode instanceof ShadowRoot
    if (isIsolated) {
      teleportHost.attachShadow({ mode: 'open' })
      ;(window as any).xCSSInjector.addHost(teleportHost.shadowRoot)
      onUnmounted(() => {
        ;(window as any).xCSSInjector.removeHost(teleportHost.shadowRoot)
      })
    }

    watch(
      () => props.target,
      newTarget => {
        targetAddedObserver.disconnect()
        targetRemovedObserver.disconnect()
        const target = typeof newTarget === 'string' ? document.querySelector(newTarget) : newTarget
        if (target?.isConnected) {
          targetAdded()
        } else {
          targetRemoved()
        }
      },
      { immediate: true },
    )

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

    /** Checks if the target element exists in the DOM and updates the observers */
    function targetAdded() {
      const target =
        typeof props.target === 'string' ? document.querySelector(props.target) : props.target
      if (target?.isConnected) {
        targetAddedObserver.disconnect()
        targetRemovedObserver.observe(target.parentElement!, { childList: true })
        targetElement.value = target
      }
    }

    /** Checks if the target was disconected from the DOM and updates the observers */
    function targetRemoved() {
      if (!targetElement.value?.isConnected) {
        targetRemovedObserver.disconnect()
        targetAddedObserver.observe(document.body, { childList: true, subtree: true })
        targetElement.value = undefined
      }
    }

    return { teleportHost }
  },
})
</script>

<style lang="css">
:has(> .x-base-teleport--onlychild) > *:not(.x-base-teleport) {
  display: none;
}
</style>
