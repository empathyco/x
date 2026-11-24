import type { FixtureState } from '../../store/pinia/__tests__/pinia-test.utils'
import type { XPluginOptions } from '../x-plugin.types'
import { mount } from '@vue/test-utils'
import { createPinia, getActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { createStore, Store } from 'vuex'
import { installNewXPlugin, resetStoreXModuleState } from '../../__tests__/utils'
import {
  createFixtureState,
  createFixtureXModule,
} from '../../store/pinia/__tests__/pinia-test.utils'
import { namespacedWireCommit } from '../../wiring/namespaced-wires.factory'
import { XPlugin } from '../x-plugin'

type Backend = 'vuex' | 'pinia'

function installWithModule(
  backend: Backend,
  options: Partial<XPluginOptions> = {},
  plugins: any[] = [],
) {
  const xModule = createFixtureXModule(backend === 'pinia')
  xModule.wiring = {
    UserIsTypingAQuery: { setQuery: namespacedWireCommit('searchBox')('setQuery') },
  }
  return mount(
    { template: '<div/>' },
    {
      global: {
        plugins: [...plugins, installNewXPlugin({ initialXModules: [xModule], ...options })],
      },
    },
  )
}

function getModuleState() {
  return XPlugin.store.state.x.searchBox as unknown as FixtureState
}

async function waitNextTick(): Promise<void> {
  await nextTick()
  vi.runAllTimers()
}

describe.each<Backend>(['vuex', 'pinia'])('xPlugin with the %s backend', backend => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    XPlugin.resetInstance()
  })

  it('exposes the initial state, commits, dispatches and getters through the store', async () => {
    installWithModule(backend)
    expect(getModuleState()).toEqual(createFixtureState())

    XPlugin.store.commit('x/searchBox/setQuery', 'query-1')

    expect(getModuleState().query).toBe('query-1')
    expect(XPlugin.store.getters['x/searchBox/upperQuery']).toBe('QUERY-1')
    await expect(XPlugin.store.dispatch('x/searchBox/fetchSomething')).resolves.toBe('done-1')
  })

  it('runs the wires of the module', async () => {
    installWithModule(backend)

    void XPlugin.bus.emit('UserIsTypingAQuery', 'query-1')
    await nextTick()

    expect(getModuleState().query).toBe('query-1')
  })

  it('applies the config and the private state options', () => {
    installWithModule(backend, {
      xModules: { searchBox: { config: { section: 'section-b' } as any } },
      __PRIVATE__xModules: { searchBox: { storeModule: { state: { query: 'query-1' } } as any } },
    })

    expect(getModuleState()).toEqual({
      query: 'query-1',
      params: {},
      config: { section: 'section-b' },
    })
  })

  it('allows to reset the state with the test helper', () => {
    installWithModule(backend)

    resetStoreXModuleState(
      XPlugin.store as any,
      'searchBox',
      createFixtureState() as any,
      {
        query: 'query-2',
      } as any,
    )
    expect(getModuleState().query).toBe('query-2')

    XPlugin.store.commit('x/searchBox/setQuery', 'query-3')
    expect(getModuleState().query).toBe('query-3')
  })

  it('emits the store emitters events', async () => {
    installWithModule(backend)
    const subscriber = vi.fn()
    XPlugin.bus.on('SearchBoxQueryChanged', true).subscribe(subscriber)

    XPlugin.store.commit('x/searchBox/setQuery', 'query-1')
    await waitNextTick()

    expect(subscriber).toHaveBeenCalledTimes(1)
    expect(subscriber).toHaveBeenCalledWith(
      expect.objectContaining({
        eventPayload: 'query-1',
        metadata: expect.objectContaining({ moduleName: 'searchBox', oldValue: '' }),
      }),
    )
  })
})

describe('xPlugin with the pinia backend', () => {
  afterEach(() => {
    XPlugin.resetInstance()
  })

  it('holds the state in pinia, sharing it with vuex', () => {
    installWithModule('pinia')

    expect(XPlugin.pinia.state.value['x/searchBox']).toBe(XPlugin.store.state.x.searchBox)
  })

  it('releases the pinia resources when resetting the instance', () => {
    installWithModule('pinia')
    const { pinia, store } = { pinia: XPlugin.pinia, store: XPlugin.store }

    XPlugin.resetInstance()

    expect(pinia.state.value['x/searchBox']).toBeUndefined()
    expect(store.replaceState).toBe(Store.prototype.replaceState)
  })
})

describe('xPlugin falling back to vuex', () => {
  let warn: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warn.mockRestore()
    XPlugin.resetInstance()
  })

  it('uses vuex when the module getters, mutations or actions are overridden', () => {
    installWithModule('pinia', {
      __PRIVATE__xModules: {
        searchBox: { storeModule: { getters: { upperQuery: () => 'overridden' } } as any },
      },
    })

    expect(XPlugin.pinia.state.value['x/searchBox']).toBeUndefined()
    expect(XPlugin.store.getters['x/searchBox/upperQuery']).toBe('overridden')
    expect(warn).toHaveBeenCalledTimes(1)
  })

  it('uses vuex when the store is strict', () => {
    installWithModule('pinia', { store: createStore({ strict: true }) })

    expect(XPlugin.pinia.state.value['x/searchBox']).toBeUndefined()
    expect(() => {
      XPlugin.store.commit('x/searchBox/setQuery', 'query-1')
    }).not.toThrow()
    expect(getModuleState().query).toBe('query-1')
    expect(warn).toHaveBeenCalledTimes(1)
  })

  it('warns when the pinia store does not expose what the vuex store module has', () => {
    const xModule = createFixtureXModule(true)
    xModule.piniaStore!.bridge.mutations = {}
    mount(
      { template: '<div/>' },
      { global: { plugins: [installNewXPlugin({ initialXModules: [xModule] })] } },
    )

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('mutations'))
  })

  it('creates its own pinia when the host installs it after the plugin', () => {
    const hostPinia = createPinia()
    mount({ template: '<div/>' }, { global: { plugins: [installNewXPlugin(), hostPinia] } })

    expect(XPlugin.pinia).not.toBe(hostPinia)
    expect(getActivePinia()).toBe(hostPinia)
  })
})
