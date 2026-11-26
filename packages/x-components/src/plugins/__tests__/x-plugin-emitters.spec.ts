import type { Store } from 'vuex'
import type { XPluginOptions } from '../x-plugin.types'
import { mount } from '@vue/test-utils'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { createStore } from 'vuex'
import { XComponentsAdapterDummy } from '../../__tests__/adapter.dummy'
import { createXModule, installNewXPlugin } from '../../__tests__/utils'
import { setQuery } from '../../store/utils/query.utils'
import { createWireFromFunction } from '../../wiring/wires.factory'
import { setXModuleConsumer, setXModuleElementVisibility } from '../x-modules-visibility'
import { XPlugin } from '../x-plugin'

const wireInstance = vi.fn()
const usedClearedWireInstance = vi.fn()
const userIsTypingAQuerySelector = vi.fn()
const userAcceptedAQuerySelector = vi.fn()

const xModule = createXModule({
  name: 'searchBox',
  wiring: {
    SearchBoxQueryChanged: { wireInstance },
    UserClearedQuery: { testWire: createWireFromFunction(usedClearedWireInstance) },
  },
  storeEmitters: {
    UserIsTypingAQuery: userIsTypingAQuerySelector,
    UserAcceptedAQuery: userAcceptedAQuerySelector,
    UserClearedQuery: state => state.query,
  },
  storeModule: {
    state: () => ({
      query: '',
      complexProp: { firstComplexProp: 'First prop', secondComplexProp: 2 },
    }),
    getters: {
      firstGetter: () => 1,
      secondGetter: () => 'It is awesome!',
    },
    actions: {},
    mutations: {
      setQuery,
    },
  },
})

let store: Store<any> // Any to handle creation of new properties

describe('testing X Plugin emitters', () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })
  beforeEach(() => {
    vi.clearAllMocks()
    XPlugin.resetInstance()
    store = createStore({})
    mount({}, { global: { plugins: [store] } })
  })
  afterAll(() => {
    vi.useRealTimers()
  })

  describe('install XPlugin overriding store emitters', () => {
    const newSearchBoxQueryChangedSelector = vi.fn()
    const pluginOptions: XPluginOptions = {
      adapter: XComponentsAdapterDummy,
      __PRIVATE__xModules: {
        searchBox: {
          storeEmitters: {
            UserIsTypingAQuery: undefined,
            SearchBoxQueryChanged: newSearchBoxQueryChangedSelector,
          },
        },
      },
      store,
    }

    it('overrides before installing plugin', () => {
      XPlugin.registerXModule(xModule)
      mount({}, { global: { plugins: [installNewXPlugin(pluginOptions)] } })

      expectModuleToHaveBeenReplaced()
    })

    it('overrides after installing plugin', () => {
      mount({}, { global: { plugins: [installNewXPlugin(pluginOptions)] } })
      XPlugin.registerXModule(xModule)

      expectModuleToHaveBeenReplaced()
    })

    function expectModuleToHaveBeenReplaced(): void {
      const gettersInstance = {
        firstGetter: 1,
        secondGetter: 'It is awesome!',
      }

      expect(userIsTypingAQuerySelector).not.toHaveBeenCalled()
      expect(userAcceptedAQuerySelector).toHaveBeenCalledWith(
        xModule.storeModule.state(),
        gettersInstance,
      )
      expect(newSearchBoxQueryChangedSelector).toHaveBeenCalledWith(
        xModule.storeModule.state(),
        gettersInstance,
      )
      expect(wireInstance).toHaveBeenCalled()
    }
  })

  describe('install XPlugin overriding SimpleStateSelector emitter with a StateSelector emitter', () => {
    const SET_QUERY_MUTATION = 'x/searchBox/setQuery'
    const expectedQuery = 'lego'
    beforeEach(() => {
      XPlugin.registerXModule(xModule)
      mount(
        {},
        {
          global: {
            plugins: [
              installNewXPlugin({
                adapter: XComponentsAdapterDummy,
                __PRIVATE__xModules: {
                  searchBox: {
                    storeEmitters: {
                      UserClearedQuery: {
                        selector: state => state.query,
                        filter: newValue => newValue === expectedQuery,
                      },
                    },
                  },
                },
                store,
              }),
            ],
          },
        },
      )
    })

    it('should not emit event after not meeting the condition defined in overwritten filter', async () => {
      store.commit(SET_QUERY_MUTATION, 'doraemon')
      await waitNextTick()
      expect(usedClearedWireInstance).toHaveBeenCalledTimes(0)
    })

    it('should emit event after meeting the condition defined in overwritten filter', async () => {
      store.commit(SET_QUERY_MUTATION, expectedQuery)
      await waitNextTick()
      expect(usedClearedWireInstance).toHaveBeenCalledTimes(1)
    })
  })

  describe('immediate configuration option', () => {
    const testWire = vi.fn()
    const wiring = {
      SearchBoxQueryChanged: {
        setQueryWire: createWireFromFunction(testWire),
      },
    }

    it('should not execute wires with immediate `false` when the module is registered', () => {
      const pluginOptions: XPluginOptions = {
        adapter: XComponentsAdapterDummy,
        xModules: {
          searchBox: {
            wiring,
          },
        },
        __PRIVATE__xModules: {
          searchBox: {
            storeEmitters: {
              SearchBoxQueryChanged: state => state.query,
              // immediate false by default
            },
          },
        },
        store,
      }

      XPlugin.registerXModule(xModule)
      mount({}, { global: { plugins: [installNewXPlugin(pluginOptions)] } })

      /* Emitters relies on Vue watcher that are async. We need to wait a cycle before testing if
         they have emitted or not. */
      vi.runAllTimers()

      expect(testWire).not.toHaveBeenCalled()
    })

    it('should execute wires with immediate `true` when the module is registered', () => {
      const pluginOptions: XPluginOptions = {
        adapter: XComponentsAdapterDummy,
        xModules: {
          searchBox: {
            wiring,
          },
        },
        __PRIVATE__xModules: {
          searchBox: {
            storeEmitters: {
              SearchBoxQueryChanged: {
                selector: state => state.query,
                immediate: true,
              },
            },
          },
        },
        store,
      }

      mount({}, { global: { plugins: [installNewXPlugin(pluginOptions)] } })
      XPlugin.registerXModule(xModule)

      /* Emitters relies on Vue watcher that are async. We need to wait a cycle before testing if
       they have emitted or not. */
      vi.advanceTimersByTime(0)

      expect(testWire).toHaveBeenCalled()
    })
  })

  describe('isDifferent configuration option', () => {
    it('should not trigger the event if the provided filter function returns false', async () => {
      const testWire = vi.fn()
      const wiring = {
        SearchBoxQueryChanged: {
          testWire: createWireFromFunction(testWire),
        },
      }
      const pluginOptions: XPluginOptions = {
        adapter: XComponentsAdapterDummy,
        xModules: {
          searchBox: {
            wiring,
          },
        },
        __PRIVATE__xModules: {
          searchBox: {
            storeEmitters: {
              SearchBoxQueryChanged: {
                selector: state => state.query,
                /* Only emit the event if the new query is longer than the old one */
                filter: (newQuery, oldQuery) => newQuery.length > oldQuery.length,
              },
            },
          },
        },
        store,
      }

      XPlugin.registerXModule(xModule)
      mount({}, { global: { plugins: [installNewXPlugin(pluginOptions)] } })

      store.commit('x/searchBox/setQuery', 'wheat')
      await waitNextTick()
      expect(testWire).toHaveBeenCalledTimes(1)
      expect(testWire).toHaveBeenCalledWith({
        eventPayload: 'wheat',
        metadata: {
          moduleName: 'searchBox',
          oldValue: '',
          replaceable: true,
        },
        store,
      })

      store.commit('x/searchBox/setQuery', 'whe')
      await waitNextTick()
      expect(testWire).toHaveBeenCalledTimes(1)

      store.commit('x/searchBox/setQuery', 'wheat beer')
      await waitNextTick()
      expect(testWire).toHaveBeenCalledTimes(2)
      expect(testWire).toHaveBeenNthCalledWith(2, {
        eventPayload: 'wheat beer',
        metadata: {
          moduleName: 'searchBox',
          oldValue: 'whe',
          replaceable: true,
        },
        store,
      })
    })
  })

  describe('emitWhenVisible configuration option', () => {
    const testWire = vi.fn()
    const elementToken = Symbol('element')
    const setVisible = async (isVisible: boolean) => {
      setXModuleElementVisibility('searchBox', elementToken, isVisible)
      await waitNextTick()
    }
    const setQueryAndWait = async (query: string) => {
      store.commit('x/searchBox/setQuery', query)
      await waitNextTick()
    }

    beforeEach(() => {
      XPlugin.registerXModule(xModule)
      mount(
        {},
        {
          global: {
            plugins: [
              installNewXPlugin({
                adapter: XComponentsAdapterDummy,
                xModules: {
                  searchBox: {
                    wiring: {
                      SearchBoxQueryChanged: { testWire: createWireFromFunction(testWire) },
                    },
                  },
                },
                __PRIVATE__xModules: {
                  searchBox: {
                    storeEmitters: {
                      SearchBoxQueryChanged: {
                        selector: state => state.query,
                        emitWhenVisible: true,
                      },
                    },
                  },
                },
                store,
              }),
            ],
          },
        },
      )
    })

    it('defers the event while the module is hidden and emits the latest value on display', async () => {
      await setQueryAndWait('lego')
      await setQueryAndWait('playmobil')
      expect(testWire).not.toHaveBeenCalled()

      await setVisible(true)
      expect(testWire).toHaveBeenCalledTimes(1)
      expect(testWire).toHaveBeenCalledWith(
        expect.objectContaining({
          eventPayload: 'playmobil',
          metadata: expect.objectContaining({ moduleName: 'searchBox', oldValue: undefined }),
        }),
      )
    })

    it('does not emit when the value changes while the module is already visible', async () => {
      await setVisible(true)
      await setQueryAndWait('lego')
      expect(testWire).not.toHaveBeenCalled()

      await setVisible(false)
      await setVisible(true)
      expect(testWire).toHaveBeenCalledTimes(1)
    })

    it('does not emit empty values', async () => {
      await setQueryAndWait('lego')
      await setQueryAndWait('')
      await setVisible(true)

      expect(testWire).not.toHaveBeenCalled()
    })

    it('emits on every change while a consumer always needs the data', async () => {
      const alwaysToken = Symbol('always')
      await setQueryAndWait('lego')
      setXModuleConsumer('always', 'searchBox', alwaysToken, true)
      await waitNextTick()
      expect(testWire).toHaveBeenCalledTimes(1)

      await setQueryAndWait('playmobil')
      await setQueryAndWait('')
      expect(testWire).toHaveBeenCalledTimes(3)
    })

    it('stops emitting on every change once the always consumer is removed', async () => {
      const alwaysToken = Symbol('always')
      setXModuleConsumer('always', 'searchBox', alwaysToken, true)
      await setQueryAndWait('lego')
      setXModuleConsumer('always', 'searchBox', alwaysToken, false)
      await setQueryAndWait('playmobil')

      expect(testWire).toHaveBeenCalledTimes(1)
    })

    it('does not emit again a value equal to the last emitted one', async () => {
      await setQueryAndWait('lego')
      await setVisible(true)
      await setVisible(false)
      await setVisible(true)
      await setVisible(false)
      await setQueryAndWait('playmobil')
      await setQueryAndWait('lego')
      await setVisible(true)

      expect(testWire).toHaveBeenCalledTimes(1)
    })
  })
})

/**
 * Waits for Vue's reactivity to update getters and watchers, and flushes the pending emitters.
 *
 * @remarks It needs `vi.useFakeTimers()` to have been called to wait for the emitters.
 * @returns A promise that resolves after the reactivity has been updated and the pending emitters
 * have been run.
 */
async function waitNextTick(): Promise<void> {
  await nextTick()
  vi.runAllTimers()
}
