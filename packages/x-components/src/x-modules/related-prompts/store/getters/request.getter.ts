import { RelatedPromptsXStoreModule } from '../types';

export const request: RelatedPromptsXStoreModule['getters']['request'] = ({ query }) => {
  return query ? { query } : null;
};
