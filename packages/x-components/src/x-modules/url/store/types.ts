import { Filter, RelatedTag } from '@empathyco/x-types';
import { XActionContext, XStoreModule } from '../../../store';
import { UrlParams } from '../../../types/url-params';
import { Dictionary } from '../../../utils/types';

/**
 * URL store state.
 *
 * @public
 */
export type UrlState = UrlParams & {
  initialExtraParams: Dictionary<unknown>;
};

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
   * Sets the new params.
   *
   * @param params - The new params of the Url.
   */
  setParams(params: Partial<UrlParams>): void;
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
   * @param filters - The new filter ids of the url.
   */
  setFilters(filters: Filter[]): void;
  /**
   * Sets the new page.
   *
   * @param page - The new page of the url.
   */
  setPage(page: number): void;
  /**
   * Sets the url scroll.
   *
   * @param scroll - The new first element visible in the scroll.
   */
  setScroll(scroll: string): void;
  /**
   * Sets the initial extra params.
   *
   * @param extraParams - The new initial extra params.
   */
  setInitialExtraParams(extraParams: Dictionary<unknown>): void;
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

/**
 * Alias type for actions context of the {@link UrlXStoreModule}.
 *
 * @public
 */
export type UrlActionContext = XActionContext<UrlState, UrlGetters, UrlMutations, UrlActions>;
