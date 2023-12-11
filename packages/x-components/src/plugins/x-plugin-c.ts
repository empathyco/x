import { deepMerge } from '@empathyco/x-deep-merge';
import { Dictionary, forEach } from '@empathyco/x-utils';
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

interface XPluginObject extends PluginObject<XPluginOptions> {
  adapter?: XComponentsAdapter;
  bus: XBus<XEventsTypes, WireMetadata>;
  store?: Store<any>;
  initialXModules?: AnyXModule[];
  xModules?: XModulesOptions;
  __PRIVATE__xModules?: PrivateXModulesOptions;
  instance?: XPluginObject;
  getInstance: () => XPluginObject;
  isInstalled: boolean;
  resetInstance: () => void;
  constructor: (bus: XBus<XEventsTypes, WireMetadata>) => void;
  install: (vue: VueConstructor, options?: XPluginOptions) => void;
  registerXModule: (xModule: AnyXModule) => void;
  installedXModules: Set<string>;
  pendingXModules: Partial<Record<XModuleName, AnyXModule>>;
  wiring: Partial<Record<XModuleName, Partial<Record<XEvent, string[]>>>>;
}

const xPluginProperties = {
  /**
   * Bus for retrieving the observables when registering the wiring.
   *
   * @internal
   */
  bus: bus,
  /**
   * Adapter for the API, responsible for transforming requests and responses.
   *
   * @internal
   */
  adapter: undefined,
  /**
   * The Vuex store, to pass to the wires for its registration, and to register the store
   * modules on it.
   *
   * @internal
   */
  store: undefined,
  /**
   * The installation options of the plugin, where all the customization of
   * {@link XModule | XModules} is done.
   *
   * @internal
   */
  options: undefined,
  /**
   * Collection of {@link @empathyco/x-components/wiring/wiring.types#Wire | Wire} functions
   * that react to events of an XModule.
   *
   * @internal
   */
  wiring: {},
  /**
   * Instance of the installed plugin. Used to expose the bus and the adapter.
   *
   * @internal
   */
  instance: undefined,
  /**
   * Set of the already installed {@link XModule | XModules} to avoid re-registering them.
   *
   * @internal
   */
  installedXModules: new Set<string>(),
  /**
   * Record of modules that have been tried to be installed before the installation of the plugin.
   *
   * @internal
   */
  pendingXModules: {},
  /**
   * True if the plugin has been installed in a Vue instance, in this case
   * {@link XModule |XModules} will be installed immediately. False otherwise, in this case
   * {@link XModule | XModules} will be installed lazily when the {@link XPlugin#install} method
   * is called.
   *
   * @internal
   */
  isInstalled: false
};

/**
 * Function which returns the XPluginObject for initializing x-component's library.
 *
 * @returns The XPluginObject with properties and methods to install and register modules.
 *
 * @public
 */
export function useXPlugin(): XPluginObject {
  /**
   * Vue plugin that initializes the properties needed by the x-components, and exposes the
   * events bus and the adapter after it has been installed.
   *
   * @public
   */
  const XPlugin: XPluginObject = {
    ...xPluginProperties,
    /**
     * {@link @empathyco/x-typesm#XComponentsAdapter | XComponentsAdapter} Is the middleware
     * between the components and our API where data can be mapped to client needs.
     * This property is only available after installing the plugin.
     *
     * @returns The installed adapter.
     * @throws If this property is accessed before calling `Vue.use(xPlugin)`.
     * @public
     */
    get adapter(): XComponentsAdapter {
      return this.getInstance().adapter!;
    },
    /**
     * Exposed {@link @empathyco/x-bus#XBus}, so any kind of application can subscribe to
     * {@link XEventsTypes} without having to pass through a component.
     * This property is only available after installing the plugin.
     *
     * @returns The installed bus.
     * @throws If this property is accessed before calling `Vue.use(xPlugin)`.
     * @public
     */
    get bus(): XBus<XEventsTypes, WireMetadata> {
      return this.getInstance().bus;
    },
    /**
     * {@link https://vuex.vuejs.org | Vuex Store} Is the place where all shared data
     * is saved.
     *
     * @returns The installed store.
     * @throws If this property is accessed before calling `Vue.use(xPlugin)`.
     * @public
     */
    get store(): Store<RootXStoreState> {
      return this.getInstance().store!;
    },
    /**
     * Safely retrieves the installed instance of the XPlugin.
     *
     * @returns The installed instance of the XPlugin.
     * @throws If this method is called before calling `Vue.use(xPlugin)`.
     * @internal
     */
    getInstance(): XPluginObject {
      if (!XPlugin.instance) {
        throw Error("XPlugin must be installed before accessing it's API.");
      }
      return XPlugin.instance;
    },
    /**
     * Creates a new instance of the XPlugin with the given bus passed as parameter.
     *
     * @param bus - The {@link @empathyco/x-bus#XBus} implementation to use for the plugin.
     *
     * @public
     */
    constructor(bus: XBus<XEventsTypes, WireMetadata>) {
      this.bus = bus;
    },
    /**
     * Installs the plugin into the Vue instance.
     *
     * @param app - The GlobalVue object.
     * @param options - The options to install this plugin with.
     * @throws If the XPlugin has already been installed, or the options are not valid.
     *
     * @internal
     */
    install(app: VueConstructor, options?: XPluginOptions): void {
      if (this.isInstalled) {
        throw new Error('XPlugin has already been installed');
      }
      assertXPluginOptionsAreValid(options);
      XPlugin.instance = this;
      this.vue = app;
      this.options = options;
      this.adapter = options.adapter;
      registerStore(app, options.store);
      app.mixin(createXComponentAPIMixin(this.bus));
      registerInitialModules(options.initialXModules);
      registerPendingXModules();
      this.isInstalled = true;
    },
    /**
     * If the plugin has already been installed, it immediately registers a {@link XModule}. If it
     * has not been installed yet, it stores the module in a list until the plugin is installed.
     *
     * @param xModule - The module to register.
     *
     * @public
     */
    registerXModule(xModule: AnyXModule): void {
      if (XPlugin.instance) {
        registerXModule(xModule);
      } else {
        lazyRegisterXModule(xModule);
      }
    },
    /**
     * Utility method for resetting the installed instance of the plugin.
     *
     * @remarks Use only for testing.
     *
     * @internal
     */
    resetInstance(): void {
      cleanGettersProxyCache();
      this.instance = undefined;
    }
  };

  /**
   * Registers the {@link https://vuex.vuejs.org/ | Vuex} store. If the store has not been passed
   * through the {@link XPluginOptions} object, it creates one, and injects it in the Vue
   * prototype. Then it registers an x module in the store, to safe scope all the
   * {@link XModule | XModules} dynamically installed.
   *
   * @param app - The global Vue.
   * @param store - The store module to be registered.
   * @internal
   */
  function registerStore(app: VueConstructor, store?: Store<any>): void {
    app.use(Vuex); // We can safely install Vuex because if it is already installed Vue
    // will simply ignore it
    const _store = store ?? new Store({ strict: process.env.NODE_ENV !== 'production' });
    if (!_store) {
      app.prototype.$store = _store;
    }
    _store.registerModule('x', RootXStoreModule);
  }

  /**
   * Registers the initial {@link XModule | XModules} during the {@link XPlugin} installation.
   *
   * @param initialXModules - XModules to be registered.
   * @internal
   */
  function registerInitialModules(initialXModules: AnyXModule[] | undefined): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    initialXModules?.forEach(xModule => {
      registerXModule(xModule);
    });
  }

  /**
   * Performs the registration of a {@link XModule}.
   *
   * @param xModule - The module to register.
   *
   * @internal
   */
  function registerXModule(xModule: AnyXModule): void {
    if (!XPlugin.installedXModules.has(xModule.name)) {
      const customizedXModule = customizeXModule(xModule);
      registerStoreModule(customizedXModule);
      registerStoreEmitters(customizedXModule, XPlugin.bus, XPlugin.store as Store<any>);
      registerWiring(customizedXModule);
      // The wiring must be registered after the store emitters
      // to allow lazy loaded modules work properly.
      XPlugin.installedXModules.add(xModule.name);
      XPlugin.bus.emit('ModuleRegistered', xModule.name);
    }
  }

  /**
   * Stores the {@link XModule} in a dictionary, so it can be registered later in the installation
   * process.
   *
   * @param xModule - The module to register.
   *
   * @internal
   */
  function lazyRegisterXModule(xModule: AnyXModule): void {
    XPlugin.pendingXModules[xModule.name] = xModule;
  }

  /**
   * Performs a customization of a {@link XModule} using the XPlugin public and private options.
   *
   * @param xModule - The module to customize.
   * @returns The customized xModule.
   *
   * @internal
   */
  function customizeXModule({
    name,
    wiring,
    storeModule,
    storeEmitters,
    ...restXModule
  }: AnyXModule): AnyXModule {
    const { wiring: wiringOptions, config }: XModuleOptions<XModuleName> =
      XPlugin.options.xModules?.[name] ?? {};
    const { storeModule: storeModuleOptions, storeEmitters: emittersOptions } =
      XPlugin.options.__PRIVATE__xModules?.[name] ?? {};

    return {
      name,
      wiring: wiringOptions ? deepMerge({}, wiring, wiringOptions) : wiring,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      storeModule: customizeStoreModule(storeModule, storeModuleOptions ?? {}, config),
      storeEmitters: emittersOptions
        ? deepMerge({}, storeEmitters, emittersOptions)
        : storeEmitters,
      ...restXModule
    };
  }

  /**
   * Overrides a {@link https://vuex.vuejs.org/ | Vuex} store module definition.
   *
   * Priority of configuration merging.
   * 1st {@link XPluginOptions.xModules | xModules XPlugin option}.
   * 2nd {@link XPluginOptions.__PRIVATE__xModules | Private xModules XPlugin option}.
   * 3rd {@link XStoreModule.state | Default state of the xModule}.
   *
   * @param defaultModule - The default store module to override.
   * @param moduleOptions - The state, actions, mutations and getters to override the defaultModule.
   * @param configOptions - The state config to override the moduleOptions.
   * @returns The {@link XStoreModule} customized.
   *
   * @internal
   */
  function customizeStoreModule(
    { state: defaultState, ...actionsGettersMutations }: AnyXStoreModule,
    { state: xModuleState, ...newActionsGettersMutations }: AnyXStoreModuleOption,
    configOptions: unknown
  ): AnyXStoreModule {
    const configOptionsObject = configOptions ? { config: configOptions } : {};
    const customizedModule = deepMerge({}, actionsGettersMutations, newActionsGettersMutations);
    customizedModule.state = deepMerge(defaultState(), xModuleState, configOptionsObject);
    return customizedModule;
  }

  /**
   * Registers a {@link https://vuex.vuejs.org/ | Vuex} store module under the 'x' module.
   *
   * @param xModule - The {@link XModule} to register its Store Module.
   *
   * @internal
   */
  function registerStoreModule({ name, storeModule }: AnyXModule): void {
    (storeModule as Module<any, any>).namespaced = true;
    XPlugin.store!.registerModule(['x', name], storeModule);
  }

  /**
   * Performs the registration of the wiring, retrieving the observable for each event, and
   * executing each wire.
   *
   * @param xModule - The {@link XModule} to register its wiring.
   *
   * @internal
   */
  function registerWiring({ wiring, name }: AnyXModule): void {
    sendWiringToDevtools(name, wiring);
    forEach(wiring, (event, wires: Dictionary<AnyWire>) => {
      // Obtain the observable
      const observable = XPlugin.bus.on(event, true) as unknown as Observable<
        SubjectPayload<EventPayload<XEventsTypes, typeof event>, WireMetadata>
      >;
      // Register event wires
      forEach(wires, (_, wire) => {
        wire(observable, XPlugin.store as Store<RootXStoreState>, XPlugin.bus.on.bind(XPlugin.bus));
      });
    });
  }

  /**
   * Registers the pending {@link XModule | XModules}, that requested to be registered before the
   * installation of the plugin.
   *
   * @internal
   */
  function registerPendingXModules(): void {
    forEach(XPlugin.pendingXModules, (_, xModule) => {
      registerXModule(xModule);
    });
    XPlugin.pendingXModules = {};
  }

  return {
    ...XPlugin
  };
}

/**
 * Vue plugin that modifies each component instance, extending them with the
 * {@link XComponentAPI | X Component API }.
 *
 * @example
 * Minimal installation example. An API adapter is needed to connect the X Components with the
 * suggestions, search, or tagging APIs. In this example we are using the default Empathy's platform
 * adapter.
 *
 * ```typescript
 *  import { platformAdapter } from '@empathyco/x-adapter-platform';
 *  Vue.use(xPlugin, { adapter: platformAdapter });
 * ```
 *
 * @example
 * If you are using {@link https://vuex.vuejs.org/ | Vuex} in your project you must install its
 *   plugin, and instantiate a store before installing the XPlugin:
 * ```typescript
 * Vue.use(Vuex);
 * const store = new Store({ ... });
 * Vue.use(xPlugin, { adapter, store });
 * ```
 * @public
 */
export const xPlugin = useXPlugin().constructor(bus);
