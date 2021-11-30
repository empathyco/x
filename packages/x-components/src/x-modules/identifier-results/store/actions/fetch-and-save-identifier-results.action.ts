import { Result } from '@empathyco/x-types';
import { SearchByIdRequest } from '@empathyco/x-adapter';
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils';
import { IdentifierResultsActionsContext } from '../types';

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  IdentifierResultsActionsContext,
  SearchByIdRequest | null,
  Result[]
>({
  fetch({ dispatch, state }, request) {
    const newRequest = request
      ? {
          ...request,
          // eslint-disable-next-line @typescript-eslint/no-extra-parens
          ...(state.origin && { origin: state.origin })
        }
      : null;
    return dispatch('fetchIdentifierResults', newRequest);
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
