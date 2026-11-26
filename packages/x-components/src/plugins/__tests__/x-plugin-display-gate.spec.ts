import type { Store } from 'vuex'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { createStore } from 'vuex'
import { XComponentsAdapterDummy } from '../../__tests__/adapter.dummy'
import { createXModule, installNewXPlugin } from '../../__tests__/utils'
import { setQuery } from '../../store/utils/query.utils'
import { createWireFromFunction } from '../../wiring/wires.factory'
import { addXModuleDisplayedConsumer } from '../x-module-visibility'
import { XPlugin } from '../x-plugin'

const requestWire = vi.fn()

function createGatedModule(loadWhenVisible: boolean) {
  return createXModule({
    name: 'searchBox',
    wiring: {
      SearchBoxQueryChanged: { requestWire: createWireFromFunction(requestWire) },
    },
    storeEmitters: {
      SearchBoxQueryChanged: {
        selector: state => state.query,
        waitForDisplay: true,
      },
    },
    storeModule: {
      state: () => ({ query: '', config: { loadWhenVisible } }),
      getters: {},
      actions: {},
      mutations: {
        setQuery,
        setConfig(state, config: { loadWhenVisible: boolean }) {
          state.config = config
        },
      },
    },
  })
}

let store: Store<any>

function installModule(loadWhenVisible: boolean) {
  XPlugin.registerXModule(createGatedModule(loadWhenVisible))
  mount(
    {},
    { global: { plugins: [installNewXPlugin({ adapter: XComponentsAdapterDummy, store })] } },
  )
}

async function setQueryAndWait(query: string) {
  store.commit('x/searchBox/setQuery', query)
  await nextTick()
}

function emittedQueries() {
  return requestWire.mock.calls.map(([{ eventPayload }]) => eventPayload as string)
}

describe('store emitters waiting for the module to be displayed', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    XPlugin.resetInstance()
    store = createStore({})
  })

  it('emits as usual when `loadWhenVisible` is disabled', async () => {
    installModule(false)

    await setQueryAndWait('lego')

    expect(emittedQueries()).toEqual(['lego'])
  })

  it('holds the event until a component is displayed and emits only the latest value', async () => {
    installModule(true)

    await setQueryAndWait('lego')
    await setQueryAndWait('playmobil')
    expect(requestWire).not.toHaveBeenCalled()

    addXModuleDisplayedConsumer('searchBox')
    await nextTick()

    expect(emittedQueries()).toEqual(['playmobil'])
    expect(requestWire.mock.calls[0][0].metadata.oldValue).toBe('')
  })

  it('emits every change while a component is displayed', async () => {
    installModule(true)
    addXModuleDisplayedConsumer('searchBox')

    await setQueryAndWait('lego')
    await setQueryAndWait('playmobil')

    expect(emittedQueries()).toEqual(['lego', 'playmobil'])
  })

  it('does not emit again when displayed back with the value it already emitted', async () => {
    installModule(true)
    const removeConsumer = addXModuleDisplayedConsumer('searchBox')
    await setQueryAndWait('lego')
    removeConsumer()
    await nextTick()

    await setQueryAndWait('playmobil')
    await setQueryAndWait('lego')
    addXModuleDisplayedConsumer('searchBox')
    await nextTick()

    expect(emittedQueries()).toEqual(['lego'])
  })

  it('keeps waiting while at least one of several components is displayed', async () => {
    installModule(true)
    const removeFirst = addXModuleDisplayedConsumer('searchBox')
    addXModuleDisplayedConsumer('searchBox')
    removeFirst()
    removeFirst()

    await setQueryAndWait('lego')

    expect(emittedQueries()).toEqual(['lego'])
  })

  it('stops waiting when `loadWhenVisible` is disabled at runtime', async () => {
    installModule(true)
    store.commit('x/searchBox/setConfig', { loadWhenVisible: false })

    await setQueryAndWait('lego')

    expect(emittedQueries()).toEqual(['lego'])
  })
})
