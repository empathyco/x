import { XStoreModule } from '../../../store';
import { UrlConfig } from '../config.types';

export interface MappedParams {
  [originalParamName: string]: MappedParam;
}

export interface MappedParam {
  key: UrlParamKey;
  value: UrlParamValue;
}

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
  urlParams: MappedParams;
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
   * It updates the URL with values from the store.
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
