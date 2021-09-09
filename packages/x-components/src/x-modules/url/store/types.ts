import { XStoreModule } from '../../../store';
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
  extraParams: Record<UrlParamKey, UrlParamValue>;
}

/**
 * URL store getters.
 *
 * @public
 */
export interface UrlGetters {
  urlParams: Record<UrlParamKey, UrlParamValue>;
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
  setQuery(query: string): void;
  setRelatedTags(relatedTags: string[]): void;
  setExtraParams(extraParam: Record<string, string>): void;
}

/**
 * URL store actions.
 *
 * @public
 */
export interface UrlActions {
  /**
   * Updates the URL with values from the store. It replaces the current url with a new entry in the
   * browser history. Also returns the params with the custom names provided in the config if any.
   *
   * @public
   */
  updateUrl(): void;
  /**
   * Updates the store with values from the URL.
   *
   * @public
   */
  updateStoreFromUrl(): void;
}

/**
 * URL type safe store module.
 *
 * @public
 */
export type UrlXStoreModule = XStoreModule<UrlState, UrlGetters, UrlMutations, UrlActions>;
