import { deepMerge } from '@empathyco/x-deep-merge';
import { forEach, Dictionary } from '@empathyco/x-utils';
import { App, PluginObject, VueConstructor } from 'vue';
import { createStore, Module, Store } from 'vuex';
import { XComponentsAdapter } from '@empathyco/x-types';
import { EventPayload, SubjectPayload, XBus } from '@empathyco/x-bus';
import { Observable } from 'rxjs';
import { AnyXStoreModule, RootXStoreState } from '../store/store.types';
import { XEvent, XEventsTypes } from '../wiring/events.types';
import { AnyWire, WireMetadata } from '../wiring/wiring.types';
import { deviceXStoreModule } from '../x-modules/device/store/module';
import { empathizeXStoreModule } from '../x-modules/empathize/store/module';
import { experienceControlsXStoreModule } from '../x-modules/experience-controls/store/module';
import { extraParamsXStoreModule } from '../x-modules/extra-params/store/module';
import { facetsXStoreModule } from '../x-modules/facets/store/module';
import { historyQueriesXStoreModule } from '../x-modules/history-queries/store/module';
import { identifierResultsXStoreModule } from '../x-modules/identifier-results/store/module';
import { nextQueriesXStoreModule } from '../x-modules/next-queries/store/module';
import { popularSearchesXStoreModule } from '../x-modules/popular-searches/store/module';
import { queriesPreviewXStoreModule } from '../x-modules/queries-preview/store/module';
import { querySuggestionsXStoreModule } from '../x-modules/query-suggestions/store/module';
import { recommendationsXStoreModule } from '../x-modules/recommendations/store/module';
import { relatedTagsXStoreModule } from '../x-modules/related-tags/store/module';
import { scrollXStoreModule } from '../x-modules/scroll/store/module';
import { searchBoxXStoreModule } from '../x-modules/search-box/store/module';
import { searchXStoreModule } from '../x-modules/search/store/module';
import { semanticQueriesXStoreModule } from '../x-modules/semantic-queries/store/module';
import { taggingXStoreModule } from '../x-modules/tagging/store/module';
import { urlXStoreModule } from '../x-modules/url/store/module';
import { AnyXModule, XModuleName } from '../x-modules/x-modules.types';
import { sendWiringToDevtools } from './devtools/wiring.devtools';
import { bus } from './x-bus';
import { registerStoreEmitters } from './x-emitters';
import { AnyXStoreModuleOption, XModuleOptions, XPluginOptions } from './x-plugin.types';
import { assertXPluginOptionsAreValid } from './x-plugin.utils';

/**
 * Vue plugin that initializes the properties needed by the x-components, and exposes the events bus
 * and the adapter after it has been installed.
 *
 * @public
 */
export class XPlugin implements PluginObject<XPluginOptions> {
  /**
   * {@link @empathyco/x-typesm#XComponentsAdapter | XComponentsAdapter} Is the middleware
   * between the components and our API where data can be mapped to client needs.
   * This property is only available after installing the plugin.
   *
   * @returns The installed adapter.
   * @throws If this property is accessed before calling `Vue.use(xPlugin)`.
   * @public
   */
  public static get adapter(): XComponentsAdapter {
    return this.getInstance().adapter;
  }

  /**
   * Exposed {@link @empathyco/x-bus#XBus}, so any kind of application can subscribe to
   * {@link XEventsTypes} without having to pass through a component.
   * This property is only available after installing the plugin.
   *
   * @returns The installed bus.
   * @throws If this property is accessed before calling `Vue.use(xPlugin)`.
   * @public
   */
  public static get bus(): XBus<XEventsTypes, WireMetadata> {
    return this.getInstance().bus;
  }

  /**
   * {@link https://vuex.vuejs.org | Vuex Store} Is the place where all shared data
   * is saved.
   *
   * @returns The installed store.
   * @throws If this property is accessed before calling `Vue.use(xPlugin)`.
   * @public
   */
  public static get store(): Store<RootXStoreState> {
    return this.getInstance().store;
  }

  /**
   * Safely retrieves the installed instance of the XPlugin.
   *
   * @returns The installed instance of the XPlugin.
   * @throws If this method is called before calling `Vue.use(xPlugin)`.
   * @internal
   */
  protected static getInstance(): XPlugin {
    if (!this.instance) {
      throw Error("XPlugin must be installed before accessing it's API.");
    }
    return this.instance;
  }

  /**
   * Record of modules that have been tried to be installed before the installation of the plugin.
   *
   * @internal
   */
  protected static pendingXModules: Partial<Record<XModuleName, AnyXModule>> = {};

  /**
   * Instance of the installed plugin. Used to expose the bus and the adapter.
   *
   * @internal
   */
  protected static instance?: XPlugin;

  public wiring: Partial<Record<XModuleName, Partial<Record<XEvent, string[]>>>> = {};
  /**
   * Bus for retrieving the observables when registering the wiring.
   *
   * @internal
   */
  protected bus: XBus<XEventsTypes, WireMetadata>;

  /**
   * Adapter for the API, responsible for transforming requests and responses.
   *
   * @internal
   */
  protected adapter!: XComponentsAdapter;

  /**
   * Set of the already installed {@link XModule | XModules} to avoid re-registering them.
   *
   * @internal
   */
  protected installedXModules = new Set<string>();

  /**
   * True if the plugin has been installed in a Vue instance, in this case
   * {@link XModule |Xmodules} will be installed immediately. False otherwise, in this case
   * {@link XModule | XModules} will be installed lazily when the {@link XPlugin#install} method
   * is called.
   *
   * @internal
   */
  protected isInstalled = false;

  /**
   * The installation options of the plugin, where all the customization of
   * {@link XModule | XModules} is done.
   *
   * @internal
   */
  protected options!: XPluginOptions;

  /**
   * The Vuex store, to pass to the wires for its registration, and to register the store
   * modules on it.
   *
   * @internal
   */
  protected store!: Store<any>;
  /**
   * The global Vue, passed by the installation method. Used to apply the global mixin
   * {@link createXComponentAPIMixin}, and install the {@link https://vuex.vuejs.org/ | Vuex}
   * plugin.
   *
   * @internal
   */
  protected vue!: VueConstructor;

  /**
   * Creates a new instance of the XPlugin with the given bus passed as parameter.
   *
   * @param bus - The {@link @empathyco/x-bus#XBus} implementation to use for the plugin.
   *
   * @public
   */
  public constructor(bus: XBus<XEventsTypes, WireMetadata>) {
    this.bus = bus;
  }

  /**
   * If the plugin has already been installed, it immediately registers a {@link XModule}. If it
   * has not been installed yet, it stores the module in a list until the plugin is installed.
   *
   * @param xModule - The module to register.
   *
   * @public
   */
  static registerXModule(xModule: AnyXModule): void {
    if (this.instance) {
      this.instance.registerXModule(xModule);
    } else {
      this.lazyRegisterXModule(xModule);
    }
  }

  /**
   * Utility method for resetting the installed instance of the plugin.
   *
   * @remarks Use only for testing.
   *
   * @internal
   */
  static resetInstance(): void {
    this.instance = undefined;
  }

  /**
   * Stores the {@link XModule} in a dictionary, so it can be registered later in the installation
   * process.
   *
   * @param xModule - The module to register.
   *
   * @internal
   */
  protected static lazyRegisterXModule(xModule: AnyXModule): void {
    this.pendingXModules[xModule.name] = xModule;
  }

  /**
   * Installs the plugin into the Vue instance.
   *
   * @param vue - The GlobalVue object.
   * @param options - The options to install this plugin with.
   * @throws If the XPlugin has already been installed, or the options are not valid.
   *
   * @internal
   */
  install(vue: App, options?: XPluginOptions): void {
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
  }

  /**
   * Performs the registration of a {@link XModule}.
   *
   * @param xModule - The module to register.
   *
   * @internal
   */
  protected registerXModule(xModule: AnyXModule): void {
    if (!this.installedXModules.has(xModule.name)) {
      // const customizedXModule = this.customizeXModule(xModule);
      // this.registerStoreModule(customizedXModule);
      this.registerStoreEmitters(xModule);
      this.registerWiring(xModule);
      // The wiring must be registered after the store emitters
      // to allow lazy loaded modules work properly.
      this.installedXModules.add(xModule.name);
      this.bus.emit('ModuleRegistered', xModule.name);
    }
  }

  /**
   * Performs a customization of a {@link XModule} using the XPlugin public and private options.
   *
   * @param xModule - The module to customize.
   * @returns The customized xModule.
   *
   * @internal
   */
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

  /**
   * Performs the registration of the wiring, retrieving the observable for each event, and
   * executing each wire.
   *
   * @param xModule - The {@link XModule} to register its wiring.
   *
   * @internal
   */
  protected registerWiring({ wiring, name }: AnyXModule): void {
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
  }

  /**
   * Registers a {@link https://vuex.vuejs.org/ | Vuex} store module under the 'x' module.
   *
   * @param xModule - The {@link XModule} to register its Store Module.
   *
   * @internal
   */
  protected registerStoreModule({ name, storeModule }: AnyXModule): void {
    (storeModule as Module<any, any>).namespaced = true;
    this.store.registerModule(['x', name], storeModule);
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

  /**
   * Registers the store emitters, making them emit the event when the part of the state selected
   * changes.
   *
   * @param xModule - The {@link XModule} to register its Store Emitters.
   *
   * @internal
   */
  protected registerStoreEmitters(xModule: AnyXModule): void {
    registerStoreEmitters(xModule, this.bus, this.store);
  }

  /**
   * Registers the {@link https://vuex.vuejs.org/ | Vuex} store. If the store has not been passed
   * through the {@link XPluginOptions} object, it creates one, and injects it in the Vue
   * prototype. Then it registers an x module in the store, to safe scope all the
   * {@link XModule | XModules} dynamically installed.
   *
   * @internal
   */
  protected registerStore(): void {
    // this.vue.use(Vuex); // We can safely install Vuex because if it is already installed Vue
    // will simply ignore it
    this.store =
      this.options.store ??
      createStore({
        strict: process.env.NODE_ENV !== 'production',
        modules: {
          x: {
            namespaced: true,
            state: () => ({ test: {} }),
            mutations: {
              increment(state: any) {
                const t0 = performance.now();
                Array.from(Array(210).keys()).forEach(key => {
                  console.log(key);
                  state.test[key] = { a: key };
                });
                const t1 = performance.now();
                console.log(`Loop of 210 with assignation took ${(t1 - t0) / 1000} seconds.`);
              }
            },
            modules: {
              device: { namespaced: true, ...deviceXStoreModule },
              empathize: { namespaced: true, ...empathizeXStoreModule },
              extraParams: { namespaced: true, ...extraParamsXStoreModule },
              facets: { namespaced: true, ...facetsXStoreModule },
              historyQueries: { namespaced: true, ...historyQueriesXStoreModule },
              identifierResults: { namespaced: true, ...identifierResultsXStoreModule },
              nextQueries: { namespaced: true, ...nextQueriesXStoreModule },
              popularSearches: { namespaced: true, ...popularSearchesXStoreModule },
              queriesPreview: { namespaced: true, ...queriesPreviewXStoreModule },
              querySuggestions: { namespaced: true, ...querySuggestionsXStoreModule },
              recommendations: { namespaced: true, ...recommendationsXStoreModule },
              relatedTags: { namespaced: true, ...relatedTagsXStoreModule },
              scroll: { namespaced: true, ...scrollXStoreModule },
              search: { namespaced: true, ...searchXStoreModule },
              searchBox: { namespaced: true, ...searchBoxXStoreModule },
              semanticQueries: { namespaced: true, ...semanticQueriesXStoreModule },
              tagging: { namespaced: true, ...taggingXStoreModule },
              url: { namespaced: true, ...urlXStoreModule },
              experienceControls: { namespaced: true, ...experienceControlsXStoreModule }
            }
          }
        } as any
      });
    // if (!this.options.store) {
    //   this.vue.prototype.$store = this.store;
    // }
    this.vue.use(this.store);
    // this.store.registerModule('x', RootXStoreModule);
  }

  /**
   * Applies the {@link createXComponentAPIMixin} mixin in the global Vue.
   *
   * @internal
   */
  protected applyMixins(): void {
    // this.vue.mixin(createXComponentAPIMixin(this.bus));
  }

  /**
   * Registers the initial {@link XModule | XModules} during the {@link XPlugin} installation.
   *
   * @internal
   */
  protected registerInitialModules(): void {
    this.options.initialXModules?.forEach(xModule => {
      this.registerXModule(xModule);
    });
  }

  /**
   * Registers the pending {@link XModule | XModules}, that requested to be registered before the
   * installation of the plugin.
   *
   * @internal
   */
  protected registerPendingXModules(): void {
    forEach(XPlugin.pendingXModules, (_, xModule) => {
      this.registerXModule(xModule);
    });
    XPlugin.pendingXModules = {};
  }
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
export const xPlugin = new XPlugin(bus);
