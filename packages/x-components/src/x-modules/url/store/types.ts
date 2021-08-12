import { XStoreModule } from '../../../store';

/**
 * URL store state.
 *
 * @public
 */
export interface URLState {}

/**
 * URL store getters.
 *
 * @public
 */
export interface URLGetters {}

/**
 * URL store mutations.
 *
 * @public
 */
export interface URLMutations {}

/**
 * URL store actions.
 *
 * @public
 */
export interface URLActions {}

/**
 * URL type safe store module.
 *
 * @public
 */
export type URLXStoreModule = XStoreModule<URLState, URLGetters, URLMutations, URLActions>;
