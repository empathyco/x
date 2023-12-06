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
import { AnyXStoreModuleOption, XModuleOptions, XPluginOptions } from './x-plugin.types';
import { assertXPluginOptionsAreValid } from './x-plugin.utils';

export class XPlugin implements PluginObject<XPluginOptions> {
  public static instance?: XPlugin;

  static getInstance(): XPlugin | undefined {
    return this.instance;
  }

  protected static pendingXModules: Partial<Record<XModuleName, AnyXModule>> = {};

  public wiring: Partial<Record<XModuleName, Partial<Record<XEvent, string[]>>>> = {};
  protected bus: XBus<XEventsTypes, WireMetadata>;
  protected adapter!: XComponentsAdapter;
  protected installedXModules = new Set<string>();
  protected isInstalled = false;
  protected options!: XPluginOptions;
  protected store!: Store<any>;
  protected vue!: VueConstructor;

  public constructor(bus: XBus<XEventsTypes, WireMetadata>) {
    this.bus = bus;
  }

  static registerXModule(xModule: AnyXModule): void {
    if (this.instance) {
      this.instance.registerXModule(xModule);
    } else {
      this.lazyRegisterXModule(xModule);
    }
  }

  protected static lazyRegisterXModule(xModule: AnyXModule): void {
    this.pendingXModules[xModule.name] = xModule;
  }

  install(vue: VueConstructor, options?: XPluginOptions): void {
    if (this.isInstalled) {
      throw new Error('XPlugin has already been installed');
    }
    assertXPluginOptionsAreValid(options);
    XPlugin.instance = this;
    this.vue = vue;
    this.options = options!;
    this.adapter = options.adapter;
    this.registerStore();
    this.applyMixins();
    this.registerInitialModules();
    this.registerPendingXModules();
    this.isInstalled = true;
  }

  protected registerXModule(xModule: AnyXModule): void {
    if (!this.installedXModules.has(xModule.name)) {
      const customizedXModule = this.customizeXModule(xModule);
      this.registerStoreModule(customizedXModule);
      this.registerStoreEmitters(customizedXModule);
      this.registerWiring(customizedXModule);
      this.installedXModules.add(xModule.name);
      this.bus.emit('ModuleRegistered', xModule.name);
    }
  }

  protected customizeXModule({
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
  }

  protected registerWiring({ wiring, name }: AnyXModule): void {
    sendWiringToDevtools(name, wiring);
    forEach(wiring, (event, wires: Dictionary<AnyWire>) => {
      const observable = this.bus.on(event, true) as unknown as Observable<
        SubjectPayload<EventPayload<XEventsTypes, typeof event>, WireMetadata>
      >;
      forEach(wires, (_, wire) => {
        wire(observable, this.store as Store<RootXStoreState>, this.bus.on.bind(this.bus));
      });
    });
  }

  protected registerStoreModule({ name, storeModule }: AnyXModule): void {
    (storeModule as Module<any, any>).namespaced = true;
    this.store.registerModule(['x', name], storeModule);
  }

  protected customizeStoreModule(
    { state: defaultState, ...actionsGettersMutations }: AnyXStoreModule,
    { state: xModuleState, ...newActionsGettersMutations }: AnyXStoreModuleOption,
    configOptions: unknown
  ): AnyXStoreModule {
    const configOptionsObject = configOptions ? { config: configOptions } : {};
    const customizedModule = deepMerge({}, actionsGettersMutations, newActionsGettersMutations);
    customizedModule.state = deepMerge(defaultState(), xModuleState, configOptionsObject);
    return customizedModule;
  }

  protected registerStoreEmitters(xModule: AnyXModule): void {
    registerStoreEmitters(xModule, this.bus, this.store);
  }

  protected registerStore(): void {
    this.vue.use(Vuex);
    this.store =
      this.options.store ??
      new Store({
        strict: process.env.NODE_ENV !== 'production'
      });
    if (!this.options.store) {
      this.vue.prototype.$store = this.store;
    }
    this.store.registerModule('x', RootXStoreModule);
  }

  protected applyMixins(): void {
    this.vue.mixin(createXComponentAPIMixin(this.bus));
  }

  protected registerInitialModules(): void {
    this.options.initialXModules?.forEach(xModule => {
      this.registerXModule(xModule);
    });
  }

  protected registerPendingXModules(): void {
    forEach(XPlugin.pendingXModules, (_, xModule) => {
      this.registerXModule(xModule);
    });
    XPlugin.pendingXModules = {};
  }
}

/**
 * Composable function to expose some XPlugin methods.
 *
 * @param module - The x module to register.
 * @returns Install, resetInstance & registerModule methods.
 */
export function useXPlugin(module: AnyXModule): {
  install: (vue: VueConstructor, options?: XPluginOptions) => void;
  resetInstance: () => void;
  registerXModule: (module: AnyXModule) => void;
} {
  const install = (vue: VueConstructor, options?: XPluginOptions): void => {
    const instance = new XPlugin(bus);
    instance.install(vue, options);
    XPlugin.instance = instance;
  };
  const resetInstance = (): void => {
    cleanGettersProxyCache();
    XPlugin.instance = undefined;
  };
  const registerXModule = (): void => {
    XPlugin.registerXModule(module);
  };
  return {
    install,
    resetInstance,
    registerXModule
  };
}
