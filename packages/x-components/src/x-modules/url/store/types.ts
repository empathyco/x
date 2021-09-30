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
  params: UrlParams;
  extraParams: Dictionary<UrlParamValue>;
}

/**
 * URL store params.
 *
 * @public
 */
export interface UrlParams {
  query: string;
  page: number;
  filters: Array<string | number>;
  sort: string;
  relatedTags: string[];
  scroll: number;
}

/**
 * URL store getters.
 *
 * @public
 */
export interface UrlGetters {
  /** The current params in the url. */
  urlParams: UrlParams;

  /** All the parameter names with their corresponding key. */
  urlMappedParamNames: Dictionary<UrlParamKey | string>;
}

/**
 * The key of the parameter to store in the URL.
 *
 * @public
 */
export type UrlParamKey = Extract<keyof UrlParams, string>;

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
  /**
   * Sets a new url configuration.
   *
   * @param config - The new config of the Url.
   */
  setUrlConfig(config: UrlConfig): void;
  /**
   * Sets new extra params.
   *
   * @param extraParam - The new extra params of the Url.
   */
  setExtraParams(extraParam: Dictionary<UrlParamValue>): void;
  /**
   * Sets the new params.
   *
   * @param params - The new params of the Url.
   */
  setParams(params: UrlParams): void;
  /**
   * Sets the new query.
   *
   * @param query - The new query of the Url.
   */
  setQuery(query: string): void;
  /**
   * Sets the related tags.
   *
   * @param relatedTags - The new related tags of the url.
   */
  setRelatedTags(relatedTags: string[]): void;
  /**
   * Sets the new filter ids.
   *
   * @param filterIds - The new filter ids of the url.
   */
  setFilters(filterIds: (string | number)[]): void;
  /**
   * Sets the new page.
   *
   * @param page - The new page of the url.
   */
  setPage(page: number): void;
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
