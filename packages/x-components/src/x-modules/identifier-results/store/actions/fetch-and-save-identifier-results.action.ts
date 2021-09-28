import { Result } from '@empathyco/x-types';
import { SearchByIdRequest } from '@empathyco/x-adapter';

// eslint-disable-next-line max-len
import { createFetchAndSaveAction } from '../../../../store/utils/fetch-and-save-action.utils';
import { IdentifierResultsActionsContext } from '../types';

const { fetchAndSave, cancelPrevious } = createFetchAndSaveAction<
  IdentifierResultsActionsContext,
  SearchByIdRequest | null,
  Result[]
>({
  fetch({ dispatch }, request) {
    return dispatch('fetchIdentifierResults', request);
  },
  onSuccess({ commit }, identifierResults) {
    commit('setIdentifierResults', identifierResults);
  }
});

/**
 * Default implementation for {@link IdentifierResultsActions.fetchAndSaveIdentifierResults} action.
 *
 * @public
 */
export const fetchAndSaveIdentifierResults = fetchAndSave;

/**
 * Default implementation for {@link IdentifierResultsActions.cancelFetchAndSaveIdentifierResults}
 * action.
 *
 * @public
 */
export const cancelFetchAndSaveIdentifierResults = cancelPrevious;
