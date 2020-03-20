import { createLocalVue, shallowMount, Wrapper } from '@vue/test-utils';
import { default as Vue, VueConstructor } from 'vue';
import Vuex, { Store } from 'vuex';
import { createStoreEmitters, XStoreModule } from '../../store';
import { createWireFromFunction, wireCommit } from '../../wiring/wires.factory';
import { AnyWire } from '../../wiring/wiring.types';
import { createWiring } from '../../wiring/wiring.utils';
import { AnyXModule } from '../../x-modules/x-modules.types';
import { XPlugin } from '../x-plugin';
import { XModulesOptions, XPluginOptions } from '../x-plugin.types';

const wireToReplace: AnyWire = jest.fn();
const wireToRemove: AnyWire = jest.fn();
const wire: AnyWire = jest.fn();
const userTypedSelector = jest.fn();
const userIsChangingQuerySelector = jest.fn();
const userSelectedAQuerySelector = jest.fn();
const action = jest.fn();
const actionToReplace = jest.fn();
const actionToRemove = jest.fn();
const mutation = jest.fn();
const mutationToReplace = jest.fn();
const mutationToRemove = jest.fn();
const xModule: AnyXModule = {
  name: 'searchBox',
  wiring: {
    UserTyped: {
      wireToReplace,
      wireToRemove,
      wire
    }
  },
  storeEmitters: {
    UserTyped: userTypedSelector,
    UserIsChangingQuery: userIsChangingQuerySelector,
    UserSelectedAQuery: userSelectedAQuerySelector
  },
  storeModule: {
    state: () => ({
      prop: 1,
      complexProp: { propToReplace: 'Replace me', propToKeep: 'But keep me' },
      propToRemove: ['Hi']
    }),
    getters: {
      getter() {
        return 1;
      },
      getterToReplace() {
        return 2;
      },
      getterToRemove() {
        return 3;
      }
    },
    actions: {
      action,
      actionToReplace,
      actionToRemove
    },
    mutations: {
      mutation,
      mutationToReplace,
      mutationToRemove
    }
  }
};

let plugin: typeof XPlugin;
let localVue: VueConstructor;
let store: Store<any>; // Any to handle creation of new properties

describe('testing X Plugin', () => {
  beforeEach(() => {
    jest.resetModules().clearAllMocks();
    plugin = require('../x-plugin').XPlugin;
    localVue = createLocalVue();
    localVue.use(Vuex);
    store = new Store({});
  });

  describe('install XPlugin without options', () => {
    it('allows registering a x-module before installing', () => {
      plugin.registerXModule(xModule);
      expectDefaultModuleToBeNotRegistered();

      localVue.use(plugin, { store });
      expectDefaultModuleToBeRegisteredOnce();
    });

    it('allows registering a x-module after installing', () => {
      localVue.use(plugin, { store });
      plugin.registerXModule(xModule);

      expectDefaultModuleToBeRegisteredOnce();
    });

    it('does not re-register a module', () => {
      plugin.registerXModule(xModule);
      localVue.use(plugin, { store });
      plugin.registerXModule(xModule);

      expectDefaultModuleToBeRegisteredOnce();
    });

    function expectDefaultModuleToBeNotRegistered(): void {
      expect(wireToReplace).not.toHaveBeenCalled();
      expect(wireToRemove).not.toHaveBeenCalled();
      expect(wire).not.toHaveBeenCalled();
      expect(store.state.x).not.toBeDefined(); // If the state is not registered I'm 100% sure
      // that there won't be actions, mutations or getters.
      expect(userTypedSelector).not.toHaveBeenCalled();
      expect(userSelectedAQuerySelector).not.toHaveBeenCalled();
      expect(userIsChangingQuerySelector).not.toHaveBeenCalled();
    }

    function expectDefaultModuleToBeRegisteredOnce(): void {
      // Wires
      expect(wireToReplace).toHaveBeenCalledTimes(1);
      expect(wireToRemove).toHaveBeenCalledTimes(1);
      expect(wire).toHaveBeenCalledTimes(1);
      // Store Module
      expect(store.state.x.searchBox).toBeDefined();
      // Store Emitters
      const searchBoxState = store.state.x.searchBox;
      const searchBoxGetters = {
        getter: 1,
        getterToReplace: 2,
        getterToRemove: 3
      };
      expect(userTypedSelector).toHaveBeenCalledTimes(1);
      expect(userTypedSelector).toHaveBeenCalledWith(searchBoxState, searchBoxGetters);
      expect(userSelectedAQuerySelector).toHaveBeenCalledTimes(1);
      expect(userSelectedAQuerySelector).toHaveBeenCalledWith(searchBoxState, searchBoxGetters);
      expect(userIsChangingQuerySelector).toHaveBeenCalledTimes(1);
      expect(userIsChangingQuerySelector).toHaveBeenCalledWith(searchBoxState, searchBoxGetters);
    }
  });

  describe('install XPlugin overriding store', () => {
    const newAction = jest.fn();
    const replacedAction = jest.fn();
    const newMutation = jest.fn();
    const replacedMutation = jest.fn();
    const xModules: XModulesOptions = {
      searchBox: {
        storeModule: {
          state: {
            propToRemove: undefined,
            complexProp: {
              propToReplace: "I'm new"
            },
            newProp: 'New prop'
          } as any, // There is some issue with ts-jest that throws different errors of the TS
          // service
          getters: {
            getterToReplace() {
              return 4;
            },
            getterToRemove: undefined as any, // You can't remove a property that does not exist
            newGetter() {
              return 5;
            }
          },
          actions: {
            newAction,
            actionToReplace: replacedAction,
            actionToRemove: undefined
          } as any,
          mutations: {
            newMutation,
            mutationToReplace: replacedMutation,
            mutationToRemove: undefined
          } as any
        }
      }
    };

    function expectStoreStateToBeModified(): void {
      expect(store.state.x.searchBox.prop).toEqual(1);
      expect(store.state.x.searchBox.propToRemove).not.toBeDefined();
      expect(store.state.x.searchBox.complexProp).toEqual({
        propToReplace: "I'm new",
        propToKeep: 'But keep me'
      });
      expect(store.state.x.searchBox.newProp).toEqual('New prop');
    }

    function expectStoreGettersToBeModified(): void {
      expect(store.getters['x/searchBox/getter']).toEqual(1);
      expect(store.getters['x/searchBox/getterToReplace']).toEqual(4);
      expect(store.getters['x/searchBox/getterToRemove']).not.toBeDefined();
      expect(store.getters['x/searchBox/newGetter']).toEqual(5);
    }

    async function expectStoreActionsToBeModified(): Promise<void> {
      await Promise.all([
        store.dispatch('x/searchBox/action'),
        store.dispatch('x/searchBox/actionToReplace'),
        store.dispatch('x/searchBox/actionToRemove'),
        store.dispatch('x/searchBox/newAction')
      ]);
      expect(action).toHaveBeenCalled();
      expect(newAction).toHaveBeenCalled();
      expect(replacedAction).toHaveBeenCalled();
      expect(actionToReplace).not.toHaveBeenCalled();
      expect(actionToRemove).not.toHaveBeenCalled();
    }

    function expectStoreMutationsToBeModified(): void {
      store.commit('x/searchBox/mutation');
      store.commit('x/searchBox/mutationToReplace');
      store.commit('x/searchBox/mutationToRemove');
      store.commit('x/searchBox/newMutation');
      expect(mutation).toHaveBeenCalled();
      expect(newMutation).toHaveBeenCalled();
      expect(replacedMutation).toHaveBeenCalled();
      expect(mutationToReplace).not.toHaveBeenCalled();
      expect(mutationToRemove).not.toHaveBeenCalled();
    }

    describe('override before installing plugin', () => {
      beforeEach(() => {
        plugin.registerXModule(xModule);
        localVue.use(plugin, {
          xModules,
          store
        });
      });

      it('overrides state', () => expectStoreStateToBeModified());
      it('overrides getters', () => expectStoreGettersToBeModified());
      it('overrides actions', () => expectStoreActionsToBeModified());
      it('overrides mutations', () => expectStoreMutationsToBeModified());
    });

    describe('override after installing plugin', () => {
      beforeEach(() => {
        localVue.use(plugin, {
          xModules,
          store
        });
        plugin.registerXModule(xModule);
      });
      it('overrides state', () => expectStoreStateToBeModified());
      it('overrides getters', () => expectStoreGettersToBeModified());
      it('overrides actions', () => expectStoreActionsToBeModified());
      it('overrides mutations', () => expectStoreMutationsToBeModified());
    });
  });

  describe('install XPlugin overriding wiring', () => {
    const newWire = jest.fn();
    const replacedWire = jest.fn();
    const pluginOptions: XPluginOptions = {
      xModules: {
        searchBox: {
          wiring: {
            UserTyped: {
              wireToReplace: replacedWire,
              wireToRemove: undefined as any, // "any" because we are mocking searchBox module to
              // ease testing, and types don't allow to add
              // an undefined wire unless it is defined in the default configuration.
              newWire
            }
          }
        }
      },
      store
    };

    it('overrides before installing plugin', () => {
      plugin.registerXModule(xModule);
      localVue.use(plugin, pluginOptions);

      expectModuleToHaveBeenReplaced();
    });
    it('overrides after installing plugin', () => {
      localVue.use(plugin, pluginOptions);
      plugin.registerXModule(xModule);

      expectModuleToHaveBeenReplaced();
    });

    function expectModuleToHaveBeenReplaced(): void {
      expect(wireToReplace).not.toHaveBeenCalled();
      expect(wireToRemove).not.toHaveBeenCalled();
      expect(wire).toHaveBeenCalled();
      expect(replacedWire).toHaveBeenCalled();
      expect(newWire).toHaveBeenCalled();
    }
  });

  describe('x-Modules system', () => {
    let component: Wrapper<Vue>;
    const searchBoxQueryChangedSubscriber = jest.fn();
    const storeModule: XStoreModule<
      { query: string },
      { trimmedQuery: string },
      { setQuery(query: string): void },
      object
    > = {
      actions: {},
      getters: {
        trimmedQuery(state) {
          return state.query.trim();
        }
      },
      mutations: {
        setQuery(state, query) {
          state.query = query;
        }
      },
      state: () => ({ query: '' })
    };
    const storeEmitters = createStoreEmitters(storeModule, {
      SearchBoxQueryChanged: (_, getters) => getters.trimmedQuery
    });
    const wiring = createWiring({
      UserTyped: {
        setSearchBoxQuery: wireCommit<string>('x/searchBox/setQuery')
      },
      SearchBoxQueryChanged: {
        registerSearchBoxQueryChanged: createWireFromFunction(searchBoxQueryChangedSubscriber)
      }
    });

    beforeEach(() => {
      plugin.registerXModule({
        name: 'searchBox',
        storeModule,
        wiring,
        storeEmitters
      });
      localVue.use(plugin, { store });
      component = shallowMount(
        {
          render(h) {
            return h();
          }
        },
        { store, localVue, sync: false } // Sync options is needed to be set to false to replicate
        // real Vue behavior
      );
    });

    it('store-emitters emit a changed event when the observed store state changes', async () => {
      component.vm.$x.emit('UserTyped', 'New York strip steak');

      await localVue.nextTick();

      expect(searchBoxQueryChangedSubscriber).toHaveBeenCalledTimes(1);
      expect(searchBoxQueryChangedSubscriber).toHaveBeenCalledWith({
        eventPayload: 'New York strip steak',
        metadata: {
          moduleName: 'searchBox'
        },
        store
      });
    });

    it(
      "store-emitters don't emit multiple events if the events that are modifying the observed" +
        ' value are emitted synchronously',
      async () => {
        component.vm.$x.emit('UserTyped', 'New York strip steak');
        component.vm.$x.emit('UserTyped', 'Prime rib');
        component.vm.$x.emit('UserTyped', 'Tomahawk steak');

        await localVue.nextTick();

        expect(searchBoxQueryChangedSubscriber).toHaveBeenCalledTimes(1);
        expect(searchBoxQueryChangedSubscriber).toHaveBeenCalledWith({
          eventPayload: 'Tomahawk steak',
          metadata: {
            moduleName: 'searchBox'
          },
          store
        });
      }
    );

    it("store-emitters don't emit an event if value is reset synchronously", async () => {
      component.vm.$x.emit('UserTyped', 'chinchulines');
      component.vm.$x.emit('UserTyped', '');

      await localVue.nextTick();

      expect(searchBoxQueryChangedSubscriber).toHaveBeenCalledTimes(0);
    });
  });

  describe('default setConfig mutation', () => {
    const defaultConfigState = (): { config: { testConfig: boolean } } => ({
      config: { testConfig: false }
    });
    const defaultSetConfigMutation = jest.fn();

    function createXModule({
      withConfigState,
      withSetConfigMutation
    }: {
      withSetConfigMutation: boolean;
      withConfigState: boolean;
    }): AnyXModule {
      return {
        name: 'searchBox',
        storeModule: {
          actions: {},
          mutations: withSetConfigMutation ? { setConfig: defaultSetConfigMutation } : {},
          state: withConfigState ? defaultConfigState : () => ({}),
          getters: {}
        },
        storeEmitters: {},
        wiring: {}
      };
    }
    it('setConfig mutation is not created if there is no module configuration', () => {
      const module = createXModule({ withConfigState: false, withSetConfigMutation: false });
      localVue.use(plugin, { store });
      plugin.registerXModule(module);

      expect(module.storeModule.mutations).not.toHaveProperty('setConfig');
    });

    it('setConfig mutation is not created if already present in the module definition', () => {
      const module = createXModule({ withConfigState: true, withSetConfigMutation: true });
      localVue.use(plugin, { store });
      plugin.registerXModule(module);
      store.commit('x/searchBox/setConfig', { testConfig: true });

      expect(defaultSetConfigMutation).toHaveBeenCalledWith(defaultConfigState(), {
        testConfig: true
      });
    });

    it('is not created if is present in the x-module store options', () => {
      const module = createXModule({ withConfigState: true, withSetConfigMutation: true });
      const customSetConfigMutation = jest.fn();
      localVue.use(plugin, {
        store,
        xModules: {
          searchBox: {
            storeModule: {
              mutations: {
                setConfig: customSetConfigMutation
              }
            }
          }
        }
      });
      plugin.registerXModule(module);
      store.commit('x/searchBox/setConfig', { testConfig: true });

      expect(customSetConfigMutation).toHaveBeenCalledWith(defaultConfigState(), {
        testConfig: true
      });
    });

    it(
      'is created if it is not present in the default module definition or in the x-module ' +
        'store options',
      () => {
        const module = createXModule({ withConfigState: true, withSetConfigMutation: false });
        localVue.use(plugin, { store });
        plugin.registerXModule(module);
        store.commit('x/searchBox/setConfig', { testConfig: true });

        expect(store.state.x.searchBox.config.testConfig).toEqual(true);
      }
    );
  });
});
