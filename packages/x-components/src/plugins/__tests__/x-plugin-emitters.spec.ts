import type { Store } from 'vuex'
import type { XPluginOptions } from '../x-plugin.types'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createStore } from 'vuex'
import { XComponentsAdapterDummy } from '../../__tests__/adapter.dummy'
import { createXModule, installNewXPlugin } from '../../__tests__/utils'
import { setQuery } from '../../store/utils/query.utils'
import { createWireFromFunction } from '../../wiring/wires.factory'
import { XPlugin } from '../x-plugin'

const wireInstance = jest.fn()
const usedClearedWireInstance = jest.fn()
const userIsTypingAQuerySelector = jest.fn()
const userAcceptedAQuerySelector = jest.fn()

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
    jest.useFakeTimers()
  })
  beforeEach(() => {
    jest.clearAllMocks()
    XPlugin.resetInstance()
    store = createStore({})
    mount({}, { global: { plugins: [store] } })
  })
  afterAll(() => {
    jest.useRealTimers()
  })

  describe('install XPlugin overriding store emitters', () => {
    const newSearchBoxQueryChangedSelector = jest.fn()
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
    const testWire = jest.fn()
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
      jest.runAllTimers()

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
      jest.advanceTimersByTime(0)

      expect(testWire).toHaveBeenCalled()
    })
  })

  describe('isDifferent configuration option', () => {
    it('should not trigger the event if the provided filter function returns false', async () => {
      const testWire = jest.fn()
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
})

/**
 * Waits for Vue's reactivity to update getters and watchers, and flushes the pending emitters.
 *
 * @remarks It needs `jest.useFakeTimers()` to have been called to wait for the emitters.
 * @returns A promise that resolves after the reactivity has been updated and the pending emitters
 * have been run.
 */
async function waitNextTick(): Promise<void> {
  await nextTick()
  jest.runAllTimers()
}
