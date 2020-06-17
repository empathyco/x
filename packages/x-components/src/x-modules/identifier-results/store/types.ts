import { SearchByIdRequest } from '@empathy/search-adapter';
import { Result } from '@empathy/search-types';
import { XStoreModule } from '../../../store';
import { IdentifierResultsConfig } from '../config.types';
/**
 * IdentifierResults store state.
 *
 * @public
 */
export interface IdentifierResultsState {
  /** The internal query of the module. Used to request the identifier results. */
  query: string;
  /** The list of the identifier results, related to the `query` property of the state. */
  identifierResults: Result[];
  /** The configuration of the identifier results module. */
  config: IdentifierResultsConfig;
}
/**
 * IdentifierResults store getters.
 *
 * @public
 */
export interface IdentifierResultsGetters {
  /** The adapter request object for retrieving the identifier suggestions, or null if there is not
   * valid data to create a request. */
  request: SearchByIdRequest | null;
}
/**
 * IdentifierResults store mutations.
 *
 * @public
 */
export interface IdentifierResultsMutations {}
/**
 * IdentifierResults store actions.
 *
 * @public
 */
export interface IdentifierResultsActions {}
/**
 * IdentifierResults type safe store module.
 *
 * @public
 */
export type IdentifierResultsXStoreModule = XStoreModule<
  IdentifierResultsState,
  IdentifierResultsGetters,
  IdentifierResultsMutations,
  IdentifierResultsActions
>;
