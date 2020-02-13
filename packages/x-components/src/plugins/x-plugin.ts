import { deepMerge } from '@empathybroker/deep-merge';
import Vue, { VueConstructor } from 'vue';
import Vuex, { Module, Store } from 'vuex';
import { AnyStoreEmitters } from '../store/store-emitters.types';
import { AnyXStoreModule } from '../store/store.types';
import { RootXStoreModule } from '../store/x.module';
import { Dictionary, forEach, reduce } from '../utils';
import { AnyWire, Wiring } from '../wiring/wiring.types';
import { AnyXModule, XModuleName } from '../x-modules/x-modules.types';
import { BaseXBus } from './x-bus';
import { CreateXComponentAPIMixin } from './x-plugin.mixin';
import { AnyXStoreModuleOptions, XModuleOptions, XPluginOptions } from './x-plugin.types';

/**
 * Vue plugin that modifies each component instance, extending them with the {@link XComponentAPI | X Component API }
 *
 * @example ```typescript Vue.use(XPlugin, { options })``
 */
export class XPlugin {
  /** Instance of the singleton */
  protected static instance = new XPlugin();
  /** Bus for retrieving the observables when registering the wiring */
  protected bus = new BaseXBus(); // TODO Inject this constructor
  /** Set of the already installed {@link XModule | Xmodules} to avoid re-registering them */
  protected installedXModules = new Set<string>();
  /** True if the plugin has been installed in a Vue instance, in this case {@link XModule | Xmodules} will be installed immediately.
   * False otherwise, in this case {@link XModule | Xmodules} will be installed lazily when the {@link install} method is called. */
  protected isInstalled = false;
  /** The install options of the plugin, where all the customization of {@link XModule | XModules} is done */
  protected options!: XPluginOptions;
  /** Record of modules that have been tried to be installed before the installation of the plugin */
  protected pendingXModules: Partial<Record<XModuleName, AnyXModule>> = {};
  /** The Vuex store, to pass to the wires for its registration, and to register the store modules on it */
  protected store!: Store<any>;
  /** The global Vue, passed by the install method. Used to apply the global mixin {@link CreateXComponentAPIMixin },
   * and install the {@link Vuex} plugin */
  protected vue!: VueConstructor<Vue>;

  /**
   * Protected constructor to ensure that this class is only instantiated once.
   * It needs to be a singleton because Vue accepts either a function as plugin, or an object that exposes an install(...) method.
   */
  protected constructor() {}

  /**
   * Installs the plugin into the Vue instance
   * @param vue The GlobalVue object
   * @param options The options to install this plugin with
   */
  public static install(vue: VueConstructor<Vue>, options: XPluginOptions = {}) {
    const instance = this.instance;
    instance.vue = vue;
    instance.options = options;
    instance.registerStore();
    instance.applyMixins();
    instance.registerPendingXModules();
    instance.isInstalled = true;
  }

  /**
   * If the plugin has already been installed, it immediately registers a {@link XModule}. If it has not been installed yet, it stores
   * the module in the {@link pendingXModules} property, so it can be registered in the install process
   * @param xModule The module to register
   */
  public static registerXModule(xModule: AnyXModule): void {
    const instance = this.instance;
    if (instance.isInstalled) {
      instance.registerXModule(xModule);
    } else {
      instance.lazyRegisterXModule(xModule);
    }
  }

  /**
   * Performs the registration of a {@link XModule}
   * @param xModule The module to register
   */
  protected registerXModule({ name, wiring, storeModule, storeEmitters }: AnyXModule): void {
    if (!this.installedXModules.has(name)) {
      this.registerStoreModule(name, storeModule);
      this.registerStoreEmitters(name, storeModule, storeEmitters);
      this.registerWiring(name, wiring);
      this.installedXModules.add(name);
    }
  }

  /**
   * Stores the {@link XModule} in a dictionary, so it can be registered later in the install process
   * @param xModule The module to register
   */
  protected lazyRegisterXModule(xModule: AnyXModule): void {
    this.pendingXModules[xModule.name] = xModule;
  }

  /**
   * Performs the registration of the wiring, retrieving the observable for each event, and executing each wire
   * @param name The name of the {@link XModule} of the wiring
   * @param wiring The wiring to register
   */
  protected registerWiring(name: XModuleName, wiring: Partial<Wiring>): void {
    const wiringOptions = this.getModuleOptions(name)?.wiring;
    const customizedWiring: Partial<Wiring> = wiringOptions
      ? deepMerge({}, wiring, wiringOptions)
      : wiring;
    forEach(customizedWiring, (event, wires: Dictionary<AnyWire>) => {
      // Obtain the observable
      const observable = this.bus.on(event);
      // Register event wires
      forEach(wires, (_, wire) => {
        wire(observable, this.store);
      });
    });
  }

  /**
   * Registers a Vuex store module under the 'x' module
   * @param name The module name
   * @param storeModule The module definition to register
   */
  protected registerStoreModule(name: XModuleName, storeModule: AnyXStoreModule): void {
    const storeModuleOptions = this.getModuleOptions(name)?.storeModule;
    const customizedStoreModule: Module<any, any> = storeModuleOptions
      ? this.customizeStoreModule(storeModule, storeModuleOptions)
      : storeModule;
    customizedStoreModule.namespaced = true;
    this.store.registerModule(['x', name], customizedStoreModule);
  }

  protected getModuleOptions(name: XModuleName): XModuleOptions<AnyXModule> | undefined {
    return this.options.xModules?.[name];
  }

  /**
   * Overrides a {@link Vuex} store module definition
   * @param defaultModule The module to override its configuration
   * @param moduleOptions The options to override the defaultModule
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
   * Registers the store emitters, making them emit the event when the part of the state selected changes
   * @param name The module name
   * @param storeModule The store module to retrieve its state and getters
   * @param storeEmitters The store emitters to register
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
    forEach(customizedStoreEmitters, (event, stateSelector) => {
      this.store.watch(
        state => stateSelector(state.x[name], safeGettersProxy),
        changedState => {
          this.bus.emit(event, changedState);
        }
      );
    });
  }

  /**
   * Creates a proxy object of the getters of the storeModule passed, which will be the object passed as getters to the stateSelector,
   * of the module. This is done to ensure that an {@link StateSelector} can only access the getters of the {@link XModule} where
   * it is registered
   * @param moduleName The name of the module
   * @param storeModule The store module
   */
  protected getModuleGetters(moduleName: XModuleName, storeModule: AnyXStoreModule): Dictionary {
    const getters = this.store.getters;
    return reduce(
      storeModule.getters as Dictionary,
      (safeGettersProxy, getterName) => {
        // Cast because FUCK TS
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
   * Registers the {@link Vuex} store. If the store has not been passed through the {@link XPluginOptions} object, it creates one, and
   * injects it in the Vue prototype. Then it register an x module in the store, to safe scope all the {@link XModule | XModules}
   * dynamically installed
   */
  protected registerStore(): void {
    this.vue.use(Vuex); // We can safely install Vuex because if it is already installed Vue will simply ignore it
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
   * Applies the {@link CreateXComponentAPIMixin} mixin in the global Vue
   */
  protected applyMixins(): void {
    this.vue.mixin(CreateXComponentAPIMixin);
  }

  /**
   * Registers the pending {@link XModule | XModules}, that requested to be registered before the installation of the plugin
   */
  protected registerPendingXModules(): void {
    forEach(this.pendingXModules, (_, xModule) => {
      this.registerXModule(xModule);
    });
  }
}
