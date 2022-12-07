import {
  namespacedWireCommit,
  namespacedWireDispatch
} from '../../wiring/namespaced-wires.factory';
import { NamespacedWireCommit } from '../../wiring/namespaced-wiring.types';
import { createWiring } from '../../wiring/wiring.utils';
import { XEvent } from '../../wiring/events.types';
import { AnyWire } from '../../wiring/wiring.types';

/**
 * `searchBox` {@link XModuleName | XModule name}.
 *
 * @internal
 */
const moduleName = 'searchBox';

/**
 * WireCommit for {@link SearchBoxXModule}.
 *
 * @internal
 */
const wireCommit: NamespacedWireCommit<typeof moduleName> = namespacedWireCommit(moduleName);

/**
 * WireDispatch for {@link SearchBoxXModule}.
 *
 * @internal
 */
const wireDispatch = namespacedWireDispatch(moduleName);

/**
 * Sets the query of the search-box module.
 *
 * @public
 */
const setSearchBoxQuery = wireCommit('setQuery');

/**
 * Clears the query of the search-box module.
 *
 * @public
 */
const clearSearchBoxQuery = wireCommit('setQuery', '');

/**
 * Sets the search state `query`.
 *
 * @public
 */
const setUrlParams = wireDispatch('setUrlParams');

/**
 * Sets the search state `status`.
 *
 * @param event - The {@link XEvent} used to transition the status.
 *
 * @returns A wire.
 *
 * @public
 */
const setStatus = (event: XEvent): AnyWire => wireDispatch('setStatus', event);

/**
 * SearchBox wiring.
 *
 * @internal
 */
export const searchBoxWiring = createWiring({
  ParamsLoadedFromUrl: {
    setUrlParams
  },
  UserIsTypingAQuery: {
    setSearchBoxQuery,
    transitionState: setStatus('UserIsTypingAQuery')
  },
  UserAcceptedAQuery: {
    setSearchBoxQuery,
    transitionState: setStatus('UserAcceptedAQuery')
  },
  UserPressedClearSearchBoxButton: {
    clearSearchBoxQuery
  },
  UserClickedCloseX: {
    clearSearchBoxQuery
  },
  UserClickedOutOfMainModal: {
    clearSearchBoxQuery
  },
  UserClearedQuery: {
    transitionState: setStatus('UserClearedQuery')
  },
  UserFocusedSearchBox: {
    transitionState: setStatus('UserFocusedSearchBox')
  },
  UserBlurredSearchBox: {
    transitionState: setStatus('UserBlurredSearchBox')
  }
});
