import { Filter, RelatedTag } from '@empathyco/x-types';
import { XActionContext, XStoreModule } from '../../../store';
import { UrlParams } from '../../../types/url-params';
import { Dictionary } from '../../../utils/types';

/**
 * URL store state.
 *
 * @public
 */
export interface UrlState {
  params: UrlParams;
  extraParams: Dictionary<unknown>;
}

/**
 * URL store getters.
 *
 * @public
 */
export interface UrlGetters {
  /** The current params in the url. */
  urlParams: UrlParams;
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
   * Sets new extra params.
   *
   * @param extraParam - The new extra params of the Url.
   */
  setExtraParams(extraParam: Dictionary<unknown>): void;
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
  setRelatedTags(relatedTags: RelatedTag[]): void;
  /**
   * Sets the new filter ids.
   *
   * @param filterIds - The new filter ids of the url.
   */
  setFilters(filterIds: Filter[]): void;
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
   * Updates the store with values from the URL.
   *
   * @public
   */
  updateStoreFromUrl(urlParams: UrlParams): void;
}

/**
 * URL type safe store module.
 *
 * @public
 */
export type UrlXStoreModule = XStoreModule<UrlState, UrlGetters, UrlMutations, UrlActions>;

/**
 * Alias type for actions context of the {@link UrlXStoreModule}.
 *
 * @public
 */
export type UrlActionContext = XActionContext<UrlState, UrlGetters, UrlMutations, UrlActions>;
