import { XStoreModule } from '../../../store';
import { QueryMutations, QueryState } from '../../../store/utils/query.utils';
import { UrlParams } from '../../../types/url-params';
import { XEvent } from '../../../wiring/events.types';
import { QueryPreviewInfo } from '../../../x-installer/index';

/**
 * SearchBox store state.
 *
 * @public
 */
export interface SearchBoxState extends QueryState {
  /**
   * The query of the search box input.
   */
  query: string;
  /**
   * The status of the search box input based on a state machine.
   */
  inputStatus: string;
  /**
   * The selected query preview from the state.
   */
  selectedQueryPreview: QueryPreviewInfo;
}

/**
 * SearchBox store getters.
 *
 * @public
 */
export interface SearchBoxGetters {
  /** The query without initial or ending spaces. */
  trimmedQuery: string;
}

/**
 * SearchBox store mutations.
 *
 * @public
 */
export interface SearchBoxMutations extends QueryMutations {
  /**
   * Sets the new query of the search-box.
   *
   * @param newQuery - The new query of the search-box.
   */
  setQuery(newQuery: string): void;
  /**
   * Sets the new input status of the search-box.
   *
   * @param inputStatus - The new {@link InputStatus} of the search-box.
   */
  setInputStatus(inputStatus: InputStatus): void;
  /**
   * Sets the selected query preview of the module.
   *
   * @param selectedQueryPreview - The selected query preview to save to the state.
   */
  setSelectedQueryPreview(selectedQueryPreview: QueryPreviewInfo): void;
}

/**
 * SearchBox store actions.
 *
 * @public
 */
export interface SearchBoxActions {
  /**
   * Checks if the url has a query on it and then updates the state with that value.
   *
   * @param urlParams - List of params from the url.
   */
  setUrlParams(urlParams: UrlParams): void;
  /**
   * Changes the machine state to a new state and updates the input status in the store
   * with it.
   *
   * @param event - The {@link XEvent} to transition to the new state.
   */
  setInputStatus(event: XEvent): void;
}

/**
 * SearchBox type safe store module.
 *
 * @public
 */
export type SearchBoxXStoreModule = XStoreModule<
  SearchBoxState,
  SearchBoxGetters,
  SearchBoxMutations,
  SearchBoxActions
>;

/**
 * Different status for the search box input.
 *
 * @internal
 */
export type InputStatus = 'initial' | 'typing' | 'filled' | 'focused' | 'empty';
