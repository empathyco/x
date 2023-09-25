import { ComponentOptions, PluginObject, VueConstructor } from 'vue';
import { XBus } from '@empathyco/x-bus';
import { XPluginOptions } from '../../plugins/x-plugin.types';
import { NormalisedSnippetConfig, XAPI } from '../api/api.types';
import { WireMetadata, XEventsTypes } from '../../wiring/index';

/**
 * Interface for the parameter of the constructor of {@link XInstaller} function. It is an extended
 * version of {@link XPluginOptions}.
 *
 * @public
 */
export interface InstallXOptions<API extends XAPI = XAPI> extends XPluginOptions {
  /**
   * The Vue component used as root of the application. If it is not passed, no Vue Application is
   * initialized, only plugin installed.
   */
  app?: VueConstructor | ComponentOptions<Vue>;
  /**
   * The API to expose globally. If is not passed the default {@link BaseXAPI} will be used. If
   * a `false` value is passed then the API is not created.
   */
  api?: API | false;
  /**
   * The {@link @empathyco/x-bus#XBus} used in the {@link XPlugin}. If not passed an instance of
   * The {@link @empathyco/x-bus#XPriorityBus} will be used.
   */
  bus?: XBus<XEventsTypes, WireMetadata>;
  /**
   * An Element | string | function to indicate the HTML element that will contain the Vue
   * application. If it isn't passed, the {@link XInstaller} will create the target element.
   */
  domElement?: Element | string | ((snippetConfig: NormalisedSnippetConfig) => Element | string);
  /**
   * The XPlugin which will be installed. If not passed, an instance of {@link XPlugin} will be
   * installed.
   */
  plugin?: PluginObject<XPluginOptions>;
  /**
   * The Vue instance used to install the plugin and to create the Application. If not
   * passed the default Vue instance is used. This can be useful to use the `localVue`
   * in the unit tests.
   */
  vue?: VueConstructor;
  /**
   * This object can contain any option to pass to Vue instance at the moment of creating the App
   * instance.
   *
   * @example
   * ```typescript
   * {
   *   vueOptions:{
   *     i18n,
   *     router
   *   }
   * }
   * ```
   */
  vueOptions?: VueConstructorPartialArgument;

  /**
   * Callback to invoke after instantiating the app.
   *
   * @param app - The root vue instance containing the just created app.
   */
  onCreateApp?: (app: Vue) => void;
  /**
   * Adds the option to install more Vue plugins, giving access to the {@link SnippetConfig} and
   * the {@link @empathyco/x-bus#XBus}.
   *
   * @param options - An object that contains utilities that might be helpful for installing Vue
   * plugins.
   * @returns An object containing objects that will be passed to the Vue instance when constructed.
   */
  installExtraPlugins?(
    options: ExtraPluginsOptions
  ): VueConstructorPartialArgument | Promise<VueConstructorPartialArgument>;
}

/**
 * Options to install more Vue plugins with.
 *
 * @public
 */
export interface ExtraPluginsOptions {
  /** The Vue instance that is being used. */
  vue: VueConstructor;
  /** The events bus instance used to communicate different part of the x-components. */
  bus: XBus<XEventsTypes, WireMetadata>;
  /**
   * Configuration coming from the client website with options like the lang, or the active
   * currency.
   */
  snippet: NormalisedSnippetConfig;
}

/**
 * First parameter of the Vue constructor.
 *
 * @public
 */
export type VueConstructorPartialArgument = Partial<ConstructorParameters<VueConstructor>[0]>;

/**
 * Interface for the returned type of the {@link XInstaller.(init:1)} function.
 *
 * @public
 */
export interface InitWrapper {
  /** The root Vue instance of the application. */
  app?: Vue;
  /** The {@link XAPI} to expose globally. */
  api?: XAPI;
  /** The {@link @empathyco/x-bus#XBus} used in the {@link XPlugin}. */
  bus: XBus<XEventsTypes, WireMetadata>;
  /** The installed {@link XPlugin} instance. */
  plugin: PluginObject<XPluginOptions>;
}
