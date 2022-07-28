import { NextQueriesXStoreModule } from '../types';

// eslint-disable-next-line max-len
export const fetchAndSaveNextQueryPreview: NextQueriesXStoreModule['actions']['fetchAndSaveNextQueryPreview'] =
  ({ dispatch, commit }, query): Promise<void> => {
    return dispatch('fetchNextQueryPreview', query)
      .then(response => {
        if (response) {
          commit('setResultsPreview', {
            [query]: {
              query,
              totalResults: response.totalResults,
              items: response.results
            }
          });
        }
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
  };
