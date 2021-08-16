import { XStoreModule } from '../../../store';

/**
 * Extra params store state.
 *
 * @public
 */
export interface ExtraParamsState {}

/**
 * Extra params store getters.
 *
 * @public
 */
export interface ExtraParamsGetters {}

/**
 * Extra params store mutations.
 *
 * @public
 */
export interface ExtraParamsMutations {}

/**
 * Extra params store actions.
 *
 * @public
 */
export interface ExtraParamsActions {}

/**
 * Extra params type safe store module.
 *
 * @public
 */
export type ExtraParamsXStoreModule = XStoreModule<
  ExtraParamsState,
  ExtraParamsGetters,
  ExtraParamsMutations,
  ExtraParamsActions
>;
