import { mount } from '@vue/test-utils';
import { XPlugin } from '../x-plugin';
import { XDummyBus } from '../../__tests__/bus.dummy';

describe('testing adapter configuration', () => {
  let xPlugin: XPlugin;

  beforeEach(() => {
    jest.clearAllMocks();
    xPlugin = new XPlugin(new XDummyBus());
  });

  it('throws an error if no adapter is passed', () => {
    expect(() => mount({}, { global: { plugins: [xPlugin] } })).toThrow();
  });
});
