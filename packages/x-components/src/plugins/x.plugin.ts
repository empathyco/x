import { deepMerge } from '@empathybroker/deep-merge';
import Vue, { VueConstructor } from 'vue';
import { Store } from 'vuex';
import { Dictionary, forEach } from '../utils';
import { AnyWire, Wiring } from '../wiring/wiring.types';
import { BaseXBus } from './x.bus';
import { CreateXComponentAPIMixin } from './x.mixin';
import { AnyXModule, XModuleName, XPluginOptions } from './x.types';

/**
 * Vue plugin that modifies each component instance, extending them with the {@link XComponentAPI | X Component API }
 *
 * @example Vue.use(XPlugin)
 */
export class XPlugin {
  /** Instance of the plugin */
  protected static instance = new XPlugin();
  /** Bus for retrieving the observables when registering the wiring */
  protected bus = new BaseXBus(); // TODO Inject this constructor
  /** Tells if the plugin has already been installed or not */
  protected isInstalled = false;
  /** The install options of the plugin */
  protected options!: XPluginOptions;
  /** Record of modules that have been tried to be installed before the installation of the plugin */
  protected pendingXModules: Record<XModuleName, AnyXModule> = {};
  /** The Vuex store */
  protected store!: Store<any>;
  /** The global Vue */
  protected vue!: VueConstructor<Vue>;

  /**
   * Protected constructor to ensure that this class is only instantiated once.
   * It needs to be a singleton because Vue accepts either a function as plugin, or an object that exposes an install(...) method.
   */
  protected constructor() {}

  /**
   * Exposed install method so Vue can perform the installation of this plugin
   * @param vue The GlobalVue object
   * @param options The options to install this plugin with
   */
  public static install(
    vue: VueConstructor<Vue>,
    options: XPluginOptions = {}
  ) {
    this.instance.install(vue, options);
  }

  /**
   * Registers a {@link XModule}
   * @param xModule The {@link XModule} to register
   */
  public static registerXModule(xModule: AnyXModule) {
    this.instance.registerXModule(xModule);
  }

  /**
   * If the plugin has already been installed, immediately registers a {@link XModule}. If it has not been installed yet, it stores
   * the module in the {@link pendingXModules} property, so it can be registered in the install process
   * @param xModule The module to register
   */
  protected registerXModule(xModule: AnyXModule) {
    if (this.isInstalled) {
      this.eagerRegisterXModule(xModule);
    } else {
      this.lazyRegisterXModule(xModule);
    }
  }

  /**
   * Performs the registration of a {@link XModule} immediately
   * @param xModule The module to register
   */
  protected eagerRegisterXModule(xModule: AnyXModule) {
    // TODO Register store and watchers
    this.registerWiring(xModule.name, xModule.wiring);
  }

  /**
   * Stores the {@link XModule} in a dictionary, so it can be registered later in the install process
   * @param xModule The module to register
   */
  protected lazyRegisterXModule(xModule: AnyXModule) {
    this.pendingXModules[xModule.name] = xModule;
  }

  /**
   * Performs the registration of the wiring, retrieving the observable for each event, and executing each wire
   * @param name The name of the {@link XModule} of the wiring
   * @param wiring The wiring to register
   */
  protected registerWiring(name: XModuleName, wiring: Partial<Wiring>) {
    const customizedWiring: Partial<Wiring> = deepMerge(
      {},
      wiring,
      this.options?.xModules?.[name]?.wiring
    );
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
   * Protected install method, that orchestrates the plugin setup process
   * @param vue The global Vue
   * @param options The plugin install options
   */
  protected install(vue: VueConstructor<Vue>, options: XPluginOptions = {}) {
    this.vue = vue;
    this.options = options;
    this.applyMixins();
   this.registerPendingXModules();
    this.isInstalled = true;
  }

  /**
   * Registers the {@link CreateXComponentAPIMixin} mixin in the global Vue
   */
  protected applyMixins() {
    this.vue.mixin(CreateXComponentAPIMixin);
  }

  /**
   * Registers the pending {@link XModule | XModules}, that requested to be registered before the installation of the plugin
   */
  protected registerPendingXModules() {
    forEach(this.pendingXModules, (_, xModule) =>
      this.eagerRegisterXModule(xModule)
    );
  }
}
