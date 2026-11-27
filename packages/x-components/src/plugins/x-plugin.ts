import type { XComponentsAdapter } from '@empathyco/x-types'
import type { Dictionary } from '@empathyco/x-utils'
import type { Pinia } from 'pinia'
import type { Observable } from 'rxjs'
import type { App, EffectScope } from 'vue'
import type { Module, Store } from 'vuex'
import type { AnyPiniaStore } from '../store/pinia/define-x-store'
import type { AnyXStoreModule, RootXStoreState } from '../store/store.types'
import type { XEvent, XEventsTypes } from '../wiring/events.types'
import type { AnyWire, WireMetadata } from '../wiring/wiring.types'
import type { EventPayload, SubjectPayload, XBus } from '../x-bus'
import type { AnyXModule, XModuleName } from '../x-modules/x-modules.types'
import type { AnyXStoreModuleOption, XModuleOptions, XPluginOptions } from './x-plugin.types'
import { deepMerge, forEach } from '@empathyco/x-utils'
import { effectScope } from 'vue'
import { createStore } from 'vuex'
import { bridgePiniaModule, linkReplaceState } from '../store/pinia/vuex-bridge'
import { cleanGettersProxyCache } from '../store/utils/getters-proxy.utils'
import { RootXStoreModule } from '../store/x.module'
import { clearStoreRoutes, getStoreBackend, setPiniaStoreRoute } from '../wiring/store-router'
import { bus } from './x-bus'
import { registerPiniaStoreEmitters, registerStoreEmitters } from './x-emitters'
import { assertXPluginOptionsAreValid } from './x-plugin.utils'

/**
 * Vue plugin that initializes the properties needed by the x-components, and exposes the events bus
 * and the adapter after it has been installed.
 *
 * @public
 */
export class XPlugin {
  /**
   * XComponentsAdapter Is the middleware between the components and our API where data can be
   * mapped to client needs.
   * This property is only available after installing the plugin.
   *
   * @returns The installed adapter.
   * @throws If this property is accessed before calling `Vue.use(xPlugin)`.
   * @public
   */
  public static get adapter(): XComponentsAdapter {
    return this.getInstance().adapter
  }

  /**
   * Exposed XBus, so any kind of application can subscribe to
   * {@link XEventsTypes} without having to pass through a component.
   * This property is only available after installing the plugin.
   *
   * @returns The installed bus.
   * @throws If this property is accessed before calling `Vue.use(xPlugin)`.
   * @public
   */
  public static get bus(): XBus<XEventsTypes, WireMetadata> {
    return this.getInstance().bus
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
    return this.getInstance().store
  }

  /**
   * {@link https://pinia.vuejs.org | Pinia} instance used by the plugin. It is the one of the host
   * if there is any, or a private one that is created when the first module uses Pinia.
   * This property is only available after installing the plugin.
   *
   * @returns The Pinia instance, or `undefined` if the host has none and no module uses Pinia.
   * @throws If this property is accessed before calling `Vue.use(xPlugin)`.
   * @internal
   */
  public static get pinia(): Pinia | undefined {
    return this.getInstance().pinia
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
      throw new Error("XPlugin must be installed before accessing it's API.")
    }
    return this.instance
  }

  /**
   * Record of modules that have been tried to be installed before the installation of the plugin.
   *
   * @internal
   */
  protected static pendingXModules: Partial<Record<XModuleName, AnyXModule>> = {}

  /**
   * Instance of the installed plugin. Used to expose the bus and the adapter.
   *
   * @internal
   */
  protected static instance?: XPlugin

  public wiring: Partial<Record<XModuleName, Partial<Record<XEvent, string[]>>>> = {}
  /**
   * Bus for retrieving the observables when registering the wiring.
   *
   * @internal
   */
  protected bus: XBus<XEventsTypes, WireMetadata>

  /**
   * Adapter for the API, responsible for transforming requests and responses.
   *
   * @internal
   */
  protected adapter!: XComponentsAdapter

  /**
   * Set of the already installed XModules to avoid re-registering them.
   *
   * @internal
   */
  protected installedXModules = new Set<string>()

  /**
   * True if the plugin has been installed in a Vue instance, in this case
   * XModules will be installed immediately. False otherwise, in this case
   * XModules will be installed lazily when the {@link XPlugin#install} method
   * is called.
   *
   * @internal
   */
  protected isInstalled = false

  /**
   * The installation options of the plugin, where all the customization of
   * {@link XModule | XModules} is done.
   *
   * @internal
   */
  protected options!: XPluginOptions

  /**
   * The Vuex store, to pass to the wires for its registration, and to register the store
   * modules on it.
   *
   * @internal
   */
  protected store!: Store<any>

  /**
   * The Pinia instance. It is never installed in the Vue application by the plugin.
   *
   * @internal
   */
  protected pinia?: Pinia

  /**
   * Function to dispose the Pinia instance created by the plugin.
   *
   * @internal
   */
  protected disposePinia?: (pinia: Pinia) => void

  /**
   * True if the Pinia instance has been created by the plugin, so it is the one in charge of
   * disposing it. The Pinia instance of the host is never disposed.
   *
   * @internal
   */
  protected ownsPinia = false

  /**
   * Pinia stores of the {@link XModule | XModules} that use Pinia as their store backend.
   *
   * @internal
   */
  protected piniaStores = new Map<XModuleName, AnyPiniaStore>()

  /**
   * Effect scopes of the store emitters of the modules that use Pinia as their store backend.
   *
   * @internal
   */
  protected piniaEmittersScopes: EffectScope[] = []

  /**
   * Functions to undo the links between the Vuex `replaceState` and the Pinia stores.
   *
   * @internal
   */
  protected unlinkReplaceStateFns: Array<() => void> = []

  /**
   * The Vue application instance, passed by the installation method.
   *
   * @internal
   */
  protected app!: App

  /**
   * Creates a new instance of the XPlugin with the given bus passed as parameter.
   *
   * @param bus - The XBus implementation to use for the plugin.
   *
   * @public
   */
  public constructor(bus: XBus<XEventsTypes, WireMetadata>) {
    this.bus = bus
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
      this.instance.registerXModule(xModule)
    } else {
      this.lazyRegisterXModule(xModule)
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
    cleanGettersProxyCache()
    this.instance?.disposePiniaResources()
    this.instance = undefined
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
    this.pendingXModules[xModule.name] = xModule
  }

  /**
   * Installs the plugin into the Vue instance.
   *
   * @param app - The Vue application instance.
   * @param options - The options to install this plugin with.
   * @throws If the XPlugin has already been installed, or the options are not valid.
   *
   * @internal
   */
  install(app: App, options?: XPluginOptions): void {
    if (this.isInstalled) {
      throw new Error('XPlugin has already been installed')
    }
    assertXPluginOptionsAreValid(options)
    XPlugin.instance = this
    this.app = app
    this.options = options
    this.adapter = options.adapter
    this.registerStore()
    this.registerPinia()
    this.registerInitialModules()
    this.registerPendingXModules()
    this.isInstalled = true
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
      const customizedXModule = this.customizeXModule(xModule)
      this.registerStoreModule(customizedXModule)
      this.registerStoreEmitters(customizedXModule)
      this.registerWiring(customizedXModule)
      // The wiring must be registered after the store emitters
      // to allow lazy loaded modules work properly.
      this.installedXModules.add(xModule.name)
      void this.bus.emit('ModuleRegistered', xModule.name)
    }
  }

  /**
   * Performs a customization of a {@link XModule} using the XPlugin public and private options.
   *
   * @param xModule - The module to customize.
   * @returns The customized xModule.
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
      this.options.xModules?.[name] ?? {}

    const { storeModule: storeModuleOptions, storeEmitters: emittersOptions } =
      this.options.__PRIVATE__xModules?.[name] ?? {}

    return {
      name,
      // eslint-disable-next-line ts/no-unsafe-assignment
      wiring: wiringOptions ? deepMerge({}, wiring, wiringOptions) : wiring,
      storeModule: this.customizeStoreModule(storeModule, storeModuleOptions ?? {}, config),
      // eslint-disable-next-line ts/no-unsafe-assignment
      storeEmitters: emittersOptions
        ? deepMerge({}, storeEmitters, emittersOptions)
        : storeEmitters,
      ...restXModule,
    }
  }

  /**
   * Performs the registration of the wiring, retrieving the observable for each event, and
   * executing each wire.
   *
   * @param xModule - The {@link XModule} to register its wiring.
   * @internal
   */
  protected registerWiring({ wiring }: AnyXModule): void {
    forEach(wiring, (event, wires: Dictionary<AnyWire>) => {
      // Obtain the observable
      const observable = this.bus.on(event, true) as unknown as Observable<
        SubjectPayload<EventPayload<XEventsTypes, typeof event>, WireMetadata>
      >
      // Register event wires
      forEach(wires, (_, wire) => {
        wire(observable, this.store as Store<RootXStoreState>, this.bus.on.bind(this.bus))
      })
    })
  }

  /**
   * Registers a {@link https://vuex.vuejs.org/ | Vuex} store module under the 'x' module.
   *
   * @param xModule - The {@link XModule} to register its Store Module.
   * @internal
   */
  protected registerStoreModule(xModule: AnyXModule): void {
    const { name, storeModule, piniaStore } = xModule
    if (piniaStore && this.canUsePinia(xModule)) {
      this.registerPiniaStoreModule(xModule)
    } else {
      ;(storeModule as Module<any, any>).namespaced = true
      this.store.registerModule(['x', name], storeModule)
    }
  }

  /**
   * Checks if an {@link XModule} that has a Pinia store can use it as its store backend. If it
   * cannot, it warns about the reason, and the module falls back to its Vuex store module. These
   * warnings are always emitted, regardless of the environment, because they are caused by the
   * configuration of the host.
   *
   * TODO: temporary, until the Vuex to Pinia migration is finished (see issue #2210). The private
   * overrides of getters, mutations and actions use the Vuex signature, so a module that has them
   * keeps using Vuex. They cannot work once Vuex is removed, so they need a replacement or a
   * migration guide.
   *
   * @param xModule - The {@link XModule} to check.
   * @returns True if the Pinia store can be used, false if the Vuex store module has to be used.
   * @internal
   */
  protected canUsePinia({ name }: AnyXModule): boolean {
    const { getters, mutations, actions } =
      this.options.__PRIVATE__xModules?.[name]?.storeModule ?? ({} as AnyXStoreModuleOption)
    const hasPrivateOverrides = [getters, mutations, actions].some(
      overrides => overrides && Object.keys(overrides).length > 0,
    )
    if (hasPrivateOverrides) {
      console.warn(
        `[XPlugin] The "${name}" module overrides its getters, mutations or actions through ` +
          '`__PRIVATE__xModules`, which is not supported with a Pinia store. Using Vuex.',
      )
      return false
    }
    return true
  }

  /**
   * Registers the Pinia store of an {@link XModule}, and exposes it through Vuex under the 'x'
   * module.
   *
   * @param xModule - The {@link XModule} to register its Pinia store.
   * @internal
   */
  protected registerPiniaStoreModule({ name, piniaStore }: AnyXModule): void {
    if (!piniaStore) {
      return
    }
    if (!this.pinia) {
      this.pinia = piniaStore.backend.createPinia()
      this.disposePinia = piniaStore.backend.disposePinia
      this.ownsPinia = true
    }
    const piniaStoreInstance = piniaStore.backend.useXStore(piniaStore, this.pinia, {
      stateOverride: this.options.__PRIVATE__xModules?.[name]?.storeModule?.state,
      config: this.options.xModules?.[name]?.config,
    })
    const getterNames = piniaStore.getterNames
    bridgePiniaModule(this.store, name, piniaStoreInstance, piniaStore.bridge, getterNames)
    setPiniaStoreRoute(this.store, name, {
      store: piniaStoreInstance,
      mutations: piniaStore.bridge.mutations,
      actions: piniaStore.bridge.actions,
    })
    this.unlinkReplaceStateFns.push(linkReplaceState(this.store, name, piniaStoreInstance))
    this.piniaStores.set(name, piniaStoreInstance)
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
   * @internal
   */
  protected customizeStoreModule(
    { state: defaultState, ...actionsGettersMutations }: AnyXStoreModule,
    { state: xModuleState, ...newActionsGettersMutations }: AnyXStoreModuleOption,
    configOptions: unknown,
  ): AnyXStoreModule {
    const configOptionsObject = configOptions ? { config: configOptions } : {}
    // eslint-disable-next-line ts/no-unsafe-assignment
    const customizedModule = deepMerge({}, actionsGettersMutations, newActionsGettersMutations)
    // eslint-disable-next-line ts/no-unsafe-assignment,ts/no-unsafe-member-access
    customizedModule.state = deepMerge(defaultState(), xModuleState, configOptionsObject)
    // eslint-disable-next-line ts/no-unsafe-return
    return customizedModule
  }

  /**
   * Registers the store emitters, making them emit the event when the part of the state selected
   * changes.
   *
   * @param xModule - The {@link XModule} to register its Store Emitters.
   * @internal
   */
  protected registerStoreEmitters(xModule: AnyXModule): void {
    const piniaStore = this.piniaStores.get(xModule.name)
    if (piniaStore && getStoreBackend(this.store, xModule.name) === 'pinia') {
      const scope = effectScope()
      this.piniaEmittersScopes.push(scope)
      registerPiniaStoreEmitters(
        xModule,
        this.bus,
        piniaStore,
        (xModule.piniaStore as NonNullable<AnyXModule['piniaStore']>).getterNames,
        scope,
      )
    } else {
      registerStoreEmitters(xModule, this.bus, this.store)
    }
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
    this.store = this.options.store ?? createStore({})
    this.app.use(this.store)
    this.store.registerModule('x', RootXStoreModule)
  }

  /**
   * Stores the Pinia instance of the host, the one passed in the options or the one already
   * installed in the app. If there is none, a private instance is created when the first module
   * with a Pinia store is registered. It is never installed in the app, so it does not interfere
   * with the Pinia of the host.
   *
   * @internal
   */
  protected registerPinia(): void {
    this.pinia = this.options.pinia ?? this.app.config.globalProperties.$pinia
    this.ownsPinia = false
  }

  /**
   * Releases the Pinia resources created by this plugin instance. The Pinia instance of the host
   * is left untouched.
   *
   * @internal
   */
  protected disposePiniaResources(): void {
    this.piniaEmittersScopes.forEach(scope => {
      scope.stop()
    })
    this.piniaEmittersScopes = []
    this.unlinkReplaceStateFns.forEach(unlink => {
      unlink()
    })
    this.unlinkReplaceStateFns = []
    this.piniaStores.forEach(piniaStore => {
      piniaStore.$dispose()
      if (this.pinia) {
        Reflect.deleteProperty(this.pinia.state.value, piniaStore.$id)
      }
    })
    this.piniaStores.clear()
    clearStoreRoutes(this.store)
    if (this.pinia && this.ownsPinia) {
      this.disposePinia?.(this.pinia)
    }
  }

  /**
   * Registers the initial {@link XModule | XModules} during the {@link XPlugin} installation.
   *
   * @internal
   */
  protected registerInitialModules(): void {
    this.options.initialXModules?.forEach(xModule => {
      this.registerXModule(xModule)
    })
  }

  /**
   * Registers the pending {@link XModule | XModules}, that requested to be registered before the
   * installation of the plugin.
   *
   * @internal
   */
  protected registerPendingXModules(): void {
    forEach(XPlugin.pendingXModules, (_, xModule) => {
      this.registerXModule(xModule)
    })
    XPlugin.pendingXModules = {}
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
export const xPlugin = new XPlugin(bus)
