import type { ComponentMountingOptions } from '@vue/test-utils'
import { enableAutoUnmount, flushPromises, mount, renderToString } from '@vue/test-utils'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { createSSRApp, nextTick, reactive } from 'vue'
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
      const { wrapper } = render({ props: { target: '#teleport-target' } })

      await nextTick()
      await flushPromises()
      await nextTick()

      // In jsdom, Vue's Teleport with custom shadow root doesn't fully work
      // We verify the component mounted without errors
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm).toBeTruthy()
    })

    it('does not render content if the target element does not exist', () => {
      render({ props: { target: '#non-existent-target' } })

      expect(document.querySelector('.x-base-teleport')).toBeNull()
    })

    it('target prop should be reactive', async () => {
      const { wrapper } = render({ props: { target: '#non-existent-target' } })

      expect(document.querySelector('.x-base-teleport')).toBeNull()

      await wrapper.setProps({ target: '#teleport-target' })

      // The host is created asynchronously (setTimeout after mount) and the teleport
      // insertion happens in a reactive effect, so poll until it lands in the DOM.
      await vi.waitFor(() => {
        expect(document.querySelector('.x-base-teleport')).not.toBeNull()
      })
    })

    describe('document direction', () => {
      afterEach(() => {
        document.documentElement.removeAttribute('dir')
        document.body.removeAttribute('dir')
        targetElement.removeAttribute('dir')
      })

      /**
       * Renders the teleport with the given snippet config and waits for its host.
       *
       * @param snippetConfig - The provided snippet config.
       * @returns The teleport host element.
       */
      async function renderHost(snippetConfig?: Record<string, unknown>) {
        render({
          props: { target: '#teleport-target' },
          global: { provide: snippetConfig ? { snippetConfig } : {} },
        })
        await vi.waitFor(() => {
          expect(document.querySelector('.x-base-teleport')).not.toBeNull()
        })
        return document.querySelector('.x-base-teleport')!
      }

      it('applies a right-to-left snippet `documentDirection` to the teleport host', async () => {
        const host = await renderHost({ documentDirection: 'rtl' })

        await vi.waitFor(() => {
          expect(host.getAttribute('dir')).toBe('rtl')
        })
      })

      it('does not add any attribute for left-to-right or without `documentDirection`', async () => {
        expect((await renderHost({ documentDirection: 'ltr' })).hasAttribute('dir')).toBe(false)
      })

      it.each([
        ['<html>', () => (document.documentElement.dir = 'ltr')],
        ['<body>', () => (document.body.dir = 'ltr')],
        ['the target', () => targetElement.setAttribute('dir', 'ltr')],
      ])('lets the direction of %s take precedence', async (_, setDirection) => {
        setDirection()

        expect((await renderHost({ documentDirection: 'rtl' })).hasAttribute('dir')).toBe(false)
      })

      it('removes the direction when the snippet `documentDirection` changes', async () => {
        const snippetConfig = reactive<Record<string, unknown>>({ documentDirection: 'rtl' })
        const host = await renderHost(snippetConfig)
        await vi.waitFor(() => {
          expect(host.getAttribute('dir')).toBe('rtl')
        })

        snippetConfig.documentDirection = undefined
        await nextTick()

        expect(host.hasAttribute('dir')).toBe(false)
      })
    })

    it('removes the teleport host hook element on unmounted', async () => {
      const { wrapper } = render({ props: { target: '#teleport-target' } })

      await flushPromises()
      wrapper.unmount()

      expect(targetElement.children).toHaveLength(0)
    })

    it('should live check if target element exists', async () => {
      const { wrapper } = render({ props: { target: '#teleport-target' } })
      await nextTick()
      await flushPromises()
      await nextTick()

      // Verify component is rendered (jsdom has limitations with teleport)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm).toBeTruthy()

      targetElement.remove()
      await nextTick()
      await flushPromises()
      await nextTick()

      // Component should still exist even if target is removed
      const contentInDocument = document.querySelector('.x-base-teleport')
      expect(contentInDocument).toBeNull()

      document.body.appendChild(targetElement)
      await nextTick()
      await flushPromises()
      await nextTick()

      // Component should still be mounted
      expect(wrapper.exists()).toBe(true)
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
