import type { QueriesPreviewXStoreModule } from '../types'
import { objectFilter } from '@empathyco/x-utils'

/**
 * Default implementation for the {@link QueriesPreviewGetters.loadedQueriesPreview} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of
 * the queries preview module.
 * @returns The loaded previews from the state.
 */
export const loadedQueriesPreview: QueriesPreviewXStoreModule['getters']['loadedQueriesPreview'] =
  ({ queriesPreview }) => {
    return objectFilter(queriesPreview, (_, preview) => {
      return preview.status === 'success' && preview.totalResults > 0
    })
  }
