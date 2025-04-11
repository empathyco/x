import type { Dictionary } from '@empathyco/x-utils'
import type { Store } from 'vuex'
import type { XStoreModule } from '../../store'
import type { AnyWire } from '../../wiring/wiring.types'
import type { AnyXModule } from '../../x-modules/x-modules.types'
import type { PrivateXModulesOptions, XModulesOptions, XPluginOptions } from '../x-plugin.types'
import { mount, shallowMount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createStore } from 'vuex'
import { XComponentsAdapterDummy } from '../../__tests__/adapter.dummy'
import { XDummyBus } from '../../__tests__/bus.dummy'
import { installNewXPlugin } from '../../__tests__/utils'
import { createStoreEmitters } from '../../store'
import { setQuery } from '../../store/utils/query.utils'
import { createWireFromFunction, wireCommit } from '../../wiring/wires.factory'
import { createWiring } from '../../wiring/wiring.utils'
import { XPlugin } from '../x-plugin'

const wireToReplace: AnyWire = jest.fn()
const wireToRemove: AnyWire = jest.fn()
const wire: AnyWire = jest.fn()
const userIsTypingAQuerySelector = jest.fn()
const userAcceptedAQuerySelector = jest.fn()
const action = jest.fn()
const actionToReplace = jest.fn()
const actionToRemove = jest.fn()
const mutation = jest.fn()
const mutationToReplace = jest.fn()
const mutationToRemove = jest.fn()
const xModule: AnyXModule = {
  name: 'searchBox',
  wiring: {
    UserIsTypingAQuery: {
      wireToReplace,
      wireToRemove,
      wire,
    },
  },
  storeEmitters: {
    UserIsTypingAQuery: userIsTypingAQuerySelector,
    UserAcceptedAQuery: userAcceptedAQuerySelector,
  },
  storeModule: {
    state: () => ({
      prop: 1,
      complexProp: { propToReplace: 'Replace me', propToKeep: 'But keep me' },
      propToRemove: ['Hi'],
      config: {
        propFromDefault: 'Default state writes it',
        propReplacedByPrivateXModules: 'Default state writes it',
        propReplacedByXModules: 'Default state writes it',
      },
    }),
    getters: {
      getter() {
        return 1
      },
      getterToReplace() {
        return 2
      },
      getterToRemove() {
        return 3
      },
    },
    actions: {
      action,
      actionToReplace,
      actionToRemove,
    },
    mutations: {
      mutation,
      mutationToReplace,
      mutationToRemove,
    },
  },
}

let store: Store<any> // Any to handle creation of new properties

describe('testing X Plugin', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    XPlugin.resetInstance()
    store = createStore({})
    mount({}, { global: { plugins: [store] } })
  })

  describe('install XPlugin without overriding options', () => {
    it('throws an error if no options are passed', () => {
      const plugin = new XPlugin(new XDummyBus())
      expect(() => mount({}, { global: { plugins: [plugin] } })).toThrow()
    })

    it('allows registering a x-module before installing', () => {
      XPlugin.registerXModule(xModule)
      expectDefaultModuleToBeNotRegistered()

      mount(
        {},
        { global: { plugins: [installNewXPlugin({ store, adapter: XComponentsAdapterDummy })] } },
      )
      expectDefaultModuleToBeRegisteredOnce()
    })

    it('allows registering a initial x-module when installing', () => {
      mount(
        {},
        {
          global: {
            plugins: [
              installNewXPlugin({
                store,
                adapter: XComponentsAdapterDummy,
                initialXModules: [xModule],
              }),
            ],
          },
        },
      )

      expectDefaultModuleToBeRegisteredOnce()
    })

    it('allows registering a x-module after installing', () => {
      mount(
        {},
        { global: { plugins: [installNewXPlugin({ store, adapter: XComponentsAdapterDummy })] } },
      )
      XPlugin.registerXModule(xModule)

      expectDefaultModuleToBeRegisteredOnce()
    })

    it('does not re-register a module', () => {
      XPlugin.registerXModule(xModule)
      mount(
        {},
        { global: { plugins: [installNewXPlugin({ store, adapter: XComponentsAdapterDummy })] } },
      )
      XPlugin.registerXModule(xModule)

      expectDefaultModuleToBeRegisteredOnce()
    })

    function expectDefaultModuleToBeNotRegistered(): void {
      expect(wireToReplace).not.toHaveBeenCalled()
      expect(wireToRemove).not.toHaveBeenCalled()
      expect(wire).not.toHaveBeenCalled()
      expect(store.state.x).not.toBeDefined() // If the state is not registered I'm 100% sure that
      // there won't be actions, mutations or getters.
      expect(userAcceptedAQuerySelector).not.toHaveBeenCalled()
      expect(userIsTypingAQuerySelector).not.toHaveBeenCalled()
    }

    function expectDefaultModuleToBeRegisteredOnce(): void {
      // Wires
      expect(wireToReplace).toHaveBeenCalledTimes(1)
      expect(wireToRemove).toHaveBeenCalledTimes(1)
      expect(wire).toHaveBeenCalledTimes(1)
      // Store Module
      expect(store.state.x.searchBox).toBeDefined()
      // Store Emitters
      const searchBoxState = store.state.x.searchBox
      const searchBoxGetters = {
        getter: 1,
        getterToReplace: 2,
        getterToRemove: 3,
      }
      expect(userAcceptedAQuerySelector).toHaveBeenCalledTimes(1)
      expect(userAcceptedAQuerySelector).toHaveBeenCalledWith(searchBoxState, searchBoxGetters)
      expect(userIsTypingAQuerySelector).toHaveBeenCalledTimes(1)
      expect(userIsTypingAQuerySelector).toHaveBeenCalledWith(searchBoxState, searchBoxGetters)
    }
  })

  describe('install XPlugin overriding store', () => {
    const newAction = jest.fn()
    const replacedAction = jest.fn()
    const newMutation = jest.fn()
    const replacedMutation = jest.fn()
    const privateXModulesOptions: PrivateXModulesOptions = {
      searchBox: {
        storeModule: {
          state: {
            propToRemove: undefined,
            complexProp: {
              propToReplace: "I'm new",
            },
            newProp: 'New prop',
            config: {
              propReplacedByPrivateXModules: 'Private XModules options writes it',
              propReplacedByXModules: 'Private XModules options writes it',
            },
          } as any, // There is some issue with ts-jest that throws different errors of the TS
          // service
          getters: {
            getterToReplace() {
              return 4
            },
            getterToRemove: undefined as any, // You can't remove a property that does not exist
            newGetter() {
              return 5
            },
          } as any,
          actions: {
            newAction,
            actionToReplace: replacedAction,
            actionToRemove: undefined,
          } as any,
          mutations: {
            newMutation,
            mutationToReplace: replacedMutation,
            mutationToRemove: undefined,
          } as any,
        },
      },
    }
    const xModulesOptions: XModulesOptions = {
      searchBox: {
        config: {
          propReplacedByXModules: 'XModules options writes it',
        } as any,
      },
    }

    function expectStoreStateToBeModified(): void {
      expect(store.state.x.searchBox.prop).toEqual(1)
      expect(store.state.x.searchBox.propToRemove).not.toBeDefined()
      expect(store.state.x.searchBox.complexProp).toEqual({
        propToReplace: "I'm new",
        propToKeep: 'But keep me',
      })
      expect(store.state.x.searchBox.newProp).toEqual('New prop')
      expect(store.state.x.searchBox.config).toEqual({
        propFromDefault: 'Default state writes it',
        propReplacedByPrivateXModules: 'Private XModules options writes it',
        propReplacedByXModules: 'XModules options writes it',
      })
    }

    function expectStoreGettersToBeModified(): void {
      expect(store.getters['x/searchBox/getter']).toEqual(1)
      expect(store.getters['x/searchBox/getterToReplace']).toEqual(4)
      expect(store.getters['x/searchBox/getterToRemove']).not.toBeDefined()
      expect(store.getters['x/searchBox/newGetter']).toEqual(5)
    }

    async function expectStoreActionsToBeModified(): Promise<void> {
      await Promise.all([
        store.dispatch('x/searchBox/action'),
        store.dispatch('x/searchBox/actionToReplace'),
        store.dispatch('x/searchBox/actionToRemove'),
        store.dispatch('x/searchBox/newAction'),
      ])
      expect(action).toHaveBeenCalled()
      expect(newAction).toHaveBeenCalled()
      expect(replacedAction).toHaveBeenCalled()
      expect(actionToReplace).not.toHaveBeenCalled()
      expect(actionToRemove).not.toHaveBeenCalled()
    }

    function expectStoreMutationsToBeModified(): void {
      store.commit('x/searchBox/mutation')
      store.commit('x/searchBox/mutationToReplace')
      store.commit('x/searchBox/mutationToRemove')
      store.commit('x/searchBox/newMutation')
      expect(mutation).toHaveBeenCalled()
      expect(newMutation).toHaveBeenCalled()
      expect(replacedMutation).toHaveBeenCalled()
      expect(mutationToReplace).not.toHaveBeenCalled()
      expect(mutationToRemove).not.toHaveBeenCalled()
    }

    describe('override before installing plugin', () => {
      beforeEach(() => {
        XPlugin.registerXModule(xModule)
        mount(
          {},
          {
            global: {
              plugins: [
                installNewXPlugin({
                  __PRIVATE__xModules: privateXModulesOptions,
                  xModules: xModulesOptions,
                  store,
                  adapter: XComponentsAdapterDummy,
                }),
              ],
            },
          },
        )
      })

      it('overrides state', () => expectStoreStateToBeModified())
      it('overrides getters', () => expectStoreGettersToBeModified())
      it('overrides actions', async () => expectStoreActionsToBeModified())
      it('overrides mutations', () => expectStoreMutationsToBeModified())
    })

    describe('override after installing plugin', () => {
      beforeEach(() => {
        mount(
          {},
          {
            global: {
              plugins: [
                installNewXPlugin({
                  __PRIVATE__xModules: privateXModulesOptions,
                  xModules: xModulesOptions,
                  store,
                  adapter: XComponentsAdapterDummy,
                }),
              ],
            },
          },
        )

        XPlugin.registerXModule(xModule)
      })

      it('overrides state', () => expectStoreStateToBeModified())
      it('overrides getters', () => expectStoreGettersToBeModified())
      it('overrides actions', async () => expectStoreActionsToBeModified())
      it('overrides mutations', () => expectStoreMutationsToBeModified())
    })

    it("doesn't create a section of config state if the xModule doesn't contain it", () => {
      const xModuleWithoutConfig: AnyXModule = {
        name: 'searchBox',
        wiring: {},
        storeEmitters: {},
        storeModule: {
          state: () => ({}),
          getters: {},
          actions: {},
          mutations: {},
        },
      }

      mount(
        {},
        {
          global: {
            plugins: [installNewXPlugin({ store, adapter: XComponentsAdapterDummy })],
          },
        },
      )

      XPlugin.registerXModule(xModuleWithoutConfig)

      expect(store.state.x.searchBox.config).not.toBeDefined()
    })
  })

  describe('install XPlugin overriding wiring', () => {
    const newWire = jest.fn()
    const replacedWire = jest.fn()
    const pluginOptions: XPluginOptions = {
      adapter: XComponentsAdapterDummy,
      xModules: {
        searchBox: {
          wiring: {
            UserIsTypingAQuery: {
              wireToReplace: replacedWire,
              wireToRemove: undefined as any, // "any" because we are mocking searchBox module to
              // ease testing, and types don't allow to add
              // an undefined wire unless it is defined in the default configuration.
              newWire,
            },
          },
        },
      },
      store,
    }

    it('overrides before installing plugin', () => {
      XPlugin.registerXModule(xModule)
      mount(
        {},
        {
          global: {
            plugins: [installNewXPlugin(pluginOptions)],
          },
        },
      )

      expectModuleToHaveBeenReplaced()
    })
    it('overrides after installing plugin', () => {
      mount(
        {},
        {
          global: {
            plugins: [installNewXPlugin(pluginOptions)],
          },
        },
      )
      XPlugin.registerXModule(xModule)

      expectModuleToHaveBeenReplaced()
    })

    function expectModuleToHaveBeenReplaced(): void {
      expect(wireToReplace).not.toHaveBeenCalled()
      expect(wireToRemove).not.toHaveBeenCalled()
      expect(wire).toHaveBeenCalled()
      expect(replacedWire).toHaveBeenCalled()
      expect(newWire).toHaveBeenCalled()
    }
  })

  describe('x-Modules system', () => {
    const searchBoxQueryChangedSubscriber = jest.fn()
    const storeModule: XStoreModule<
      { query: string },
      { trimmedQuery: string },
      { setQuery: (query: string) => void },
      Dictionary<(payload?: any) => any>
    > = {
      actions: {},
      getters: {
        trimmedQuery(state) {
          return state.query.trim()
        },
      },
      mutations: {
        setQuery,
      },
      state: () => ({ query: '' }),
    }
    const storeEmitters = createStoreEmitters(storeModule, {
      SearchBoxQueryChanged: (_, getters) => getters.trimmedQuery,
    })
    const wiring = createWiring({
      UserIsTypingAQuery: {
        setSearchBoxQuery: wireCommit<string>('x/searchBox/setQuery'),
      },
      SearchBoxQueryChanged: {
        registerSearchBoxQueryChanged: createWireFromFunction(searchBoxQueryChangedSubscriber),
      },
    })

    beforeAll(() => {
      jest.useFakeTimers()
    })
    beforeEach(() => {
      XPlugin.registerXModule({
        name: 'searchBox',
        storeModule,
        wiring,
        storeEmitters,
      })
      shallowMount(
        {},
        {
          global: {
            plugins: [installNewXPlugin({ store, adapter: XComponentsAdapterDummy })],
          },
        },
      )
    })
    afterAll(() => {
      jest.useFakeTimers()
    })

    it('store-emitters emit a changed event when the observed store state changes', async () => {
      void XPlugin.bus.emit('UserIsTypingAQuery', 'New York strip steak')

      await nextTick() // Needed so Vue has updated the reactive dependencies.
      jest.runAllTimers() // Needed for debounce of the emitters.

      expect(searchBoxQueryChangedSubscriber).toHaveBeenCalledTimes(1)
      expect(searchBoxQueryChangedSubscriber).toHaveBeenCalledWith({
        eventPayload: 'New York strip steak',
        metadata: expect.objectContaining({
          moduleName: 'searchBox',
        }),
        store,
      })
    })

    it(
      "store-emitters don't emit multiple events if the events that are modifying the observed" +
        ' value are emitted synchronously',
      async () => {
        void XPlugin.bus.emit('UserIsTypingAQuery', 'New York strip steak')
        void XPlugin.bus.emit('UserIsTypingAQuery', 'Prime rib')
        void XPlugin.bus.emit('UserIsTypingAQuery', 'Tomahawk steak')

        await waitNextTick()

        expect(searchBoxQueryChangedSubscriber).toHaveBeenCalledTimes(1)
        expect(searchBoxQueryChangedSubscriber).toHaveBeenCalledWith({
          eventPayload: 'Tomahawk steak',
          metadata: expect.objectContaining({
            moduleName: 'searchBox',
          }),
          store,
        })
      },
    )

    it(
      "store-emitters don't emit multiple events if the events that are modifying the observed" +
        ' value are emitted asynchronously but consecutively',
      async () => {
        void XPlugin.bus.emit('UserIsTypingAQuery', 'New York strip steak')
        void XPlugin.bus.emit('UserIsTypingAQuery', 'Prime rib')
        void XPlugin.bus.emit('UserIsTypingAQuery', 'Tomahawk steak')

        await waitNextTick()

        expect(searchBoxQueryChangedSubscriber).toHaveBeenCalledTimes(1)
        expect(searchBoxQueryChangedSubscriber).toHaveBeenCalledWith({
          eventPayload: 'Tomahawk steak',
          metadata: expect.objectContaining({
            moduleName: 'searchBox',
            replaceable: true,
          }),
          store,
        })
      },
    )

    it("store-emitters don't emit an event if value is reset synchronously", async () => {
      void XPlugin.bus.emit('UserIsTypingAQuery', 'chinchulines')
      void XPlugin.bus.emit('UserIsTypingAQuery', '')

      await waitNextTick()

      expect(searchBoxQueryChangedSubscriber).toHaveBeenCalledTimes(0)
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
