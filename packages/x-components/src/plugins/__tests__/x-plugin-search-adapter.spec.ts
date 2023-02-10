import { createLocalVue } from '@vue/test-utils';
import { VueConstructor } from 'vue';
import { XPriorityBus } from '@empathyco/x-bus';
import { XPlugin } from '../x-plugin';
import { WireMetadata, XEventsTypes } from '../../wiring/index';

describe('testing adapter configuration', () => {
  let xPlugin: XPlugin;
  let localVue: VueConstructor;

  beforeEach(() => {
    jest.clearAllMocks();
    xPlugin = new XPlugin(new XPriorityBus<XEventsTypes, WireMetadata>());
    localVue = createLocalVue();
  });

  it('throws an error if no adapter is passed', () => {
    expect(() => localVue.use(xPlugin, {})).toThrow();
  });
});
