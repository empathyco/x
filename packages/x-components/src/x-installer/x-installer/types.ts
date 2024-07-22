import { App, Component, Plugin } from 'vue';
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
  rootComponent?: Component;
  /**
   * The Vue application instance. If it is not passed, a new Vue application is created.
   */
  app?: App;
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
  plugin?: Plugin<XPluginOptions>;
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
   * @param app - The vue application instance.
   */
  onCreateApp?: (app: App) => void;
  /**
   * Adds the option to install more Vue plugins, giving access to the {@link SnippetConfig} and
   * the {@link @empathyco/x-bus#XBus}.
   *
   * @param options - An object that contains utilities that might be helpful for installing Vue
   * plugins.
   */
  installExtraPlugins?(options: ExtraPluginsOptions): void;
}

/**
 * Options to install more Vue plugins with.
 *
 * @public
 */
export interface ExtraPluginsOptions {
  /** The Vue application instance that is being used. */

  app: App;
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
export type VueConstructorPartialArgument = Partial<Record<string, unknown>>;

/**
 * Interface for the returned type of the {@link XInstaller.(init:1)} function.
 *
 * @public
 */
export interface InitWrapper {
  /** The Vue application instance. */
  app?: App;
  /** The {@link XAPI} to expose globally. */
  api?: XAPI;
  /** The {@link @empathyco/x-bus#XBus} used in the {@link XPlugin}. */
  bus: XBus<XEventsTypes, WireMetadata>;
  /** The installed {@link XPlugin} instance. */
  plugin: Plugin<XPluginOptions>;
}
