import { createLocalVue } from '@vue/test-utils';
import { default as Vue, VueConstructor } from 'vue';
import Vuex, { Store } from 'vuex';
import { createWireFromFunction } from '../../wiring/wires.factory';
import { WireMetadata } from '../../wiring/wiring.types';
import { SearchAdapterDummy } from '../../__tests__/adapter.dummy';
import { createXModule } from '../../__tests__/utils';
import { BaseXBus } from '../x-bus';
import { XPlugin } from '../x-plugin';
import { XPluginOptions } from '../x-plugin.types';

const wireInstance = jest.fn();
const userIsTypingAQuerySelector = jest.fn();
const userAcceptedAQuerySelector = jest.fn();

const xModule = createXModule({
  name: 'searchBox',
  wiring: {
    SearchBoxQueryChanged: { wireInstance }
  },
  storeEmitters: {
    UserIsTypingAQuery: userIsTypingAQuerySelector,
    UserAcceptedAQuery: userAcceptedAQuerySelector
  },
  storeModule: {
    state: () => ({
      query: '',
      complexProp: { firstComplexProp: 'First prop', secondComplexProp: 2 }
    }),
    getters: {
      firstGetter: () => 1,
      secondGetter: () => 'It is awesome!'
    },
    actions: {},
    mutations: {
      setQuery(state, query: string): void {
        state.query = query;
      }
    }
  }
});

let plugin: XPlugin;
let localVue: VueConstructor<Vue>;
let store: Store<any>; // Any to handle creation of new properties

describe('testing X Plugin emitters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    plugin = new XPlugin(new BaseXBus());
    XPlugin.resetInstance();
    localVue = createLocalVue();
    localVue.use(Vuex);
    store = new Store({});
  });

  describe('install XPlugin overriding store emitters', () => {
    const newSearchBoxQueryChangedSelector = jest.fn();
    const pluginOptions: XPluginOptions = {
      adapter: SearchAdapterDummy,
      __PRIVATE__xModules: {
        searchBox: {
          storeEmitters: {
            UserIsTypingAQuery: undefined,
            SearchBoxQueryChanged: newSearchBoxQueryChangedSelector
          }
        }
      },
      store
    };

    it('overrides before installing plugin', () => {
      XPlugin.registerXModule(xModule);
      localVue.use(plugin, pluginOptions);

      expectModuleToHaveBeenReplaced();
    });

    it('overrides after installing plugin', () => {
      localVue.use(plugin, pluginOptions);
      XPlugin.registerXModule(xModule);

      expectModuleToHaveBeenReplaced();
    });

    function expectModuleToHaveBeenReplaced(): void {
      const gettersInstance = {
        firstGetter: 1,
        secondGetter: 'It is awesome!'
      };

      expect(userIsTypingAQuerySelector).not.toHaveBeenCalled();
      expect(userAcceptedAQuerySelector).toHaveBeenCalledWith(
        xModule.storeModule.state(),
        gettersInstance
      );
      expect(newSearchBoxQueryChangedSelector).toHaveBeenCalledWith(
        xModule.storeModule.state(),
        gettersInstance
      );
      expect(wireInstance).toHaveBeenCalled();
    }
  });

  describe('immediate configuration option', () => {
    const testWire = jest.fn();
    const wiring = {
      SearchBoxQueryChanged: {
        setQueryWire: createWireFromFunction(testWire)
      }
    };

    // eslint-disable-next-line max-len
    it('should not execute wires with immediate `false` when the module is registered', async () => {
      const pluginOptions: XPluginOptions = {
        adapter: SearchAdapterDummy,
        xModules: {
          searchBox: {
            wiring
          }
        },
        __PRIVATE__xModules: {
          searchBox: {
            storeEmitters: {
              SearchBoxQueryChanged: state => state.query
              // immediate false by default
            }
          }
        },
        store
      };

      XPlugin.registerXModule(xModule);
      localVue.use(plugin, pluginOptions);

      /* Emitters relies on Vue watcher that are async. We need to wait a cycle before testing if
       they have emitted or not. */
      await Promise.resolve();

      expect(testWire).not.toHaveBeenCalled();
    });

    it('should execute wires with immediate `true` when the module is registered', async () => {
      const pluginOptions: XPluginOptions = {
        adapter: SearchAdapterDummy,
        xModules: {
          searchBox: {
            wiring
          }
        },
        __PRIVATE__xModules: {
          searchBox: {
            storeEmitters: {
              SearchBoxQueryChanged: {
                selector: state => state.query,
                immediate: true
              }
            }
          }
        },
        store
      };

      localVue.use(plugin, pluginOptions);
      XPlugin.registerXModule(xModule);

      /* Emitters relies on Vue watcher that are async. We need to wait a cycle before testing if
       they have emitted or not. */
      await Promise.resolve();

      expect(testWire).toHaveBeenCalled();
    });
  });

  describe('isDifferent configuration option', () => {
    // eslint-disable-next-line max-len
    it('should not trigger the event if the provided isDifferent function returns false', async () => {
      const testWire = jest.fn();
      const wiring = {
        SearchBoxQueryChanged: {
          testWire: createWireFromFunction(testWire)
        }
      };
      const pluginOptions: XPluginOptions = {
        adapter: SearchAdapterDummy,
        xModules: {
          searchBox: {
            wiring
          }
        },
        __PRIVATE__xModules: {
          searchBox: {
            storeEmitters: {
              SearchBoxQueryChanged: {
                selector: state => state.query,
                /* Only emit the event if the new query is longer than the old one */
                isDifferent: (newQuery, oldQuery) => newQuery.length > oldQuery.length
              }
            }
          }
        },
        store
      };

      XPlugin.registerXModule(xModule);
      localVue.use(plugin, pluginOptions);
      const metadata: WireMetadata = { moduleName: 'searchBox' };

      store.commit('x/searchBox/setQuery', 'wheat');
      await localVue.nextTick();
      expect(testWire).toHaveBeenCalledTimes(1);
      expect(testWire).toHaveBeenCalledWith({ eventPayload: 'wheat', metadata, store });

      store.commit('x/searchBox/setQuery', 'whe');
      await localVue.nextTick();
      expect(testWire).toHaveBeenCalledTimes(1);

      store.commit('x/searchBox/setQuery', 'wheat beer');
      await localVue.nextTick();
      expect(testWire).toHaveBeenCalledTimes(2);
      expect(testWire).toHaveBeenCalledWith({ eventPayload: 'wheat beer', metadata, store });
    });
  });
});
