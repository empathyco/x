import { createLocalVue } from '@vue/test-utils';
import { default as Vue, VueConstructor } from 'vue';
import Vuex, { Store } from 'vuex';
import { createWireFromFunction } from '../../wiring/wires.factory';
import { AnyXModule } from '../../x-modules/x-modules.types';
import { SearchAdapterDummy } from '../../__tests__/adapter.dummy';
import { XPlugin } from '../x-plugin';
import { XPluginOptions } from '../x-plugin.types';

const wireInstance = jest.fn();
const userIsTypingAQuerySelector = jest.fn();
const userAcceptedAQuerySelector = jest.fn();

const stateInstance = {
  query: 'toy story',
  complexProp: { firstComplexProp: 'First prop', secondComplexProp: 2 }
};
const xModule: AnyXModule = {
  name: 'searchBox',
  wiring: {
    SearchBoxQueryChanged: { wireInstance }
  },
  storeEmitters: {
    UserIsTypingAQuery: userIsTypingAQuerySelector,
    UserAcceptedAQuery: userAcceptedAQuerySelector
  },
  storeModule: {
    state: () => stateInstance,
    getters: {
      firstGetter: () => 1,
      secondGetter: () => 'It is awesome!'
    },
    actions: {},
    mutations: {}
  }
};

let plugin: typeof XPlugin;
let localVue: VueConstructor<Vue>;
let store: Store<any>; // Any to handle creation of new properties

describe('testing X Plugin emitters', () => {
  beforeEach(() => {
    jest.resetModules().clearAllMocks();
    plugin = require('../x-plugin').XPlugin;
    localVue = createLocalVue();
    localVue.use(Vuex);
    store = new Store({});
  });

  describe('install XPlugin overriding store emitters', () => {
    const newSearchBoxQueryChangedSelector = jest.fn();
    const pluginOptions: XPluginOptions = {
      adapter: SearchAdapterDummy,
      xModules: {
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
      const gettersInstance = {
        firstGetter: 1,
        secondGetter: 'It is awesome!'
      };

      expect(userIsTypingAQuerySelector).not.toHaveBeenCalled();
      expect(userAcceptedAQuerySelector).toHaveBeenCalledWith(stateInstance, gettersInstance);
      expect(newSearchBoxQueryChangedSelector).toHaveBeenCalledWith(stateInstance, gettersInstance);
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
            wiring,
            storeEmitters: {
              SearchBoxQueryChanged: state => state.query
              // immediate false by default
            }
          }
        },
        store
      };

      plugin.registerXModule(xModule);
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
            wiring,
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
      plugin.registerXModule(xModule);

      /* Emitters relies on Vue watcher that are async. We need to wait a cycle before testing if
       they have emitted or not. */
      await Promise.resolve();

      expect(testWire).toHaveBeenCalled();
    });
  });
});
