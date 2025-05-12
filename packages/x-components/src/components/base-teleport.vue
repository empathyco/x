<template>
  <Teleport v-if="teleportHost" :to="teleportHost.shadowRoot ?? teleportHost" :disabled>
    <slot></slot>
  </Teleport>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import {
  defineComponent,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
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
    const instance = getCurrentInstance()
    const teleportHost = ref<Element>()
    const targetElement = ref<Element>()
    let isIsolated = false

    if (instance?.appContext.app._container?.parentNode) {
      createHost()
    } else {
      afterAppMount(createHost)
    }

    const targetAddedObserver = new MutationObserver(targetAdded)
    const targetRemovedObserver = new MutationObserver(targetRemoved)

    onUnmounted(() => {
      if (isIsolated && teleportHost.value) {
        ;(window as any).xCSSInjector.removeHost(teleportHost.value.shadowRoot)
      }
    })

    onBeforeUnmount(() => {
      targetAddedObserver.disconnect()
      targetRemovedObserver.disconnect()
      teleportHost.value?.remove()
    })

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
      if (!teleportHost.value) {
        return
      }
      if (props.disabled) {
        teleportHost.value.remove()
        return
      }
      teleportHost.value.className = `x-base-teleport x-base-teleport--${props.position}`

      if (!targetElement.value) {
        console.warn(`BaseTeleport: Target element "${props.target}" not found.`)
        return
      }
      const position = props.position === 'onlychild' ? 'beforeend' : props.position
      targetElement.value.insertAdjacentElement(position, teleportHost.value)
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

    /** Creates and sets the teleport host element */
    function createHost() {
      teleportHost.value = document.createElement('div')
      isIsolated = instance?.appContext.app._container?.parentNode instanceof ShadowRoot
      if (isIsolated) {
        teleportHost.value.attachShadow({ mode: 'open' })
        ;(window as any).xCSSInjector.addHost(teleportHost.value.shadowRoot)
      }
    }

    function afterAppMount(fn: () => void) {
      onMounted(() => setTimeout(fn, 0))
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
