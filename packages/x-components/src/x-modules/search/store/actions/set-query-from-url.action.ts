import { SearchXStoreModule } from '../types';

export const setQueryFromUrl: SearchXStoreModule['actions']['setQueryFromUrl'] = (
  { commit },
  urlParams
) => {
  const query = urlParams.query as string;
  if (query) {
    commit('setQuery', query);
  }
};
