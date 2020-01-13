import { createLocalVue } from '@vue/test-utils';
import { default as Vue, VueConstructor } from 'vue';
import { AnyWire } from '../../wiring/wiring.types';
import { XPlugin } from '../x.plugin';
import { AnyXModule, XPluginOptions } from '../x.types';

const wire1: AnyWire = jest.fn();
const wire2: AnyWire = jest.fn();
const wire3: AnyWire = jest.fn();
const xModule: AnyXModule = {
  name: 'test-module',
  wiring: {
    UserTyped: {
      wire1,
      wire2,
      wire3
    }
  }
};

const newWire = jest.fn();
const replacedWire = jest.fn();
const pluginOptions: XPluginOptions = {
  xModules: {
    'test-module': {
      wiring: {
        UserTyped: {
          wire1: replacedWire,
          wire2: undefined as any,
          newWire
        }
      }
    }
  }
};

let plugin: typeof XPlugin;
let localVue: VueConstructor<Vue>;
beforeEach(() => {
  jest.resetModules().clearAllMocks();
  plugin = require('../x.plugin').XPlugin;
  localVue = createLocalVue();
});

it('allows registering a x-module before installing', () => {
  plugin.registerXModule(xModule);
  expect(wire1).not.toHaveBeenCalled();
  expect(wire2).not.toHaveBeenCalled();
  expect(wire3).not.toHaveBeenCalled();

  localVue.use(plugin);
  expect(wire1).toHaveBeenCalled();
  expect(wire2).toHaveBeenCalled();
  expect(wire3).toHaveBeenCalled();
});

it('allows registering a x-module after installing', () => {
  localVue.use(plugin);
  plugin.registerXModule(xModule);

  expect(wire1).toHaveBeenCalled();
  expect(wire2).toHaveBeenCalled();
  expect(wire3).toHaveBeenCalled();
});

it('allows overriding a x-module registered before installing', () => {
  plugin.registerXModule(xModule);
  localVue.use(plugin, pluginOptions);

  expect(wire1).not.toHaveBeenCalled();
  expect(wire2).not.toHaveBeenCalled();
  expect(wire3).toHaveBeenCalled();
  expect(replacedWire).toHaveBeenCalled();
  expect(newWire).toHaveBeenCalled();
});

it('allows overriding a x-module registered after installing', () => {
  localVue.use(plugin, pluginOptions);
  plugin.registerXModule(xModule);

  expect(wire1).not.toHaveBeenCalled();
  expect(wire2).not.toHaveBeenCalled();
  expect(wire3).toHaveBeenCalled();
  expect(replacedWire).toHaveBeenCalled();
  expect(newWire).toHaveBeenCalled();
});
