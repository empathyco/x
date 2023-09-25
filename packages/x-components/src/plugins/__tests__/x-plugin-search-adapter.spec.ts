import { createLocalVue } from '@vue/test-utils';
import { VueConstructor } from 'vue';
import { XPlugin } from '../x-plugin';
import { XDummyBus } from '../../__tests__/bus.dummy';

describe('testing adapter configuration', () => {
  let xPlugin: XPlugin;
  let localVue: VueConstructor;

  beforeEach(() => {
    jest.clearAllMocks();
    xPlugin = new XPlugin(new XDummyBus());
    localVue = createLocalVue();
  });

  it('throws an error if no adapter is passed', () => {
    expect(() => localVue.use(xPlugin, {})).toThrow();
  });
});
