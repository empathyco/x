import { EmpathyAdapterConfig } from '@empathyco/x-adapter';
import { deepMerge } from '@empathyco/x-deep-merge';
import Vue, { PluginObject, VueConstructor } from 'vue';
import { BaseXBus } from '../../plugins/x-bus';
import { XBus } from '../../plugins/x-bus.types';
import { XPlugin } from '../../plugins/x-plugin';
import { XPluginOptions } from '../../plugins/x-plugin.types';
import { cleanUndefined } from '../../utils/object';
import { DeepPartial } from '../../utils/types';
import { SnippetConfig, XAPI } from '../api/api.types';
import { BaseXAPI } from '../api/base-api';
import { InstallXOptions, VueConstructorPartialArgument } from './types';

declare global {
  interface Window {
    X?: XAPI;
  }
}

const defaultAdapterConfig: DeepPartial<EmpathyAdapterConfig> = {
  env: 'live',
  requestParams: {
    lang: 'es',
    scope: 'default'
  }
};

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
 *            installer.init(snipetConfig)
 * ```
 *
 *        2.2 If the API option is enabled (`createAPI` is `true` in {@link InstallXOptions}, or
 *            is not present as the default vlaue is `true`) then this init step can be done with
 *            the Public API:
 *
 * ```
 *            window.X.init(snippetConfig)
 * ```
 *
 *        2.3 When the script of the project build is loaded it searches for a global `initX`
 *            variable that the customer must have in their web site. This variable can be a
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
 *                   searchLang,
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
 *                 searchLang,
 *                 currency,
 *                 consent,
 *                 documentDirection
 *               };
 * ```
 *
 * @public
 */
export class XInstaller {
  private api?: XAPI;

  /**
   * Receives the {@link InstallXOptions} and merges it with the default fallback options. Also
   * creates the public {@link XAPI}.
   *
   * @param options - The {@link InstallXOptions}.
   *
   * @public
   */
  public constructor(protected readonly options: InstallXOptions) {
    this.createAPI();
  }

  /**
   * Creates the public {@link XAPI} using the `api` option from {@link InstallXOptions}. If this
   * `api` option is not passed, then a default {@link BaseXAPI} is created. To disable the API
   * creation the value `false` must be passed in the `api` option.
   *
   * @internal
   */
  protected createAPI(): void {
    const { api } = this.options;
    if (api !== false) {
      this.api = api ?? new BaseXAPI();
      this.api.setInitCallback(this.init.bind(this));
      window.X = this.api;
    }
  }

  /**
   * Receives the {@link SnippetConfig | snippet config}, installs the plugin and initializes
   * the Vue application.
   *
   * @param snippetConfig - The {@link SnippetConfig} that receives from snippet
   * integration.
   *
   * @returns Object with the {@link XAPI}, the {@link XBus}, the {@link XPlugin} and the Vue App
   * used in the application.
   *
   * @public
   */
  async init(snippetConfig: SnippetConfig): Promise<{
    app: Vue | undefined;
    api: XAPI | undefined;
    bus: XBus;
    plugin: PluginObject<XPluginOptions>;
  }> {
    const adapterConfig = this.getAdapterConfig(snippetConfig);
    this.applyConfigToAdapter(adapterConfig);
    const bus = this.createBus();
    const pluginOptions = this.getPluginOptions();
    const plugin = this.installPlugin(pluginOptions, bus);
    const extraPlugins = await this.installExtraPlugins(snippetConfig, bus);
    const app = this.createApp(extraPlugins, snippetConfig);
    this.api?.setBus(bus);

    return {
      api: this.api,
      app,
      bus,
      plugin
    };
  }

  /**
   * Creates the Adapter Config object using the {@link SnippetConfig} to do it. It also
   * merges the default configuration.
   *
   * @param options - The {@link SnippetConfig}.
   *
   * @returns The Adapter Config object.
   *
   * @internal
   */
  protected getAdapterConfig({ instance, env, lang, searchLang, scope }: SnippetConfig): unknown {
    return deepMerge(
      defaultAdapterConfig,
      cleanUndefined<DeepPartial<EmpathyAdapterConfig>>({
        instance,
        env,
        requestParams: {
          lang: searchLang ?? lang,
          scope
        }
      })
    );
  }

  /**
   * Creates the {@link XPluginOptions} object.
   *
   * @returns The {@link XPluginOptions} object.
   *
   * @internal
   */
  protected getPluginOptions(): XPluginOptions {
    const { adapter, store, initialXModules, xModules, __PRIVATE__xModules } = this.options;
    return {
      adapter,
      store,
      xModules,
      initialXModules,
      __PRIVATE__xModules
    };
  }

  /**
   * It applies the snippet configuration to the Adapter. Not all the parameters are for the Adapter
   * but they appear destructured to not include them in the `extraParams` parameter.
   *
   * @param adapterConfig - The Adapter config object.
   *
   * @internal
   */
  protected applyConfigToAdapter(adapterConfig: any): void {
    this.options.adapter.setConfig?.(adapterConfig);
  }

  /**
   * This method returns the bus instance to be used in the {@link XPlugin} and in the {@link XAPI}.
   * It returns the `bus` parameter in the {@link InstallXOptions} or if not provided, then
   * creates a new instance of {@link BaseXBus}.
   *
   * @returns XBus - The bus instance.
   *
   * @internal
   */
  protected createBus(): XBus {
    return this.options.bus ?? new BaseXBus();
  }

  /**
   * This method returns the VueConstructor to use to create the App instance.
   * It returns the `vue` parameter in the {@link InstallXOptions} or if not provided, then
   * returns the default Vue.
   *
   * @remarks The purpose of this option is mainly the testing. In a test we can use this option
   * to pass the local vue instance created by `createLocalVue` method.
   *
   * @returns VueConstructor - The vue constructor to create the App instance.
   *
   * @internal
   */
  protected getVue(): VueConstructor {
    return this.options.vue ?? Vue;
  }

  /**
   * Creates and install the Vue Plugin. If `plugin` parameter is passed in the
   * {@link InstallXOptions}, then it is used. If not, then a new instance of {@link XPlugin} is
   * created and installed.
   *
   * @param pluginOptions - The {@link XPluginOptions} to passed as parameter to the install method
   * of the plugin.
   * @param bus - The {@link XBus} to be used to create the XPlugin.
   *
   * @returns PluginObject<XPluginOption> - The plugin instance.
   * @internal
   */
  protected installPlugin(pluginOptions: XPluginOptions, bus: XBus): PluginObject<XPluginOptions> {
    const plugin = this.options.plugin ?? new XPlugin(bus);
    const vue = this.getVue();
    vue.use(plugin, pluginOptions);
    return plugin;
  }

  /**
   * Install more plugins to Vue defined by the user.
   *
   * @param snippet - The snippet configuration.
   * @param bus - The events bus used in the application.
   * @returns The arguments from the plugins installation to be used in Vue's constructor.
   * @internal
   */
  protected installExtraPlugins(
    snippet: SnippetConfig,
    bus: XBus
  ): Promise<VueConstructorPartialArgument> {
    const vue = this.getVue();
    return Promise.resolve(this.options.installExtraPlugins?.({ vue, snippet, bus }));
  }

  /**
   * In the case that the `app` parameter is present in the {@link InstallXOptions}, then a new Vue
   * application is created using that app.
   *
   * @param extraPlugins - Vue plugins initialisation data.
   * @param snippetConfig - Configuration from the client snippet.
   * @returns The Created Vue application or undefined if not created.
   *
   * @internal
   */
  protected createApp(
    extraPlugins: VueConstructorPartialArgument,
    snippetConfig: SnippetConfig
  ): Vue | undefined {
    if (this.options.app !== undefined) {
      const vue = this.getVue();
      snippetConfig = vue.observable(snippetConfig);
      return new vue({
        ...extraPlugins,
        ...this.options.vueOptions,
        provide() {
          return {
            snippetConfig
          };
        },
        store: this.options.store,
        el: this.getMountingTarget(this.options.domElement),
        render: h => h(this.options.app)
      });
    }
  }

  /**
   * It returns the HTML element to mount the Vue Application. If the `domElement` parameter in the
   * {@link InstallXOptions} is an Element or a string, then it is used. If it is
   * not present then a new <div> Element is created and append to the body to be used.
   *
   * @param elementOrSelector - String or Element used to mount the Vue App.
   *
   * @returns The Element to use as mounting point for the Vue App.
   * @internal
   */
  protected getMountingTarget(elementOrSelector?: string | Element): Element {
    if (typeof elementOrSelector === 'string') {
      const target = document.querySelector(elementOrSelector);
      if (!target) {
        throw Error(
          `XComponents app couldn't be mounted: Element "${elementOrSelector}" couldn't be found`
        );
      }
      return target;
    } else if (elementOrSelector !== undefined) {
      return elementOrSelector;
    } else {
      return document.body.appendChild(document.createElement('div'));
    }
  }
}
