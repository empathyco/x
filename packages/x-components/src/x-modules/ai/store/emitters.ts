import { createStoreEmitters } from '../../../store'

import { aiXStoreModule } from './module'

/**
 * {@link StoreEmitters} For the ai module.
 *
 * @internal
 */
export const aiEmitters = createStoreEmitters(aiXStoreModule, {
  AiSuggestionsRequestUpdated: (_, getters) => getters.request,
  AiSuggestionsQueriesUpdated: (state, getters) => ({
    queries: state.queries,
    extraParams: getters.request?.extraParams,
  }),
})
