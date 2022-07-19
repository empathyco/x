import { NextQueriesXStoreModule } from '../types';

const fetchAndSave: NextQueriesXStoreModule['actions']['fetchAndSaveNextQueryPreview'] = (
  { dispatch, commit },
  query
): Promise<void> => {
  return dispatch('fetchNextQueryPreview', query).then(response => {
    if (response) {
      commit('setResultsPreview', {
        query,
        results: {
          totalResults: response.totalResults,
          items: response.results
        }
      });
    }
    commit('setStatus', 'success');
  });
};

export const fetchAndSaveNextQueryPreview = fetchAndSave;
