import { Store } from 'vuex';
import { DeepPartial } from '@empathyco/x-utils';
import { defineComponent } from 'vue';
import { mount, VueWrapper } from '@vue/test-utils';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { useQueriesPreview } from '../use-queries-preview.composable';
import { XPlugin } from '../../../../plugins';
import { RootXStoreState } from '../../../../store';
import { resetXQueriesPreviewStateWith } from '../../components/__tests__/utils';
import { queriesPreviewXModule } from '../../x-module';
import { createQueryPreviewItem } from '../../../../__stubs__/queries-preview-stubs.factory';

const store = new Store<DeepPartial<RootXStoreState>>({});

const renderUseQueriesPreview = (): renderUseQueriesPreview => {
  const component = defineComponent({
    xModule: queriesPreviewXModule.name,
    template: '<div></div>'
  });

  const wrapper = mount(component, {
    global: { plugins: [installNewXPlugin({ store }), store] }
  });

  XPlugin.registerXModule(queriesPreviewXModule);
  resetXQueriesPreviewStateWith(store);

  return {
    store,
    wrapper
  };
};

describe('queries preview composables', () => {
  beforeEach(() => {
    resetXQueriesPreviewStateWith(store);
  });

  describe('isAnyQueryLoadedInPreview', () => {
    const { store } = renderUseQueriesPreview();
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

type renderUseQueriesPreview = {
  store: Store<DeepPartial<RootXStoreState>>;
  wrapper: VueWrapper;
};
