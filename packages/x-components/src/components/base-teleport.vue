<template>
  <Teleport v-if="teleportHost" :to="teleportHost.shadowRoot ?? teleportHost" :disabled>
    <slot></slot>
  </Teleport>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent, getCurrentInstance, onMounted, onUnmounted, ref, watchEffect } from 'vue'

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
    const teleportHost = ref<HTMLElement>()
    const instance = getCurrentInstance()
    let isIsolated = false

    if (instance?.appContext.app._container?.parentNode) {
      createHost()
    } else {
      afterAppMount(createHost)
    }

    onUnmounted(() => {
      if (isIsolated && teleportHost.value) {
        ;(window as any).xCSSInjector.removeHost(teleportHost.value.shadowRoot)
      }
    })

    watchEffect(() => {
      if (!teleportHost.value) {
        return
      }
      if (props.disabled) {
        teleportHost.value.remove()
        return
      }
      teleportHost.value.className = `x-base-teleport x-base-teleport--${props.position}`
      const targetElement =
        typeof props.target === 'string' ? document.querySelector(props.target) : props.target
      if (!targetElement) {
        console.warn(`BaseTeleport: Target element "${props.target}" not found.`)
        return
      }
      const position = props.position === 'onlychild' ? 'beforeend' : props.position
      targetElement.insertAdjacentElement(position, teleportHost.value)
    })

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
