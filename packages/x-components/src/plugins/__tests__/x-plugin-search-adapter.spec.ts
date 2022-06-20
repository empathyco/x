import { createLocalVue } from '@vue/test-utils';
import { VueConstructor } from 'vue';
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
});
