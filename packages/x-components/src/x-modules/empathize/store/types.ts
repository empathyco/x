import { XStoreModule } from '../../../store';
import { EmpathizeConfig } from '../config.types';
import { ConfigMutations } from '../../../store/utils/config-store.utils';

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
export interface EmpathizeMutations extends ConfigMutations<EmpathizeState> {
  /**
   * Sets the isOpen state of the module, which is used in the Alias API.
   *
   * @param isOpen - The new isOpen state to save.
   */
  setIsOpen(isOpen: boolean): void;
  /**
   * Sets the {@link EmpathizeState.config } config.
   *
   * @param config - The new config.
   */
  setConfig(config: EmpathizeConfig): void;
  /**
   * Merges a new config with the current one.
   *
   * @param config - The config to be merged.
   */
  mergeConfig(config: EmpathizeConfig): void;
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
