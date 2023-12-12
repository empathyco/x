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
import { registerStoreEmitters } from './x-emitters';
import { createXComponentAPIMixin } from './x-plugin.mixin';
import { AnyXStoreModuleOption, XModuleOptions, XPluginOptions } from './x-plugin.types';
import { assertXPluginOptionsAreValid } from './x-plugin.utils';
import { bus as xBus } from './x-bus';

interface XPluginObject extends PluginObject<XPluginOptions> {
  adapter: XComponentsAdapter;
  bus: XBus<XEventsTypes, WireMetadata>;
  store: Store<any>;
  options?: XPluginOptions;
  isInstalled: boolean;
  installedXModules: Set<string>;
  install: (vue: VueConstructor, options?: XPluginOptions) => void;
  pendingXModules: Partial<Record<XModuleName, AnyXModule>>;
  registerXModule: (xModule: AnyXModule) => void;
  resetInstance: () => void;
  wiring: Partial<Record<XModuleName, Partial<Record<XEvent, string[]>>>>;
}

const xPluginProperties = {
  /**
   * Adapter for the API, responsible for transforming requests and responses.
   *
   * @internal
   */
  // We need to declare this ion order to not get possible undefined in x-modules actions
  adapter: {} as XComponentsAdapter,
  /**
   * The Vuex store, to pass to the wires for its registration, and to register the store
   * modules on it.
   *
   * @internal
   */
  // We need to declare this ion order to not get possible undefined in pdp-add-to-cart.service.ts
  store: {} as Store<any>,
  /**
   * True if the plugin has been installed in a Vue instance, in this case
   * {@link XModule | XModules} will be installed immediately. False otherwise, in this case
   * they will be installed lazily when the {@link XPlugin#install} method is called.
   *
   * @internal
   */
  isInstalled: false,
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
   * Collection of {@link @empathyco/x-components/wiring/wiring.types#Wire | Wire} functions
   * that react to events of an XModule.
   *
   * @internal
   */
  wiring: {}
};

/**
 * Function which returns the XPluginObject for initializing x-component's library.
 *
 * @param bus - The bus to create the XPlugin.
 * @returns The XPluginObject with properties and methods to install and register modules.
 *
 * @public
 */
export function useXPlugin(bus?: XBus<XEventsTypes, WireMetadata>): XPluginObject {
  /**
   * Vue plugin that initializes the properties needed by the x-components, and exposes the
   * events bus and the adapter after it has been installed.
   *
   * @public
   */
  const xPlugin: XPluginObject = {
    ...xPluginProperties,
    /**
     * Exposed {@link @empathyco/x-bus#XBus}, it can be imported locally or either
     * passed as a parameter by the {@link @empathyco/x-installer#XInstaller}.
     */
    bus: bus ?? xBus,

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
      this.vue = app;
      this.options = options;
      xPluginProperties.adapter = options.adapter;
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
      if (xPlugin) {
        registerXModule(xModule);
      } else {
        lazyRegisterXModule(xModule);
      }
    },

    /**
     * Utility method for resetting the installed plugin.
     *
     * @remarks Use only for testing.
     *
     * @internal
     */
    resetInstance(): void {
      cleanGettersProxyCache();
      // TODO: Check if this is enough to reset the plugin:
      //  Notice that now we don't need to have/access to an instance, as now xPlugin is not a class
      xPlugin.isInstalled = false;
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
    if (!store) {
      app.prototype.$store = _store;
    }
    _store.registerModule('x', RootXStoreModule);
    xPluginProperties.store = _store;
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
    if (!xPlugin.installedXModules.has(xModule.name)) {
      const customizedXModule = customizeXModule(xModule);
      registerStoreModule(customizedXModule);
      registerStoreEmitters(customizedXModule, xPlugin.bus, xPlugin.store);
      registerWiring(customizedXModule);
      // The wiring must be registered after the store emitters
      // to allow lazy loaded modules work properly.
      xPlugin.installedXModules.add(xModule.name);
      xPlugin.bus.emit('ModuleRegistered', xModule.name);
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
    xPlugin.pendingXModules[xModule.name] = xModule;
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
      xPlugin.options?.xModules?.[name] ?? {};
    const { storeModule: storeModuleOptions, storeEmitters: emittersOptions } =
      xPlugin.options?.__PRIVATE__xModules?.[name] ?? {};

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
    xPlugin.store.registerModule(['x', name], storeModule);
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
      const observable = xPlugin.bus.on(event, true) as unknown as Observable<
        SubjectPayload<EventPayload<XEventsTypes, typeof event>, WireMetadata>
      >;
      // Register event wires
      forEach(wires, (_, wire) => {
        wire(observable, xPlugin.store as Store<RootXStoreState>, xPlugin.bus.on.bind(xPlugin.bus));
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
    forEach(xPlugin.pendingXModules, (_, xModule) => {
      registerXModule(xModule);
    });
    xPlugin.pendingXModules = {};
  }

  return xPlugin;
}
