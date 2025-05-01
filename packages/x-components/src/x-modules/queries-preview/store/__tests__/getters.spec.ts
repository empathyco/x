import type { SafeStore } from '../../../../store/__tests__/utils'
import type {
  QueriesPreviewActions,
  QueriesPreviewGetters,
  QueriesPreviewMutations,
  QueriesPreviewState,
  QueryPreviewItem,
} from '../types'
import { Store } from 'vuex'
import { getResultsStub } from '../../../../__stubs__'
import { getQueryPreviewRequest } from '../../../../__stubs__/queries-preview-stubs.factory'
import { installNewXPlugin } from '../../../../__tests__/utils'
import { queriesPreviewXStoreModule } from '../module'
import { resetQueriesPreviewStateWith } from './utils'

describe('queries preview module getters', () => {
  const store: SafeStore<
    QueriesPreviewState,
    QueriesPreviewGetters,
    QueriesPreviewMutations,
    QueriesPreviewActions
  > = new Store(queriesPreviewXStoreModule as any)

  installNewXPlugin({ store })

  beforeEach(() => {
    resetQueriesPreviewStateWith(store)
  })

  describe('loaded queries getter', () => {
    it('contains only the queries with results', () => {
      const queryWithResults: QueryPreviewItem = {
        results: getResultsStub(),
        status: 'success',
        totalResults: getResultsStub().length,
        request: getQueryPreviewRequest('queryWithResults'),
        instances: 1,
      }

      resetQueriesPreviewStateWith(store, {
        queriesPreview: {
          queryWithResults,
          queryWithNoResults: {
            results: [],
          },
        },
      })

      const queries = store.getters.loadedQueriesPreview

      expect(queries).toEqual({
        queryWithResults,
      })
    })
  })
})
