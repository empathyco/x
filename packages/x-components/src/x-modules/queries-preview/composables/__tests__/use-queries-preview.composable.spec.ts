import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { DeepPartial } from '@empathyco/x-utils';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { useQueriesPreview } from '../use-queries-preview.composable';
import { XPlugin } from '../../../../plugins';
import { RootXStoreState } from '../../../../store';
import { resetXQueriesPreviewStateWith } from '../../components/__tests__/utils';
import { queriesPreviewXModule } from '../../x-module';
import { createQueryPreviewItem } from '../../../../__stubs__/queries-preview-stubs.factory';

describe('queries preview composables', () => {
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
