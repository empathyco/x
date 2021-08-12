import { XStoreModule } from '../../../store';

/**
 * URL store state.
 *
 * @public
 */
export interface UrlState {}

/**
 * URL store getters.
 *
 * @public
 */
export interface UrlGetters {}

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
