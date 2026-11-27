import { deepEqual } from '@empathyco/x-utils'
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
    selector: (state, getters) =>
      !state.config.requestOnlyWhenVisible || state.isVisible ? getters.request : null,
    filter: (newValue, _oldValue, { config, isVisible, lastRequest }) =>
      !config.requestOnlyWhenVisible ||
      (isVisible &&
        newValue !== lastRequest &&
        (!newValue || !lastRequest || !deepEqual(newValue, lastRequest))),
  },
})
