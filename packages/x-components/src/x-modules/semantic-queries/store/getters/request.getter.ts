import { SemanticQueriesXStoreModule } from '../types';

export const request: SemanticQueriesXStoreModule['getters']['request'] = ({
  query,
  params,
  totalResults,
  config: { threshold }
}) => {
  return query && totalResults <= threshold ? { query, extraParams: params } : null;
};
