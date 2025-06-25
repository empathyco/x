import type { App, Plugin } from 'vue'
import type { XPluginOptions } from '../../plugins/x-plugin.types'
import type { WireMetadata, XEventsTypes } from '../../wiring/index'
import type { XBus } from '../../x-bus'
import type { NormalisedSnippetConfig, SnippetConfig, XAPI } from '../api/api.types'
import type { InitWrapper, InstallXOptions } from './types'
import { forEach, isFunction } from '@empathyco/x-utils'
import { createApp, reactive } from 'vue'
import { bus } from '../../plugins/x-bus'
import { XPlugin } from '../../plugins/x-plugin'
import { BaseXAPI } from '../api/base-api'

declare global {
  interface Window {
    InterfaceX?: XAPI
    initX?: (() => SnippetConfig) | SnippetConfig
  }
}

/**
 * The purpose of this class is to offer a quick way to initialize the XComponents in a setup
 * project. It allows to receive all the options in {@link InstallXOptions} which is an extension
 * of {@link XPluginOptions} with all the options for the plugin and some options more.
 *
 * This class does multiple things:
 * 1. Install the {@link XPlugin} with the {@link XPluginOptions}.
 * 2. Creates the public {@link XAPI} and add it to global window.
 * 3. Creates the Vue Application for the customer project.
 *
 * The steps 2 & 3 are optional and depends on the options passed in {@link InstallXOptions}.
 *
 * @example The way to use this class is the next:
 *    1. Create the installer passing in the {@link InstallXOptions}. This only save the options:
 *
 * ```
 *        const installer = new XInstaller(installXOptions)
 * ```
 *
 *    2. Initialize passing the {@link SnippetConfig}. This installs the plugin and creates the App.
 *       There are 3 different ways to do this:
 *
 *        2.1 Using the created installer:
 *
 * ```
 *            installer.init(snippetConfig)
 * ```
 *
 *        2.2 If the API option is enabled (`createAPI` is `true` in {@link InstallXOptions}, or
 *            is not present as the default value is `true`) then this init step can be done with
 *            the Public API:
 *
 * ```
 *            window.InterfaceX.init(snippetConfig)
 * ```
 *
 *        2.3 When the script of the project build is loaded it searches for a global `initX`
 *            variable that the customer must have in their website. This variable can be a
 *            function that returns the {@link SnippetConfig} or an object that contains the
 *            {@link SnippetConfig} itself:
 *
 * ```
 *            window.initX = function() {
 *                 return {
 *                   instance,
 *                   env,
 *                   scope,
 *                   lang,
 *                   uiLang,
 *                   currency,
 *                   consent,
 *                   documentDirection
 *                 };
 *              };
 * ```
 *
 * ```
 *            window.initX = {
 *                 instance,
 *                 env,
 *                 scope,
 *                 lang,
 *                 uiLang,
 *                 currency,
 *                 consent,
 *                 documentDirection
 *               };
 * ```
 *
 * @public
 */
export class XInstaller {
  private app!: App
  private api?: XAPI

  /**
   * The configuration coming from the snippet {@link SnippetConfig}.
   *
   * @internal
   */
  protected snippetConfig?: NormalisedSnippetConfig

  /**
   * Receives the {@link InstallXOptions} and merges it with the default fallback options. Also
   * creates the public {@link XAPI}.
   *
   * @remarks Auto initializes the Vue application if window.initX is defined as a function or
   * object specifying the {@link SnippetConfig | snippet config}.
   *
   *
   * @param options - The {@link InstallXOptions}.
   *
   * @public
   */
  public constructor(protected readonly options: InstallXOptions) {
    this.createAPI()
  }

  /**
   * Creates the public {@link XAPI} using the `api` option from {@link InstallXOptions}. If this
   * `api` option is not passed, then a default {@link BaseXAPI} is created. To disable the API
   * creation the value `false` must be passed in the `api` option.
   *
   * @internal
   */
  protected createAPI(): void {
    const { api } = this.options
    if (api !== false) {
      this.api = api ?? new BaseXAPI()
      // eslint-disable-next-line ts/no-misused-promises
      this.api.setInitCallback(this.init.bind(this))
      this.api.setSnippetConfigCallback(this.updateSnippetConfig.bind(this))
      this.api.setSnippetConfigGetter(this.getSnippetConfig.bind(this))
      window.InterfaceX = this.api
    }
  }

  /**
   * Retrieves the {@link SnippetConfig | snippet config} it is defined in the window.initX.
   *
   * @returns The snippet config if it is defined or undefined otherwise.
   *
   * @internal
   */
  private retrieveSnippetConfig(): SnippetConfig | undefined {
    if (typeof window.initX === 'function') {
      return window.initX()
    } else if (typeof window.initX === 'object') {
      return window.initX
    }
  }

  /**
   * Receives the {@link SnippetConfig | snippet config} or retrieves it from window.initX and
   * installs the plugin and initializes the Vue application.
   *
   * @param snippetConfig - The {@link SnippetConfig} that receives from snippet integration.
   *
   * @returns If {@link SnippetConfig | snippet config} is passed or configured in window.initX,
   * returns an object with the {@link XAPI}, the XBus, the {@link XPlugin}
   * and the Vue application instance. Else, a rejected promise is returned.
   *
   * @public
   */
  init(snippetConfig: SnippetConfig): Promise<InitWrapper>
  init(): Promise<InitWrapper | void>
  async init(snippetConfig = this.retrieveSnippetConfig()): Promise<InitWrapper | void> {
    if (snippetConfig) {
      this.snippetConfig = reactive(this.normaliseSnippetConfig(snippetConfig))
      this.createApp()
      const bus = this.createBus()
      const pluginOptions = this.getPluginOptions()
      const plugin = this.installPlugin(pluginOptions, bus)
      await this.installExtraPlugins(bus)
      this.api?.setBus(bus)
      this.app.mount(this.getMountingTarget(this.options.domElement))

      return {
        api: this.api,
        app: this.app,
        bus,
        plugin,
      }
    }

    return Promise.resolve()
  }

  /**
   * Creates the {@link XPluginOptions} object.
   *
   * @returns The {@link XPluginOptions} object.
   *
   * @internal
   */
  protected getPluginOptions(): XPluginOptions {
    const { adapter, store, initialXModules, xModules, __PRIVATE__xModules } = this.options
    return {
      adapter,
      store,
      xModules,
      initialXModules,
      __PRIVATE__xModules,
    }
  }

  /**
   * This method returns the bus instance to be used in the {@link XPlugin} and in the {@link XAPI}.
   * It returns the `bus` parameter in the {@link InstallXOptions} or if not provided, then
   * creates a new instance of {@link @empathyco/x-bus#XPriorityBus | bus}.
   *
   * @returns XBus - The bus instance.
   *
   * @internal
   */
  protected createBus(): XBus<XEventsTypes, WireMetadata> {
    return this.options.bus ?? bus
  }

  /**
   * Creates and install the Vue Plugin. If `plugin` parameter is passed in the
   * {@link InstallXOptions}, then it is used. If not, then a new instance of {@link XPlugin} is
   * created and installed.
   *
   * @param pluginOptions - The {@link XPluginOptions} to passed as parameter to the install method
   * of the plugin.
   * @param bus - The XBus to be used to create the XPlugin.
   *
   * @returns Plugin<XPluginOption> - The plugin instance.
   * @internal
   */
  protected installPlugin(
    pluginOptions: XPluginOptions,
    bus: XBus<XEventsTypes, WireMetadata>,
  ): Plugin<XPluginOptions> {
    const plugin = this.options.plugin ?? new XPlugin(bus)
    this.app.use(plugin, pluginOptions)
    return plugin
  }

  /**
   * Runs the installExtraPlugins callback defined in the {@link InstallXOptions}
   * to allow the user to install more plugins to the App.
   *
   * @param bus - The events bus used in the application.
   * @returns An empty promise.
   * @internal
   */
  protected async installExtraPlugins(bus: XBus<XEventsTypes, WireMetadata>): Promise<void> {
    return Promise.resolve(
      this.options.installExtraPlugins?.({ app: this.app, snippet: this.snippetConfig!, bus }),
    )
  }

  /**
   * In the case that the `rootComponent` parameter is present in the {@link InstallXOptions},
   * then a new Vue application is created using that component as root.
   *
   * @internal
   */
  protected createApp(): void {
    if (this.options.rootComponent !== undefined) {
      this.app = createApp(this.options.rootComponent)
      this.app.provide('snippetConfig', this.snippetConfig)
      this.options.onCreateApp?.(this.app)
    }
  }

  protected normaliseSnippetConfig(snippetConfig: SnippetConfig): NormalisedSnippetConfig
  protected normaliseSnippetConfig(snippetConfig: Partial<SnippetConfig>): Partial<SnippetConfig>
  /**
   * Transforms the snippet configuration.
   * - If `lang` is provided and `uiLang` is not, it sets `uiLang=lang`.
   *
   * @param snippetConfig - The snippet config to normalise.
   * @returns The normalised version of the given snippet config.
   * @internal
   */
  protected normaliseSnippetConfig(
    snippetConfig: SnippetConfig | Partial<SnippetConfig>,
  ): NormalisedSnippetConfig | Partial<SnippetConfig> {
    if (snippetConfig.lang) {
      snippetConfig.uiLang ??= snippetConfig.lang
    }
    return snippetConfig
  }

  /**
   * It returns the HTML element to mount the Vue Application. If the `domElement` parameter in
   * the {@link InstallXOptions} is an Element or an element selector, then this will be used.
   * The `domElement` can also be a function with the {@link SnippetConfig} as parameter which
   * returns an Element or element selector to use.
   * If it is not present, a new <div> Element is created and appended to the body.
   *
   * @param domElement - {@link InstallXOptions.domElement} Element, ShadowRoot, string or function
   * used to mount the Vue Application.
   *
   * @returns The Element or ShadowRoot to use as mounting target for the Vue Application.
   * @internal
   */
  protected getMountingTarget(domElement?: InstallXOptions['domElement']): Element | ShadowRoot {
    if (isFunction(domElement)) {
      domElement = domElement(this.snippetConfig!)
    }
    if (typeof domElement === 'string') {
      const target = document.querySelector(domElement)
      if (!target) {
        throw new Error(
          `XComponents app couldn't be mounted: Element "${domElement}" couldn't be found`,
        )
      }
      return target
    }
    return domElement ?? document.body.appendChild(document.createElement('div'))
  }

  /**
   * It updates all the provided properties from the current snippet config.
   *
   * @param newSnippetConfig - All the properties to be updated in the {@link SnippetConfig}.
   *
   * @internal
   */
  protected updateSnippetConfig(newSnippetConfig: Partial<SnippetConfig>): void {
    if (!this.snippetConfig) {
      return
    }
    forEach(this.normaliseSnippetConfig(newSnippetConfig), (name, value) => {
      this.snippetConfig![name] = value
    })
  }

  /**
   * Getter for the snippet config object.
   *
   * @returns The {@link NormalisedSnippetConfig | snippetConfig} object.
   *
   * @public
   */
  protected getSnippetConfig(): NormalisedSnippetConfig {
    return this.snippetConfig!
  }
}
