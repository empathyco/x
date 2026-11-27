import { mount } from '@vue/test-utils'
import { createPinia, defineStore } from 'pinia'
import { afterEach, describe, expect, it } from 'vitest'
import { installNewXPlugin } from '../../__tests__/utils'
import { createFixtureXModule } from '../../store/pinia/__tests__/pinia-test.utils'
import { XPlugin } from '../x-plugin'

/**
 * Mounts an empty component installing the XPlugin and, optionally, other plugins before it.
 *
 * @param plugins - Plugins to install before the XPlugin.
 * @param xPluginOptions - Options to install the XPlugin with.
 * @param withPiniaModule - Whether a module with a Pinia store is registered.
 * @returns The mounted wrapper.
 */
function mountWithXPlugin(
  plugins: any[] = [],
  xPluginOptions: Record<string, unknown> = {},
  withPiniaModule = false,
) {
  return mount(
    { template: '<div/>' },
    {
      global: {
        plugins: [
          ...plugins,
          installNewXPlugin({
            ...(withPiniaModule ? { initialXModules: [createFixtureXModule(true)] } : {}),
            ...xPluginOptions,
          }),
        ],
      },
    },
  )
}

describe('xPlugin pinia instance', () => {
  afterEach(() => {
    XPlugin.resetInstance()
  })

  it('does not create any instance when no module uses pinia', () => {
    const wrapper = mountWithXPlugin()

    expect(XPlugin.pinia).toBeUndefined()
    expect(wrapper.vm.$.appContext.config.globalProperties.$pinia).toBeUndefined()
  })

  it('creates a private instance for the first pinia module, without installing it in the app', () => {
    const wrapper = mountWithXPlugin([], {}, true)

    expect(XPlugin.pinia).toBeDefined()
    expect(wrapper.vm.$.appContext.config.globalProperties.$pinia).toBeUndefined()
  })

  it('reuses the instance installed in the app by the host without installing it again', () => {
    const hostPinia = createPinia()
    let installCalls = 0
    const originalInstall = hostPinia.install.bind(hostPinia)
    hostPinia.install = app => {
      installCalls++
      originalInstall(app)
    }

    const wrapper = mountWithXPlugin([hostPinia], {}, true)

    expect(XPlugin.pinia).toBe(hostPinia)
    expect(installCalls).toBe(1)
    expect(wrapper.vm.$.appContext.config.globalProperties.$pinia).toBe(hostPinia)
  })

  it('uses the instance passed in the options without installing it in the app', () => {
    const pinia = createPinia()
    const wrapper = mountWithXPlugin([], { pinia })

    expect(XPlugin.pinia).toBe(pinia)
    expect(wrapper.vm.$.appContext.config.globalProperties.$pinia).toBeUndefined()
  })

  it('gives priority to the instance passed in the options over the installed one', () => {
    const hostPinia = createPinia()
    const optionPinia = createPinia()
    mountWithXPlugin([hostPinia], { pinia: optionPinia })

    expect(XPlugin.pinia).toBe(optionPinia)
  })

  it('throws when accessing the instance before installing the plugin', () => {
    XPlugin.resetInstance()

    expect(() => XPlugin.pinia).toThrow("XPlugin must be installed before accessing it's API.")
  })

  it('disposes the private instance when resetting the plugin', () => {
    mountWithXPlugin([], {}, true)
    const pinia = XPlugin.pinia!
    defineStore('host-store-a', { state: () => ({ value: 'value-1' }) })(pinia)
    expect(pinia.state.value['x/searchBox']).toBeDefined()

    XPlugin.resetInstance()

    expect(pinia.state.value).toEqual({})
  })

  it('only removes its own stores from the instance of the host when resetting the plugin', () => {
    const hostPinia = createPinia()
    mountWithXPlugin([hostPinia], {}, true)
    defineStore('host-store-a', { state: () => ({ value: 'value-1' }) })(hostPinia).value =
      'value-2'
    expect(hostPinia.state.value['x/searchBox']).toBeDefined()

    XPlugin.resetInstance()

    expect(hostPinia.state.value['host-store-a']).toEqual({ value: 'value-2' })
    expect(hostPinia.state.value['x/searchBox']).toBeUndefined()
  })
})
