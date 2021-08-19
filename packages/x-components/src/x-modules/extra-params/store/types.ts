import { XStoreModule } from '../../../store';
import { Dictionary } from '../../../utils';

/**
 * ExtraParams store state.
 *
 * @public
 */
export interface ExtraParamsState {
  params: Dictionary<unknown>;
}

/**
 * ExtraParams store getters.
 *
 * @public
 */
export interface ExtraParamsGetters {}

/**
 * ExtraParams store mutations.
 *
 * @public
 */
export interface ExtraParamsMutations {
  setParams(params: Dictionary<unknown>): void;
}

/**
 * ExtraParams store actions.
 *
 * @public
 */
export interface ExtraParamsActions {}

/**
 * ExtraParams type safe store module.
 *
 * @public
 */
export type ExtraParamsXStoreModule = XStoreModule<
  ExtraParamsState,
  ExtraParamsGetters,
  ExtraParamsMutations,
  ExtraParamsActions
>;
