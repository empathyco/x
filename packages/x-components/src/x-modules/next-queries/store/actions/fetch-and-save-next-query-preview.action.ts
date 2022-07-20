import { NextQueriesXStoreModule } from '../types';

const fetchAndSave: NextQueriesXStoreModule['actions']['fetchAndSaveNextQueryPreview'] = (
  { dispatch, commit },
  query
): Promise<void> => {
  return dispatch('fetchNextQueryPreview', query)
    .then(response => {
      if (response) {
        commit('setResultsPreview', {
          [query]: {
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

export const fetchAndSaveNextQueryPreview = fetchAndSave;
