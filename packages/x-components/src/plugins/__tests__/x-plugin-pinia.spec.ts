import { mount } from '@vue/test-utils'
import { createPinia, defineStore } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { installNewXPlugin } from '../../__tests__/utils'
import { XPlugin } from '../x-plugin'

/**
 * Mounts an empty component installing the XPlugin and, optionally, other plugins before it.
 *
 * @param plugins - Plugins to install before the XPlugin.
 * @param xPluginOptions - Options to install the XPlugin with.
 * @returns The mounted wrapper.
 */
function mountWithXPlugin(plugins: any[] = [], xPluginOptions: Record<string, unknown> = {}) {
  return mount(
    { template: '<div/>' },
    { global: { plugins: [...plugins, installNewXPlugin(xPluginOptions)] } },
  )
}

describe('xPlugin pinia instance', () => {
  afterEach(() => {
    XPlugin.resetInstance()
  })

  it('creates a private instance when the host has none, without installing it in the app', () => {
    const wrapper = mountWithXPlugin()

    expect(XPlugin.pinia).toBeDefined()
    expect(wrapper.vm.$.appContext.config.globalProperties.$pinia).toBeUndefined()
  })

  it('reuses the instance installed in the app by the host without installing it again', () => {
    const hostPinia = createPinia()
    const wrapper = mountWithXPlugin([hostPinia])
    const installSpy = vi.spyOn(hostPinia, 'install')

    expect(XPlugin.pinia).toBe(hostPinia)
    expect(installSpy).not.toHaveBeenCalled()
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
    mountWithXPlugin()
    const pinia = XPlugin.pinia
    const useStore = defineStore('host-store-a', { state: () => ({ value: 'value-1' }) })
    useStore(pinia)
    expect(pinia.state.value['host-store-a']).toBeDefined()

    XPlugin.resetInstance()

    expect(pinia.state.value).toEqual({})
  })

  it('does not touch the instance of the host when resetting the plugin', () => {
    const hostPinia = createPinia()
    mountWithXPlugin([hostPinia])
    const useStore = defineStore('host-store-a', { state: () => ({ value: 'value-1' }) })
    useStore(hostPinia).value = 'value-2'

    XPlugin.resetInstance()

    expect(hostPinia.state.value['host-store-a']).toEqual({ value: 'value-2' })
  })
})
