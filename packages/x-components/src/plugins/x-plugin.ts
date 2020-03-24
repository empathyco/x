import { SearchAdapter } from '@empathy/search-adapter';
import { deepMerge } from '@empathybroker/deep-merge';
import { VueConstructor } from 'vue';
import Vuex, { Module, Store } from 'vuex';
import { registerReactiveConfig } from '../services/config.service';
import {
  AnySimpleStateSelector,
  AnyStateSelector,
  AnyStoreEmitters
} from '../store/store-emitters.types';
import { AnyXStoreModule } from '../store/store.types';
import { RootXStoreModule } from '../store/x.module';
import { DeepPartial, Dictionary, forEach, reduce } from '../utils';
import { AnyWire, Wiring } from '../wiring/wiring.types';
import { AnyXModule, XModuleName } from '../x-modules/x-modules.types';
import { bus } from './x-bus';
import { DEFAULT_X_CONFIG } from './x-plugin.config';
import { createXComponentAPIMixin } from './x-plugin.mixin';
import { AnyXStoreModuleOptions, XConfig, XModuleOptions, XPluginOptions } from './x-plugin.types';
import { assertXPluginOptionsAreValid } from './x-plugin.utils';

/**
 * Vue plugin that modifies each component instance, extending them with the
 * {@link XComponentAPI | X Component API }.
 *
 * @example
 * Minimal installation example. A search adapter is needed for the plugin to work, and connect to
 * the API.
 * ```typescript
 * const adapter = new EmpathyAdapterBuilder()
 *  .withConfiguration({instance: 'my-instance-id'})
 *  .build();
 * Vue.use(XPlugin, { adapter });
 * ```
 *
 * @example
 * If you are using {@link https://vuex.vuejs.org/ | Vuex} in your project you must install its
 *   plugin, and instantiate an store before installing the XPlugin:
 * ```typescript
 * Vue.use(Vuex);
 * const store = new Store({ ... });
 * Vue.use(XPlugin, { adapter, store });
 * ```
 *
 * @public
 */
export class XPlugin {
  /** {@link @empathy/search-adapter#SearchAdapter | SearchAdapter} Is the middleware between
   * the components and our API where data can be mapped to client needs.
   *
   * @public
   */
  public static adapter: SearchAdapter;

  /** Instance of the singleton.
   *
   * @internal
   */
  protected static instance = new XPlugin();
  /** Bus for retrieving the observables when registering the wiring.
   *
   * @internal
   */
  protected bus = bus; // TODO Inject this constructor
  /** Set of the already installed {@link XModule | XModules} to avoid re-registering them.
   *
   * @internal
   */
  protected installedXModules = new Set<string>();
  /** True if the plugin has been installed in a Vue instance, in this case
   * {@link XModule |Xmodules} will be installed immediately. False otherwise, in this case
   * {@link XModule | XModules} will be installed lazily when the {@link XPlugin#install} method
   * is called.
   *
   * @internal
   */
  protected isInstalled = false;
  /** The install options of the plugin, where all the customization of
   * {@link XModule | XModules} is done.
   *
   * @internal
   */
  protected options!: XPluginOptions;
  /** Record of modules that have been tried to be installed before the installation of the plugin.
   *
   * @internal
   */
  protected pendingXModules: Partial<Record<XModuleName, AnyXModule>> = {};
  /** The Vuex store, to pass to the wires for its registration, and to register the store
   * modules on it.
   *
   * @internal
   */
  protected store!: Store<any>;
  /** The global Vue, passed by the install method. Used to apply the global mixin
   * {@link createXComponentAPIMixin}, and install the {@link https://vuex.vuejs.org/ | Vuex}
   * plugin.
   *
   * @internal
   */
  protected vue!: VueConstructor;
  /** The {@link XConfig} is a reactive configuration.
   *
   * @internal
   */
  protected xConfig!: XConfig;

  /**
   * Protected constructor to ensure that this class is only instantiated once.
   * It needs to be a singleton because Vue accepts either a function as plugin, or an object that
   * exposes an install(...) method.
   *
   * @internal
   */
  protected constructor() {}

  /**
   * Installs the plugin into the Vue instance.
   *
   * @param vue - The GlobalVue object.
   * @param options - The options to install this plugin with.
   * @internal
   */
  static install(vue: VueConstructor, options?: XPluginOptions): void {
    const instance = this.instance;
    assertXPluginOptionsAreValid(options);
    this.adapter = options.adapter;
    instance.vue = vue;
    instance.options = options;
    instance.registerConfig();
    instance.registerStore();
    instance.applyMixins();
    instance.registerPendingXModules();
    instance.isInstalled = true;
  }

  /**
   * If the plugin has already been installed, it immediately registers a {@link XModule}. If it
   * has not been installed yet, it stores the module in a list until the plugin is installed.
   *
   * @param xModule - The module to register.
   */
  static registerXModule(xModule: AnyXModule): void {
    const instance = this.instance;
    if (instance.isInstalled) {
      instance.registerXModule(xModule);
    } else {
      instance.lazyRegisterXModule(xModule);
    }
  }

  /**
   * Overrides the existing {@link XConfig}.
   *
   * @param config - The new or partially new global {@link XConfig}.
   * @public
   */
  static setConfig(config: DeepPartial<XConfig>): void {
    deepMerge(this.instance.xConfig, config);
  }

  /**
   * Gets the global reactive {@link XConfig}.
   *
   * @returns Config - The xConfig.
   * @public
   */
  static getConfig(): XConfig {
    return this.instance.xConfig;
  }

  /**
   * Performs the registration of a {@link XModule}.
   *
   * @param xModule - The module to register.
   * @internal
   */
  protected registerXModule({ name, wiring, storeModule, storeEmitters }: AnyXModule): void {
    if (!this.installedXModules.has(name)) {
      this.registerStoreModule(name, storeModule);
      this.registerWiring(name, wiring);
      this.registerStoreEmitters(name, storeModule, storeEmitters);
      this.installedXModules.add(name);
    }
  }

  /**
   * Stores the {@link XModule} in a dictionary, so it can be registered later in the install
   * process.
   *
   * @param xModule - The module to register.
   * @internal
   */
  protected lazyRegisterXModule(xModule: AnyXModule): void {
    this.pendingXModules[xModule.name] = xModule;
  }

  /**
   * Performs the registration of the wiring, retrieving the observable for each event, and
   * executing each wire.
   *
   * @param name - The name of the {@link XModule} of the wiring.
   * @param wiring - The wiring to register.
   * @internal
   */
  protected registerWiring(name: XModuleName, wiring: Partial<Wiring>): void {
    const wiringOptions = this.getModuleOptions(name)?.wiring;
    const customizedWiring: Partial<Wiring> = wiringOptions
      ? deepMerge({}, wiring, wiringOptions)
      : wiring;
    forEach(customizedWiring, (event, wires: Dictionary<AnyWire>) => {
      // Obtain the observable
      const observable = this.bus.on(event, true);
      // Register event wires
      forEach(wires, (_, wire) => {
        wire(observable, this.store);
      });
    });
  }

  /**
   * Registers a {@link https://vuex.vuejs.org/ | Vuex} store module under the 'x' module.
   *
   * @param name - The module name.
   * @param storeModule - The module definition to register.
   * @internal
   */
  protected registerStoreModule(name: XModuleName, storeModule: AnyXStoreModule): void {
    const storeModuleOptions = this.getModuleOptions(name)?.storeModule;
    const customizedStoreModule: Module<any, any> = storeModuleOptions
      ? this.customizeStoreModule(storeModule, storeModuleOptions)
      : storeModule;
    customizedStoreModule.namespaced = true;
    this.addConfigMutation(customizedStoreModule);
    this.store.registerModule(['x', name], customizedStoreModule);
  }

  /**
   * Adds to a {@link https://vuex.vuejs.org/ | Vuex} store module the mutation `setConfig` if
   * the module has a `config` in its state.
   *
   * @param storeModule - The module definition to add the mutation.
   * @returns The same module with the new mutation.
   *
   * @internal
   */
  protected addConfigMutation(storeModule: Module<any, any>): Module<any, any> {
    if (this.hasModuleConfig(storeModule)) {
      const moduleMutations = storeModule.mutations;
      if (!moduleMutations) {
        storeModule.mutations = {
          setConfig: this.getDefaultSetConfigMutation()
        };
      } else if (!moduleMutations.setConfig) {
        moduleMutations.setConfig = this.getDefaultSetConfigMutation();
      }
    }
    return storeModule;
  }

  /**
   * Creates a default set config mutation which simply assigns the new configuration entry to
   * the state.
   *
   * @returns A default implementation of the setConfig mutation.
   * @internal
   */
  protected getDefaultSetConfigMutation(): (state: any, config: any) => void {
    return function setConfig(state: any, config: any): void {
      Object.assign(state.config, config);
    };
  }

  /**
   * Checks if a {@link https://vuex.vuejs.org/ | Vuex} store module has `config` in the state.
   *
   * @param storeModule - The module definition to add the mutation.
   * @returns Boolean - true if the module has config in its state, false if not.
   *
   * @internal
   */
  protected hasModuleConfig(storeModule: Module<any, any>): boolean {
    return typeof storeModule.state === 'function'
      ? !!storeModule.state().config
      : !!storeModule.state.config;
  }

  /**
   * Retrieves the override options of an {@link XModule}.
   *
   * @param name - The module name.
   * @returns Options of the {@link XModule}.
   * @internal
   */
  protected getModuleOptions(name: XModuleName): XModuleOptions<AnyXModule> | undefined {
    return this.options.xModules?.[name];
  }

  /**
   * Overrides a {@link https://vuex.vuejs.org/ | Vuex} store module definition.
   *
   * @param defaultModule - The module to override its configuration.
   * @param moduleOptions - The options to override the defaultModule.
   * @returns The {@link XStoreModule} customized.
   * @internal
   */
  protected customizeStoreModule(
    { state: getState, ...actionsGettersMutations }: AnyXStoreModule,
    { state: stateOptions, ...newActionsGettersMutations }: AnyXStoreModuleOptions
  ): AnyXStoreModule {
    const customizedModule = deepMerge({}, actionsGettersMutations, newActionsGettersMutations);
    customizedModule.state = deepMerge(getState(), stateOptions);
    return customizedModule;
  }

  /**
   * Registers the store emitters, making them emit the event when the part of the state selected
   * changes.
   *
   * @param name - The module name.
   * @param storeModule - The store module to retrieve its state and getters.
   * @param storeEmitters - The store emitters to register.
   * @internal
   */
  protected registerStoreEmitters(
    name: XModuleName,
    storeModule: AnyXStoreModule,
    storeEmitters: AnyStoreEmitters
  ): void {
    const storeEmittersOptions = this.getModuleOptions(name)?.storeEmitters;
    const customizedStoreEmitters: AnyStoreEmitters = storeEmittersOptions
      ? deepMerge({}, storeEmitters, storeEmittersOptions)
      : storeEmitters;
    const safeGettersProxy = this.getModuleGetters(name, storeModule);
    forEach(
      customizedStoreEmitters,
      (event, stateSelector: AnySimpleStateSelector | AnyStateSelector) => {
        const { selector, ...options } = this.isSimpleSelector(stateSelector)
          ? { selector: stateSelector }
          : stateSelector;
        this.store.watch(
          state => selector(state.x[name], safeGettersProxy),
          changedState => {
            this.bus.emit(event, changedState, { moduleName: name });
          },
          options
        );
      }
    );
  }

  /**
   * Creates a proxy object of the getters of the storeModule passed, which will be the object
   * passed as getters to the stateSelector, of the module. This is done to ensure that a Vuex
   * stateSelector can only access the getters of the {@link XModule} where it is registered.
   *
   * @param moduleName - The name of the module.
   * @param storeModule - The store module.
   * @returns Dictionary with only the getters of the {@link XModule}.
   * @internal
   */
  protected getModuleGetters(moduleName: XModuleName, storeModule: AnyXStoreModule): Dictionary {
    const getters = this.store.getters;
    return reduce(
      storeModule.getters as Dictionary,
      (safeGettersProxy, getterName) => {
        Object.defineProperty(safeGettersProxy, getterName, {
          get() {
            return getters[`x/${moduleName}/${getterName}`];
          },
          enumerable: true
        });
        return safeGettersProxy;
      },
      {} as Dictionary
    );
  }

  /**
   * Registers the {@link https://vuex.vuejs.org/ | Vuex} store. If the store has not been passed
   * through the {@link XPluginOptions} object, it creates one, and injects it in the Vue
   * prototype. Then it register an x module in the store, to safe scope all the
   * {@link XModule | XModules} dynamically installed.
   *
   * @internal
   */
  protected registerStore(): void {
    this.vue.use(Vuex); // We can safely install Vuex because if it is already installed Vue
    // will simply ignore it
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

  /**
   * Applies the {@link createXComponentAPIMixin} mixin in the global Vue.
   *
   * @internal
   */
  protected applyMixins(): void {
    this.vue.mixin(createXComponentAPIMixin(this.xConfig));
  }

  /**
   * Registers the pending {@link XModule | XModules}, that requested to be registered before the
   * installation of the plugin.
   *
   * @internal
   */
  protected registerPendingXModules(): void {
    forEach(this.pendingXModules, (_, xModule) => {
      this.registerXModule(xModule);
    });
  }

  /**
   * Registers the global reactive {@link XConfig}.
   *
   * @internal
   */
  protected registerConfig(): void {
    const config: XConfig = deepMerge({}, DEFAULT_X_CONFIG, this.options.config);
    this.createAdapterConfigChangedListener(this.options.adapter);
    this.xConfig = registerReactiveConfig(this.bus, config);
  }

  /**
   * If the received adapter supports it, it registers a listener to emit the
   * {@link XEventsTypes.AdapterConfigChanged} event whenever the config of it changes.
   *
   * @param adapter - The adapter to register the listener when its config changes.
   * @internal
   */
  protected createAdapterConfigChangedListener(adapter: SearchAdapter): void {
    adapter.addConfigChangedListener?.(newAdapterConfig => {
      this.bus.emit('AdapterConfigChanged', newAdapterConfig);
    });
  }

  /**
   * Checks if a the type of the store emitter selector is simple or complex. This selector can be
   * a function if it is simple or an object with the selector and other options if it is complex.
   *
   * @param stateSelector - The store emitter selector.
   * @returns A boolean which flags if the stateSelector is simple (function) or complex (object).
   * @internal
   */
  protected isSimpleSelector(
    stateSelector: AnySimpleStateSelector | AnyStateSelector
  ): stateSelector is AnySimpleStateSelector {
    return typeof stateSelector === 'function';
  }
}
