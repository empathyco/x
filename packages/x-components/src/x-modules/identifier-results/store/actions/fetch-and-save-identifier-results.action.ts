import { Result } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { createFetchAndSaveAction } from '../../../../store/fetch-and-save-action.helpers';
import { IdentifierResultsActionsContext } from '../types';

const { fetchAndSave, cancelPrevious } = createFetchAndSaveAction<
  IdentifierResultsActionsContext,
  Result[]
>({
  fetch({ dispatch }) {
    return dispatch('fetchIdentifierResults');
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
