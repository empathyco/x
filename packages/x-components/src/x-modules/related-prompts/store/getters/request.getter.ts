import { RelatedPromptsXStoreModule } from '../types';

/**
 * Default implementation for the {@link RelatedPromptsGetters.request} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the related
 * prompts module.
 *
 * @returns The related prompts request to fetch data from the API.
 */
export const request: RelatedPromptsXStoreModule['getters']['request'] = ({ query }) => {
  return query ? { query } : null;
};
