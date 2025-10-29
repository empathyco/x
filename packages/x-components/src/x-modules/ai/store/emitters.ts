import { createStoreEmitters } from '../../../store'
import { aiXStoreModule } from './module'

/**
 * {@link StoreEmitters} For the ai module.
 *
 * @internal
 */
export const aiEmitters = createStoreEmitters(aiXStoreModule, {
  AiSuggestionsRequestUpdated: (_, getters) => getters.suggestionsRequest,
  AiSuggestionsSearchRequestUpdated: (_, getters) => getters.suggestionsSearchRequest,
  AiSuggestionsSearchChanged: state => state.suggestionsSearch,
})
