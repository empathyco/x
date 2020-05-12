import { EmpathyAdapterBuilder } from '@empathy/search-adapter';
import { createLocalVue } from '@vue/test-utils';
import { VueConstructor } from 'vue';
import { createWireFromFunction } from '../../wiring/wires.factory';
import { installNewXPlugin } from '../../__tests__/utils';
import { BaseXBus } from '../x-bus';
import { XPlugin } from '../x-plugin';

describe('testing adapter configuration', () => {
  let xPlugin: XPlugin;
  let localVue: VueConstructor;

  beforeEach(() => {
    jest.clearAllMocks();
    xPlugin = new XPlugin(new BaseXBus());
    localVue = createLocalVue();
  });

  it('throws an error if no adapter is passed', () => {
    expect(() => localVue.use(xPlugin, {})).toThrow();
  });

  it('subscribes to the adapter configuration changes if it has a public method to do so', () => {
    const adapterConfigChangedListener = jest.fn();
    const adapter = new EmpathyAdapterBuilder().build();
    installNewXPlugin({ adapter });
    XPlugin.registerXModule({
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
