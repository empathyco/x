import { XStoreModule } from '../../../store';

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
export interface EmpathizeActions {}

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
