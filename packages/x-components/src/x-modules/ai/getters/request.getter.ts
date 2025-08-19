import type { AiXStoreModule } from '../store'

/**
 * Default implementation for the {@link AiGetters.request} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the ai
 * module.
 * @param getters - Current {@link https://vuex.vuejs.org/guide/getters.html | getters} of the
 * ai module.
 * @returns The ai request to fetch data from the API.
 *
 * @public
 */
export const request: AiXStoreModule['getters']['request'] = ({ params }, { query }) => {
  return { query, lang: params.lang as string, extraParams: params }
}
