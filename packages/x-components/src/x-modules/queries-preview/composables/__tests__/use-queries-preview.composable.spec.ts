import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { DeepPartial } from '@empathyco/x-utils';
import { QueryPreviewItem } from '../../store/types';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { getQueryPreviewRequest } from '../../store/__tests__/utils';
import { useQueriesPreview } from '../use-queries-preview.composable';
import { getResultsStub } from '../../../../__stubs__';
import { XPlugin } from '../../../../plugins';
import { RootXStoreState } from '../../../../store';
import { resetXQueriesPreviewStateWith } from '../../components/__tests__/utils';
import { queriesPreviewXModule } from '../../x-module';

describe('queries preview composables', () => {
  const createQueryPreviewItem: (
    query: string,
    queryPreviewItem?: Partial<QueryPreviewItem>
  ) => QueryPreviewItem = (query, queryPreviewItem) => {
    const results = getResultsStub();
    return {
      results: results,
      totalResults: results.length,
      status: 'success',
      request: getQueryPreviewRequest(query),
      ...queryPreviewItem
    };
  };

  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store = new Store<DeepPartial<RootXStoreState>>({});

  installNewXPlugin({ store }, localVue);
  XPlugin.registerXModule(queriesPreviewXModule);

  beforeEach(() => {
    resetXQueriesPreviewStateWith(store);
  });

  describe('isAnyQueryLoadedInPreview', () => {
    const { isAnyQueryLoadedInPreview } = useQueriesPreview();

    it('returns true if any query has results', () => {
      resetXQueriesPreviewStateWith(store, {
        queriesPreview: {
          queryWithResults: createQueryPreviewItem('queryWithResults'),
          queryWithNoResults: createQueryPreviewItem('queryWithNoResults', {
            totalResults: 0,
            results: []
          })
        }
      });
      expect(isAnyQueryLoadedInPreview(['queryWithResults'])).toBe(true);
    });

    it('returns false if no query with results matches', () => {
      resetXQueriesPreviewStateWith(store, {
        queriesPreview: {
          queryWithResults: createQueryPreviewItem('queryWithResults'),
          queryWithNoResults: createQueryPreviewItem('queryWithNoResults', {
            totalResults: 0,
            results: []
          })
        }
      });
      expect(isAnyQueryLoadedInPreview(['someQuery', 'anotherQuery'])).toBe(false);
    });

    it('returns false if the query is present but does not have results', () => {
      resetXQueriesPreviewStateWith(store, {
        queriesPreview: {
          queryWithNoResults: createQueryPreviewItem('queryWithNoResults', {
            totalResults: 0,
            results: []
          })
        }
      });
      expect(isAnyQueryLoadedInPreview(['queryWithNoResults'])).toBe(false);
    });
  });
});
