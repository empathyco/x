import { SearchBoxXStoreModule } from '../types';

export const setQueryFromUrl: SearchBoxXStoreModule['actions']['setQueryFromUrl'] = (
  { commit },
  urlParams
) => {
  const query = urlParams.query as string;
  if (query) {
    commit('setQuery', query);
  }
};
