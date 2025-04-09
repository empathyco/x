import type { RelatedPromptsXStoreModule } from '../types'

/**
 * Default implementation for the {@link RelatedPromptsGetters.request} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the related
 * prompts module.
 * @param state.params - params state.
 * @param state.query - query state.
 *
 * @returns The related prompts request to fetch data from the API.
 *
 * @public
 */
export const request: RelatedPromptsXStoreModule['getters']['request'] = ({ params, query }) => {
  return query ? { query, extraParams: params } : null
}
