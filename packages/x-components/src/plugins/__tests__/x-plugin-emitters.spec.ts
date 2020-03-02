import { createLocalVue } from '@vue/test-utils';
import { Observable } from 'rxjs/Observable';
import { default as Vue, VueConstructor } from 'vue';
import Vuex, { Store } from 'vuex';
import { AnyXModule } from '../../x-modules/x-modules.types';
import { XPlugin } from '../x-plugin';
import { XPluginOptions } from '../x-plugin.types';

const wireInstance = jest.fn();
const userTypedSelector = jest.fn();
const userIsChangingQuerySelector = jest.fn();
const userSelectedAQuerySelector = jest.fn();

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
    UserTyped: userTypedSelector,
    UserIsChangingQuery: userIsChangingQuerySelector,
    UserSelectedAQuery: userSelectedAQuerySelector
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
    const newUserTypedSelector = jest.fn();
    const newSearchBoxQueryChangedSelector = jest.fn();
    const pluginOptions: XPluginOptions = {
      xModules: {
        searchBox: {
          storeEmitters: {
            UserTyped: newUserTypedSelector,
            UserIsChangingQuery: undefined,
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

    function expectModuleToHaveBeenReplaced() {
      const gettersInstance = {
        firstGetter: 1,
        secondGetter: 'It is awesome!'
      };

      expect(userTypedSelector).not.toHaveBeenCalled();
      expect(userIsChangingQuerySelector).not.toHaveBeenCalled();
      expect(userSelectedAQuerySelector).toHaveBeenCalledWith(stateInstance, gettersInstance);
      expect(newUserTypedSelector).toHaveBeenCalledWith(stateInstance, gettersInstance);
      expect(newSearchBoxQueryChangedSelector).toHaveBeenCalledWith(stateInstance, gettersInstance);
      expect(wireInstance).toHaveBeenCalled();
    }
  });

  describe('immediate configuration option', () => {
    const setQuerySubscriber = jest.fn();
    const wiring = {
      SearchBoxQueryChanged: {
        setQueryWire: (observable: Observable<string>) =>
          observable.subscribe(query => setQuerySubscriber(query))
      }
    };

    it('should not execute wires with immediate false when the module is registered', () => {
      const pluginOptions: XPluginOptions = {
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

      expect(setQuerySubscriber).not.toHaveBeenCalled();
    });

    it('should execute wires with immediate false when the module is registered', () => {
      const pluginOptions: XPluginOptions = {
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

      expect(setQuerySubscriber).toHaveBeenCalled();
      expect(setQuerySubscriber).toHaveBeenCalledWith(stateInstance.query);
    });
  });
});
