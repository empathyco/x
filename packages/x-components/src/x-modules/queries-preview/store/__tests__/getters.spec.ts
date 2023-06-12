import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import {
  QueriesPreviewActions,
  QueriesPreviewGetters,
  QueriesPreviewMutations,
  QueriesPreviewState,
  QueryPreviewItem
} from '../types';
import { queriesPreviewXStoreModule } from '../module';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { getResultsStub } from '../../../../__stubs__';
import { SafeStore } from '../../../../store/__tests__/utils';
import { getQueryPreviewRequest, resetQueriesPreviewStateWith } from './utils';

describe('queries preview module getters', () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store: SafeStore<
    QueriesPreviewState,
    QueriesPreviewGetters,
    QueriesPreviewMutations,
    QueriesPreviewActions
  > = new Store(queriesPreviewXStoreModule as any);

  installNewXPlugin({ store }, localVue);

  beforeEach(() => {
    resetQueriesPreviewStateWith(store);
  });

  describe('loaded queries getter', () => {
    it('contains only the queries with results', () => {
      const queryWithResults: QueryPreviewItem = {
        results: getResultsStub(),
        status: 'success',
        totalResults: getResultsStub().length,
        request: getQueryPreviewRequest('queryWithResults')
      };

      resetQueriesPreviewStateWith(store, {
        queriesPreview: {
          queryWithResults,
          queryWithNoResults: {
            results: []
          }
        }
      });

      const queries = store.getters['loadedQueriesPreview'];

      expect(queries).toEqual({
        queryWithResults
      });
    });
  });
});
