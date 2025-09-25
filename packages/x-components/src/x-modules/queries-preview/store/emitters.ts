import { createStoreEmitters } from '../../../store'
import { queriesPreviewXStoreModule } from './module'

/**
 * {@link StoreEmitters} For the queries-preview module.
 *
 * @internal
 */
export const queriesPreviewEmitters = createStoreEmitters(queriesPreviewXStoreModule, {
  QueryPreviewUnselected: {
    selector: state =>
      !state.selectedQueryPreview ? state.params : state.selectedQueryPreview.extraParams!,
    filter: (_newValue, _oldValue, state) => !state.selectedQueryPreview,
  },
  QueriesPreviewChanged: (_state, getters) => getters.loadedQueriesPreview,
})
