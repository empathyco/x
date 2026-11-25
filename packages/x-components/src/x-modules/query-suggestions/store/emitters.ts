import { createStoreEmitters } from '../../../store'
import { querySuggestionsXStoreModule } from './module'

/**
 * {@link StoreEmitters} For the query-suggestions module.
 *
 * @internal
 */
export const querySuggestionsEmitters = createStoreEmitters(querySuggestionsXStoreModule, {
  QuerySuggestionsChanged: state => state.suggestions,
  QuerySuggestionsRequestUpdated: {
    selector: (_, getters) => getters.request,
    emitWhenVisible: true,
  },
})
