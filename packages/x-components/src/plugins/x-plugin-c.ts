import { deepMerge } from '@empathyco/x-deep-merge';
import { forEach, Dictionary } from '@empathyco/x-utils';
import { PluginObject, VueConstructor } from 'vue';
import Vuex, { Module, Store } from 'vuex';
import { XComponentsAdapter } from '@empathyco/x-types';
import { EventPayload, SubjectPayload, XBus } from '@empathyco/x-bus';
import { Observable } from 'rxjs';
import { AnyXStoreModule, RootXStoreState } from '../store/store.types';
import { cleanGettersProxyCache } from '../store/utils/getters-proxy.utils';
import { RootXStoreModule } from '../store/x.module';
import { XEvent, XEventsTypes } from '../wiring/events.types';
import { AnyWire, WireMetadata } from '../wiring/wiring.types';
import { AnyXModule, XModuleName } from '../x-modules/x-modules.types';
import { sendWiringToDevtools } from './devtools/wiring.devtools';
import { bus } from './x-bus';
import { registerStoreEmitters } from './x-emitters';
import { createXComponentAPIMixin } from './x-plugin.mixin';
import {
  AnyXStoreModuleOption,
  PrivateXModulesOptions,
  XModuleOptions,
  XModulesOptions,
  XPluginOptions
} from './x-plugin.types';
import { assertXPluginOptionsAreValid } from './x-plugin.utils';

// Based on properties and methods that arise when creating a new XPlugin instance
export interface XPluginObject extends PluginObject<XPluginOptions> {
  // XPluginOptions types
  adapter: XComponentsAdapter; // baseInstallXOptions
  bus: XBus<XEventsTypes, WireMetadata>;
  store?: Store<any>;
  initialXModules?: AnyXModule[];
  xModules?: XModulesOptions; // baseInstallXOptions
  __PRIVATE__xModules?: PrivateXModulesOptions;
  // end plugin options types

  getInstance: () => XPluginObject;
  getAdapter: () => XComponentsAdapter; // Not sure if this will be kept here
  getBus: () => XBus<XEventsTypes, WireMetadata>; // Not sure idem
  getStore: () => Store<RootXStoreState>; // Not sure idem
  lazyRegisterXModule: (xModule: AnyXModule) => void;
  resetInstance: () => void;
  pendingXModules: Partial<Record<XModuleName, AnyXModule>>;
  // registerXModule also in this level

  // inside class constructor tree
  applyMixins: () => void;
  customizeStoreModule: (
    defaultModule: AnyXStoreModule,
    moduleOptions: AnyXStoreModuleOption,
    configOptions: unknown
  ) => AnyXStoreModule;
  customizeXModule: (xModule: AnyXModule) => AnyXModule;
  install: (vue: VueConstructor, options?: XPluginOptions) => void;
  registerInitialModules: () => void;
  registerPendingXModules: () => void;
  registerStore: () => void;
  registerStoreEmitters: (xModule: AnyXModule) => void;
  registerStoreModule: (xModule: AnyXModule) => void;
  registerWiring: (xModule: AnyXModule) => void;
  registerXModule: (xModule: AnyXModule) => void;
  // eslint-disable-next-line max-len
  constructor: (bus: XBus<XEventsTypes, WireMetadata>) => void; // x-installer calls the XPlugin.constructor f() and assigns the created bus inside installer (createBus f())

  // Other internal properties that don't arise when creating a new XPlugin instance,
  // maybe we will get rid of them in the global object
  installedXModules: Set<string>;
  wiring: Partial<Record<XModuleName, Partial<Record<XEvent, string[]>>>>;
  isInstalled: boolean;
  vue: VueConstructor;
  options: XPluginOptions;
}

// The protected static instance in the XPlugin class is what we'll return as a global XPluginObject
export const useXPlugin = (): XPluginObject => {
  const XPlugin: XPluginObject = {
    install(): void {}
  };

  return {
    XPlugin
  };
};
