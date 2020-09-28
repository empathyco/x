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
  identifierResultsRequest: SearchByIdRequest | null;
  /** The RegExp to test against the query. */
  identifierDetectionRegexp: RegExp;
  /** The RegExp with the current query from the state adding the separatorChars after each
   * matching character. */
  identifierHighlightRegexp: RegExp;
}

/**
 * IdentifierResults store mutations.
 *
 * @public
 */
export interface IdentifierResultsMutations {
  /**
   * Sets the query of the module, which is used to retrieve the identifier-results.
   *
   * @param newQuery - The new query to save to the state.
   */
  setQuery(newQuery: string): void;
  /**
   * Sets the identifier results of the module.
   *
   * @param identifierResults - The new identifier results to save to the state.
   */
  setIdentifierResults(identifierResults: Result[]): void;
}

/**
 * IdentifierResults store actions.
 *
 * @public
 */
export interface IdentifierResultsActions {
  /**
   * Requests a new set of identifier results for the module query, and returns them.
   *
   * @returns An array of identifier results.
   */
  fetchIdentifierResults(): Result[];
  /**
   * Requests a new set of identifier results and stores them in the module.
   */
  fetchAndSaveIdentifierResults(): void;
  /**
   * Stores the query in the module if it matches the regex.
   */
  saveQuery(query: string): void;
}

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
