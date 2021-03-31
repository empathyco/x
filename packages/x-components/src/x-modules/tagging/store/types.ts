import { XStoreModule } from '../../../store';

/**
 * Tagging store state.
 *
 * @public
 */
export interface TaggingState {}

/**
 * Tagging store getters.
 *
 * @public
 */
export interface TaggingGetters {}

/**
 * Tagging store mutations.
 *
 * @public
 */
export interface TaggingMutations {}

/**
 * Tagging store actions.
 *
 * @public
 */
export interface TaggingActions {}

/**
 * Tagging type safe store module.
 *
 * @public
 */
export type TaggingXStoreModule = XStoreModule<
  TaggingState,
  TaggingGetters,
  TaggingMutations,
  TaggingActions
>;
