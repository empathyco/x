import type { SnippetConfig } from '../x-installer'

/**
 * Creates a DOM element to mount the X Components app.
 *
 * @param snippetConfig - The snippet configuration.
 * @param snippetConfig.isolate - Whether to isolate the DOM element using Shadow DOM.
 * @returns The DOM element.
 */
export function createXRoot({ isolate }: SnippetConfig): ShadowRoot | HTMLElement {
  const container = document.createElement('div')
  container.classList.add('x-root-container')
  document.body.appendChild(container)

  // Isolated by default
  if (isolate !== false) {
    const shadowRoot = container.attachShadow({ mode: 'open' })
    return shadowRoot
  } else {
    return container
  }
}
