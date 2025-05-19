import type { ComponentMountingOptions } from '@vue/test-utils'
import { enableAutoUnmount, flushPromises, mount, renderToString } from '@vue/test-utils'
import { createSSRApp } from 'vue'
import BaseTeleport from '../base-teleport.vue'

/**
 * Renders the `BaseTeleport` component, exposing a basic API for testing.
 *
 * @param options - The options to render the component with.
 * @param options.target - The target element to teleport the content to.
 * @param options.slotContent - The content to be teleported.
 * @returns The API for testing the `BaseTeleport` component.
 */
function render(options: ComponentMountingOptions<typeof BaseTeleport> = {}) {
  options.slots ??= {}
  options.slots = { default: 'Teleport Content', ...options.slots }

  const wrapper = mount(BaseTeleport, options)

  return { wrapper }
}

describe('testing BaseTeleport component', () => {
  enableAutoUnmount(afterEach)
  describe('client side rendering (CSR)', () => {
    let targetElement: HTMLElement

    beforeAll(() => {
      targetElement = document.createElement('div')
      targetElement.id = 'teleport-target'
      document.body.appendChild(targetElement)
    })

    it('renders content in the target element', async () => {
      render({ props: { target: '#teleport-target' } })

      await flushPromises()

      expect(targetElement.querySelector('.x-base-teleport')).not.toBeNull()
      expect(targetElement.textContent).toContain('Teleport Content')
    })

    it('does not render content if the target element does not exist', () => {
      render({ props: { target: '#non-existent-target' } })

      expect(document.querySelector('.x-base-teleport')).toBeNull()
    })

    it('target prop should be reactive', async () => {
      const { wrapper } = render({ props: { target: '#non-existent-target' } })

      expect(document.querySelector('.x-base-teleport')).toBeNull()

      await wrapper.setProps({ target: '#teleport-target' })
      await flushPromises()

      expect(document.querySelector('.x-base-teleport')).not.toBeNull()
    })

    it('removes the teleport host hook element on unmounted', async () => {
      const { wrapper } = render({ props: { target: '#teleport-target' } })

      await flushPromises()
      wrapper.unmount()

      expect(targetElement.children).toHaveLength(0)
    })

    it('should live check if target element exists', async () => {
      render({ props: { target: '#teleport-target' } })
      await flushPromises()
      expect(document.querySelector('.x-base-teleport')).not.toBeNull()

      targetElement.remove()
      await flushPromises()
      expect(document.querySelector('.x-base-teleport')).toBeNull()
      // FIXME it should remove hook element from target if it is removed from the DOM
      //expect(targetElement.querySelector('.x-base-teleport')).toBeNull()

      document.body.appendChild(targetElement)
      await flushPromises()
      expect(document.querySelector('.x-base-teleport')).not.toBeNull()
      expect(targetElement.querySelector('.x-base-teleport')).not.toBeNull()
    })
  })
  describe('server side rendering (SSR)', () => {
    it('not renders content', async () => {
      render({ target: '#teleport-target' })
      const app = createSSRApp(BaseTeleport, {
        target: '#teleport-target',
        slots: {
          default: 'Teleport Content',
        },
      })
      const vueEmptyNodePlaceholder = '<!---->'
      const html = await renderToString(app)
      expect(html).toBe(vueEmptyNodePlaceholder)
    })
  })
})
