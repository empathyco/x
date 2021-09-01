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
}

/**
 * URL store actions.
 *
 * @public
 */
export interface UrlActions {}

/**
 * URL type safe store module.
 *
 * @public
 */
export type UrlXStoreModule = XStoreModule<UrlState, UrlGetters, UrlMutations, UrlActions>;
