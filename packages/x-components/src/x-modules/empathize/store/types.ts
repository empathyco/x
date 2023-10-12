import { XStoreModule } from '../../../store';
import { EmpathizeConfig } from '../config.types';

/**
 * Empathize store state.
 *
 * @public
 */
export interface EmpathizeState {
  /**
   * The current state of the empathize.
   *
   * @public
   */
  isOpen: boolean;
  /**
   * The config of `Empathize` module.
   *
   * @public
   */
  config: EmpathizeConfig;
}

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
export interface EmpathizeMutations {
  /**
   * Sets the isOpen state of the module, which is used in the Alias API.
   *
   * @param isOpen - The new isOpen state to save.
   */
  setIsOpen(isOpen: boolean): void;
}

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
