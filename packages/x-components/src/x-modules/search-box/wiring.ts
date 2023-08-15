import {
  namespacedWireCommit,
  namespacedWireDispatch
} from '../../wiring/namespaced-wires.factory';
import { NamespacedWireCommit } from '../../wiring/namespaced-wiring.types';
import { createWiring } from '../../wiring/wiring.utils';
import { XEvent } from '../../wiring/events.types';
import { AnyWire } from '../../wiring/wiring.types';
import { filter } from '../../wiring/index';

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
 * Updates the state with the selected query preview object.
 *
 * @public
 */

export const setSelectedQueryPreviewSearchBoxWire = wireCommit('setSelectedQueryPreview');
/**
 * Clears the selected query preview object from search box module.
 *
 * @public
 */

export const clearSelectedQueryPreviewSearchBoxWire = wireCommit('setSelectedQueryPreview', {
  query: '',
  extraParams: undefined
});
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
const setInputStatus = (event: XEvent): AnyWire => wireDispatch('setInputStatus', event);

/**
 * SearchBox wiring.
 *
 * @internal
 */
export const searchBoxWiring = createWiring({
  ParamsLoadedFromUrl: {
    setUrlParams,
    transitionState: filter(setInputStatus('UserAcceptedAQuery'), ({ eventPayload: urlParams }) => {
      return !!urlParams.query;
    })
  },
  UserIsTypingAQuery: {
    setSearchBoxQuery,
    transitionState: setInputStatus('UserIsTypingAQuery')
  },
  UserAcceptedAQuery: {
    setSearchBoxQuery,
    transitionState: setInputStatus('UserAcceptedAQuery')
  },
  UserPressedClearSearchBoxButton: {
    clearSearchBoxQuery
  },
  UserClickedCloseX: {
    clearSearchBoxQuery,
    clearSelectedQueryPreviewSearchBoxWire
  },
  UserClickedOutOfMainModal: {
    clearSearchBoxQuery,
    clearSelectedQueryPreviewSearchBoxWire
  },
  UserClearedQuery: {
    transitionState: setInputStatus('UserClearedQuery'),
    clearSelectedQueryPreviewSearchBoxWire
  },
  UserFocusedSearchBox: {
    transitionState: setInputStatus('UserFocusedSearchBox')
  },
  UserBlurredSearchBox: {
    transitionState: setInputStatus('UserBlurredSearchBox')
  },
  SetQueryPreviewQuery: {
    setSearchBoxQuery
  },
  UserAcceptedAQueryPreview: {
    setSelectedQueryPreviewSearchBoxWire
  }
});
