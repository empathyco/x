import { ComponentOptions, PluginObject, VueConstructor } from 'vue';
import { XBus } from '../../plugins/x-bus.types';
import { XPluginOptions } from '../../plugins/x-plugin.types';
import { XAPI } from '../api/api.types';

/**
 * Interface for the parameter of the constructor of {@link XInstaller} function. It is an extended
 * version of {@link XPluginOptions}.
 *
 * @public
 */
export interface InstallXOptions<API extends XAPI = XAPI> extends XPluginOptions {
  /** The Vue component used as root of the application. If is not passed no Vue Application is
   * initialized, only plugin installed. */
  app?: VueConstructor | ComponentOptions<Vue>;
  /** The API to expose globally. If is not passed the default {@link BaseXAPI} will be used. If
   * a `false` value is passed then the API is not created.*/
  api?: API | false;
  /** The {@link XBus} used in the {@link XPlugin}. If not passed an instance of {@link BaseXBus}
   * will be used.*/
  bus?: XBus;
  /** An Element | string to indicate the HTML element that will contain the Vue
   * application. If string selector is passed and the element doesn't exits, the
   * {@link XInstaller} will create it. */
  domElement?: Element | string;
  /** The XPlugin which will be installed. If not passed, an instance of {@link XPlugin} will be
   * installed.*/
  plugin?: PluginObject<XPluginOptions>;
  /** The Vue instance used to install the plugin and to create the Application. If not
   * passed the default Vue instance is used. This can be useful to use the `localVue`
   * in the unit tests.*/
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
  vueOptions?: Partial<ConstructorParameters<VueConstructor>[0]>;
}
