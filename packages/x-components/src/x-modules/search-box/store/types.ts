import type { XStoreModule } from '../../../store'
import type { QueryMutations, QueryState } from '../../../store/utils/query.utils'
import type { UrlParams } from '../../../types/url-params'
import type { XEvent } from '../../../wiring/events.types'

/**
 * SearchBox store state.
 *
 * @public
 */
export interface SearchBoxState extends QueryState {
  /**
   * The status of the search box input based on a state machine.
   */
  inputStatus: string
}

/**
 * SearchBox store getters.
 *
 * @public
 */
export interface SearchBoxGetters {
  /** The query without initial or ending spaces. */
  trimmedQuery: string
}

/**
 * SearchBox store mutations.
 *
 * @public
 */
export interface SearchBoxMutations extends QueryMutations {
  /**
   * Sets the new input status of the search-box.
   *
   * @param inputStatus - The new {@link InputStatus} of the search-box.
   */
  setInputStatus: (inputStatus: InputStatus) => void
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
  setUrlParams: (urlParams: UrlParams) => void
  /**
   * Changes the machine state to a new state and updates the input status in the store
   * with it.
   *
   * @param event - The {@link XEvent} to transition to the new state.
   */
  setInputStatus: (event: XEvent) => void
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
>

/**
 * Different status for the search box input.
 *
 * @internal
 */
export type InputStatus = 'initial' | 'typing' | 'filled' | 'focused' | 'empty'
