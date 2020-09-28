import { IdentifierResultsXStoreModule } from '../types';

/**
 * Default implementation for the {@link IdentifierResultsActions.fetchAndSaveIdentifierResults}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @returns A `void` promise that resolves when the identifier results finishes updating.
 *
 * @public
 */
//eslint-disable-next-line max-len
export const fetchAndSaveIdentifierResults: IdentifierResultsXStoreModule['actions']['fetchAndSaveIdentifierResults'] = ({
  dispatch,
  commit
}) =>
  dispatch('fetchIdentifierResults').then(identifierResults =>
    commit('setIdentifierResults', identifierResults)
  );
