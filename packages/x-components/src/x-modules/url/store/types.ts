import { XStoreModule } from '../../../store';
import { Dictionary } from '../../../utils/types';
import { UrlConfig } from '../config.types';

/**
 * URL store state.
 *
 * @public
 */
export interface UrlState {
  config: UrlConfig;
  query: string;
  page: number;
  filters: string[];
  sort: string;
  relatedTags: string[];
  extraParams: Dictionary<UrlParamValue>;
}

/**
 * URL store getters.
 *
 * @public
 */
export interface UrlGetters {
  urlParams: Dictionary<UrlParamValue>;
  urlMappedParamNames: Dictionary<UrlParamKey>;
}

/**
 * The key of the parameter to store in the URL.
 *
 * @public
 */
export type UrlParamKey = string;

/**
 * The allowed values of the parameters to store in the URL.
 *
 * @public
 */
export type UrlParamValue = string | number | boolean | Array<string | number | boolean>;

/**
 * URL store mutations.
 *
 * @public
 */
export interface UrlMutations {
  setUrlConfig(config: UrlConfig): void;
}

/**
 * URL store actions.
 *
 * @public
 */
export interface UrlActions {
  /**
   * Updates the URL with values from the store. It replaces the current url with a new entry in the
   * browser history. Also returns the params with the custom names provided in the config if
   * present.
   *
   * @public
   */
  updateUrl(): void;
}

/**
 * URL type safe store module.
 *
 * @public
 */
export type UrlXStoreModule = XStoreModule<UrlState, UrlGetters, UrlMutations, UrlActions>;
