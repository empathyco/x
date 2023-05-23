import { SemanticQueriesXStoreModule } from '../types';

export const request: SemanticQueriesXStoreModule['getters']['request'] = ({ query, params }) => {
  return query ? { query, extraParams: params } : null;
};
