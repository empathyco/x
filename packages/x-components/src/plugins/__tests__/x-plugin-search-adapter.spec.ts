import { EmpathyAdapterBuilder } from '@empathy/search-adapter';
import { createLocalVue } from '@vue/test-utils';
import { createWireFromFunction } from '../../wiring/wires.factory';
import { XPlugin } from '../x-plugin';
import { VueConstructor } from 'vue';

describe('testing adapter configuration', () => {
  let plugin: typeof XPlugin;
  let localVue: VueConstructor;

  beforeEach(() => {
    jest.resetModules().clearAllMocks();
    plugin = require('../x-plugin').XPlugin;
    localVue = createLocalVue();
  });

  it('throws an error if no adapter is passed', () => {
    expect(() => localVue.use(plugin, {})).toThrow();
  });

  it('subscribes to the adapter configuration changes if it has a public method to do so', () => {
    const adapterConfigChangedListener = jest.fn();
    const adapter = new EmpathyAdapterBuilder().build();
    localVue.use(plugin, {
      adapter
    });
    plugin.registerXModule({
      name: 'nextQueries',
      storeModule: {
        actions: {},
        mutations: {},
        getters: {},
        state() {
          return {};
        }
      },
      storeEmitters: {},
      wiring: {
        AdapterConfigChanged: {
          testWire: createWireFromFunction(adapterConfigChangedListener)
        }
      }
    });
    adapter.setConfig({ instance: 'x-components-test' });

    expect(adapterConfigChangedListener).toHaveBeenCalledTimes(1);
  });
});
