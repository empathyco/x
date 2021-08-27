import { XStoreModule } from '../../../store';

/**
 * URL store state.
 *
 * @public
 */
export interface UrlState {
  query: string;
  page: number;
  filters: string[];
  sort: string;
  relatedTags: string[];
  [key: string]: unknown;
}

/**
 * URL store getters.
 *
 * @public
 */
export interface UrlGetters {
  urlParams: UrlState;
}

/**
 * URL store mutations.
 *
 * @public
 */
export interface UrlMutations {}

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
