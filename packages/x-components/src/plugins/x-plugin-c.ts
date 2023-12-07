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
  adapter?: XComponentsAdapter; // baseInstallXOptions
  bus: XBus<XEventsTypes, WireMetadata>;
  store: Store<any> | Store<RootXStoreState>;
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
  // vue?: VueConstructor;
  // options?: XPluginOptions;
  // instance?: XPluginObject;
}

const initialXPluginState = {
  isInstalled: false,
  bus: bus,
  wiring: {},
  vue: undefined,
  options: undefined,
  instance: undefined,
  adapter: undefined,
  store: {},
  installedXModules: new Set<string>(),
  pendingXModules: {}
};

// The protected static instance in the XPlugin class is what we'll return as a global XPluginObject
export const useXPlugin = (): XPluginObject => {
  const XPlugin: XPluginObject = {
    ...initialXPluginState,
    getAdapter(): XComponentsAdapter {
      return this.getInstance().adapter!;
    },
    getBus(): XBus<XEventsTypes, WireMetadata> {
      return this.getInstance().bus;
    },
    getStore(): Store<RootXStoreState> {
      return this.getInstance().store;
    },
    getInstance(): XPluginObject {
      if (!this.instance) {
        throw Error("XPlugin must be installed before accessing it's API.");
      }
      return this.instance;
    },
    constructor(bus: XBus<XEventsTypes, WireMetadata>) {
      console.log(bus, 'XPlugin instance with bus as a param');
      this.bus = bus;
    },
    install(vue: VueConstructor, options?: XPluginOptions): void {
      if (this.isInstalled) {
        throw new Error('XPlugin has already been installed');
      }
      assertXPluginOptionsAreValid(options);
      XPlugin.instance = this;
      this.vue = vue;
      this.options = options;
      this.adapter = options.adapter;
      this.registerStore();
      this.applyMixins();
      this.registerInitialModules();
      this.registerPendingXModules();
      this.isInstalled = true;
    },
    registerStore(): void {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.vue.use(Vuex); // We can safely install Vuex because if it is already installed Vue
      // will simply ignore it
      this.store =
        this.options!.store ??
        new Store({
          strict: process.env.NODE_ENV !== 'production'
        });
      if (!this.options!.store) {
        this.vue!.prototype.$store = this.store;
      }
      this.store.registerModule('x', RootXStoreModule);
    },
    applyMixins(): void {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.vue.mixin(createXComponentAPIMixin(this.bus));
    },
    registerInitialModules(): void {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.options.initialXModules?.forEach(xModule => {
        this.registerXModule(xModule);
      });
    },
    registerPendingXModules(): void {
      forEach(XPlugin.pendingXModules, (_, xModule) => {
        this.registerXModule(xModule);
      });
      XPlugin.pendingXModules = {};
    },
    registerXModule(xModule: AnyXModule): void {
      if (this.instance) {
        if (!this.installedXModules.has(xModule.name)) {
          const customizedXModule = this.customizeXModule(xModule);
          this.registerStoreModule(customizedXModule);
          this.registerStoreEmitters(customizedXModule);
          this.registerWiring(customizedXModule);
          // The wiring must be registered after the store emitters
          // to allow lazy loaded modules work properly.
          this.installedXModules.add(xModule.name);
          this.bus.emit('ModuleRegistered', xModule.name);
        }
      } else {
        this.lazyRegisterXModule(xModule);
      }
    },
    lazyRegisterXModule(xModule: AnyXModule): void {
      this.pendingXModules[xModule.name] = xModule;
    },
    customizeXModule({
      name,
      wiring,
      storeModule,
      storeEmitters,
      ...restXModule
    }: AnyXModule): AnyXModule {
      const { wiring: wiringOptions, config }: XModuleOptions<XModuleName> =
        this.options.xModules?.[name] ?? {};

      const { storeModule: storeModuleOptions, storeEmitters: emittersOptions } =
        this.options.__PRIVATE__xModules?.[name] ?? {};

      return {
        name,
        wiring: wiringOptions ? deepMerge({}, wiring, wiringOptions) : wiring,
        storeModule: this.customizeStoreModule(storeModule, storeModuleOptions ?? {}, config),
        storeEmitters: emittersOptions
          ? deepMerge({}, storeEmitters, emittersOptions)
          : storeEmitters,
        ...restXModule
      };
    },
    customizeStoreModule(
      { state: defaultState, ...actionsGettersMutations }: AnyXStoreModule,
      { state: xModuleState, ...newActionsGettersMutations }: AnyXStoreModuleOption,
      configOptions: unknown
    ): AnyXStoreModule {
      const configOptionsObject = configOptions ? { config: configOptions } : {};
      const customizedModule = deepMerge({}, actionsGettersMutations, newActionsGettersMutations);
      customizedModule.state = deepMerge(defaultState(), xModuleState, configOptionsObject);
      return customizedModule;
    },
    registerStoreModule({ name, storeModule }: AnyXModule): void {
      (storeModule as Module<any, any>).namespaced = true;
      this.store.registerModule(['x', name], storeModule);
    },
    registerStoreEmitters(xModule: AnyXModule): void {
      registerStoreEmitters(xModule, this.bus, this.store);
    },
    registerWiring({ wiring, name }: AnyXModule): void {
      sendWiringToDevtools(name, wiring);
      forEach(wiring, (event, wires: Dictionary<AnyWire>) => {
        // Obtain the observable
        const observable = this.bus.on(event, true) as unknown as Observable<
          SubjectPayload<EventPayload<XEventsTypes, typeof event>, WireMetadata>
        >;
        // Register event wires
        forEach(wires, (_, wire) => {
          wire(observable, this.store as Store<RootXStoreState>, this.bus.on.bind(this.bus));
        });
      });
    },
    resetInstance(): void {
      cleanGettersProxyCache();
      this.instance = undefined;
    }
  };

  return {
    XPlugin
  };
};
