import { XStoreModule } from '../../../store';
import { ArrowKey } from '../../../utils/types';

/**
 * Empathize store state.
 *
 * @public
 */
export interface EmpathizeState {}

/**
 * Empathize store getters.
 *
 * @public
 */
export interface EmpathizeGetters {}

/**
 * Empathize store mutations.
 *
 * @public
 */
export interface EmpathizeMutations {}

/**
 * Empathize store actions.
 *
 * @public
 */
export interface EmpathizeActions {
  keyboardAction(arrowKey: ArrowKey): void;
}

/**
 * Empathize type safe store module.
 *
 * @public
 */
export type EmpathizeXStoreModule = XStoreModule<
  EmpathizeState,
  EmpathizeGetters,
  EmpathizeMutations,
  EmpathizeActions
>;
