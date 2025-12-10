import type { Directive } from 'vue'

/**
 * TypingOptions interface.
 *
 * @public
 */
export interface TypingOptions {
  /**
   * The text (plain or html) that will be typed into the target element.
   */
  text: string
  /**
   * The typing speed in milliseconds per character.
   *
   */
  speed?: number
  /**
   * The attribute of the HTML element where the typed text will be placed.
   * If not specified, the text will be set as content (innerHTML).
   *
   * @example 'placeholder'
   */
  targetAttr?: string
}

export interface TypingHTMLElement extends HTMLElement {
  __timeoutId?: number
}

/**
 * Typing directive.
 *
 * @public
 */
export const typing: Directive<TypingHTMLElement, TypingOptions> = {
  mounted(el, binding) {
    execute(el, binding.value)
  },

  updated(el, binding) {
    if (binding.value.text !== binding.oldValue?.text) {
      clearTimeout(el.__timeoutId)
      execute(el, binding.value)
    }
  },

  unmounted(el) {
    clearTimeout(el.__timeoutId)
  },
}

/**
 * Execute a typing animation in an HTML element.
 *
 * @param el - The HTML element where the typing animation will be displayed.
 * @param options - Options for the behavior of the animation.
 */
function execute(el: TypingHTMLElement, options: TypingOptions) {
  const { text, speed = 1, targetAttr = '' } = options

  if (!text) {
    console.error('v-typing: "text" is required.')
    return
  }

  let index = 0

  const updateContent = (value: string) => {
    if (targetAttr) {
      el.setAttribute(targetAttr, value)
    } else {
      el.innerHTML = value
    }
  }

  const type = () => {
    if (index < text.length) {
      updateContent(text.slice(0, index + 1))
      index++
      el.__timeoutId = setTimeout(type, speed) as unknown as number
    } else {
      updateContent(text)
      clearTimeout(el.__timeoutId)
      el.__timeoutId = undefined
    }
  }

  type()
}
