import { Result, XComponentsAdapter } from '@empathyco/x-types';
import { mount, VueWrapper } from '@vue/test-utils';
import {
  createResultStub,
  getEmptySearchResponseStub,
  getResultsStub
} from '../../../../__stubs__/index';
import { XComponentsAdapterDummy } from '../../../../__tests__/adapter.dummy';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { queriesPreviewXModule } from '../../x-module';
import QueryPreviewList from '../query-preview-list.vue';
import { QueryPreviewInfo } from '../../store/types';
import { QueryFeature } from '../../../../types';
import { QueryPreview } from '../index';

function renderQueryPreviewList({
  template = `
        <QueryPreviewList v-bind="$attrs" #default="{ queryPreviewInfo, results }">
          {{ queryPreviewInfo.query }} - {{results[0].name}}
        </QueryPreviewList>`,
  queriesPreviewInfo = [{ query: 'milk' }],
  results = { milk: getResultsStub(1) },
  debounceTimeMs = 0,
  persistInCache = true,
  queryFeature = 'search_box',
  maxItemsToRender = 4
}: RenderQueryPreviewListOptions): RenderQueryPreviewListAPI {
  const adapter: XComponentsAdapter = {
    ...XComponentsAdapterDummy,
    search: jest.fn(({ query }) => {
      const fakeResults = results[query];
      return Promise.resolve({
        ...getEmptySearchResponseStub(),
        results: fakeResults,
        totalResults: fakeResults.length
      });
    })
  };

  const wrapper = mount(
    {
      template,
      components: {
        QueryPreviewList,
        QueryPreview
      }
    },
    {
      global: {
        plugins: [installNewXPlugin({ initialXModules: [queriesPreviewXModule], adapter })]
      },
      props: {
        queriesPreviewInfo,
        debounceTimeMs,
        persistInCache,
        queryFeature,
        maxItemsToRender
      }
    }
  );
  return {
    adapter,
    wrapper,
    queryPreviewListWrapper: wrapper.findComponent(QueryPreviewList),
    getQueryPreviewItemWrappers() {
      return wrapper.findAllComponents(QueryPreview);
    },
    reRender() {
      // A timeout with no time should resolve after all reactivity + promises involved
      return new Promise(resolve => setTimeout(resolve));
    }
  };
}

describe('testing QueryPreviewList', () => {
  it('renders a list of queries one by one', async () => {
    const { getQueryPreviewItemWrappers, reRender } = renderQueryPreviewList({
      queriesPreviewInfo: [{ query: 'shirt' }, { query: 'jeans' }],
      results: { shirt: [createResultStub('Cool shirt')], jeans: [createResultStub('Sick jeans')] }
    });

    // Shirt query preview
    let queryPreviews = getQueryPreviewItemWrappers();
    expect(queryPreviews).toHaveLength(1);
    expect(queryPreviews.at(0)?.text()).toEqual(''); // Query preview still is loading

    // Shirt, Jeans query previews
    await reRender();
    queryPreviews = getQueryPreviewItemWrappers();
    expect(queryPreviews).toHaveLength(2);
    expect(queryPreviews.at(0)?.text()).toEqual('shirt - Cool shirt');
    expect(queryPreviews.at(1)?.text()).toEqual('');

    await reRender();
    queryPreviews = getQueryPreviewItemWrappers();
    expect(queryPreviews).toHaveLength(2);
    expect(queryPreviews.at(0)?.text()).toEqual('shirt - Cool shirt');
    expect(queryPreviews.at(1)?.text()).toEqual('jeans - Sick jeans');
  });

  it('should propagate global props from the list to each item', async () => {
    const debounceTimeMsStub = 200;
    const persistInCacheStub = false;
    const queryFeatureStub: QueryFeature = 'history_query';
    const maxItemsToRenderStub = 2;
    const { getQueryPreviewItemWrappers, reRender } = renderQueryPreviewList({
      queriesPreviewInfo: [{ query: 'shirt' }, { query: 'jeans' }],
      results: { shirt: [createResultStub('Cool shirt')], jeans: [createResultStub('Sick jeans')] },
      debounceTimeMs: debounceTimeMsStub,
      persistInCache: persistInCacheStub,
      queryFeature: queryFeatureStub,
      maxItemsToRender: maxItemsToRenderStub
    });

    // Shirt, Jeans query previews
    await reRender();
    const queryPreviews = getQueryPreviewItemWrappers();

    queryPreviews.forEach(queryPreview => {
      const queryPreviewProps = queryPreview.props() as typeof QueryPreview;
      expect(queryPreviewProps.debounceTimeMs).toEqual(debounceTimeMsStub);
      expect(queryPreviewProps.persistInCache).toEqual(persistInCacheStub);
      expect(queryPreviewProps.queryFeature).toEqual(queryFeatureStub);
      expect(queryPreviewProps.maxItemsToRender).toEqual(maxItemsToRenderStub);
    });
  });

  it('hides queries with no results', async () => {
    const { getQueryPreviewItemWrappers, reRender } = renderQueryPreviewList({
      queriesPreviewInfo: [{ query: 'noResults' }, { query: 'shoes' }],
      results: { noResults: [], shoes: [createResultStub('Crazy shoes')] }
    });

    // noResults query preview
    await reRender();
    let queryPreviews = getQueryPreviewItemWrappers();
    expect(queryPreviews).toHaveLength(1);
    expect(queryPreviews.at(0)?.text()).toEqual('');

    await reRender();
    queryPreviews = getQueryPreviewItemWrappers();
    expect(queryPreviews).toHaveLength(1);
    expect(queryPreviews.at(0)?.text()).toEqual('shoes - Crazy shoes');
  });

  it('hides queries that failed', async () => {
    const { adapter, getQueryPreviewItemWrappers, reRender } = renderQueryPreviewList({
      queriesPreviewInfo: [{ query: 'willFail' }, { query: 'shoes' }],
      results: {
        willFail: [createResultStub('Will fail')],
        shoes: [createResultStub('Crazy shoes')]
      }
    });

    (adapter.search as jest.Mock).mockRejectedValueOnce('Some error');

    // First query will fail
    await reRender();
    let queryPreviews = getQueryPreviewItemWrappers();
    expect(queryPreviews).toHaveLength(1);
    expect(queryPreviews.at(0)?.text()).toEqual(''); // Query preview still is loading

    await reRender();
    queryPreviews = getQueryPreviewItemWrappers();
    expect(queryPreviews).toHaveLength(1);
    expect(queryPreviews.at(0)?.text()).toEqual('shoes - Crazy shoes');
  });

  it('load next batch when it contains duplicates', async () => {
    const { getQueryPreviewItemWrappers, reRender, wrapper } = renderQueryPreviewList({
      queriesPreviewInfo: [{ query: 'shirt' }, { query: 'jeans' }],
      results: {
        shirt: [createResultStub('Cool shirt')],
        jeans: [createResultStub('Sick jeans')],
        dress: [createResultStub('cool dress ')]
      }
    });
    await reRender();
    let queryPreviews = getQueryPreviewItemWrappers();

    expect(queryPreviews).toHaveLength(2);
    await wrapper.setProps({
      queriesPreviewInfo: [{ query: 'shirt' }, { query: 'jeans' }, { query: 'dress' }]
    });
    await reRender();
    queryPreviews = getQueryPreviewItemWrappers();
    expect(queryPreviews).toHaveLength(3);
  });
});

interface RenderQueryPreviewListOptions {
  /** The template to render the {@link QueryPreviewList} component. */
  template?: string;
  /** The queries for which preview its results. */
  queriesPreviewInfo?: QueryPreviewInfo[];
  /** The results to return from the mocked search endpoint adapter. */
  results?: Record<string, Result[]>;
  persistInCache?: boolean;
  debounceTimeMs?: number;
  queryFeature?: QueryFeature;
  maxItemsToRender?: number;
}

interface RenderQueryPreviewListAPI {
  /** The {@link XComponentsAdapter} passed to the {@link XPlugin}. */
  adapter: XComponentsAdapter;
  /** The Vue testing utils wrapper for the {@link QueryPreviewList} component. */
  wrapper: VueWrapper;
  /** Returns an array with the {@link QueryPreviewList} wrapper. */
  queryPreviewListWrapper: VueWrapper;
  /** Returns an array with the {@link QueryPreview} items wrappers. */
  getQueryPreviewItemWrappers: () => VueWrapper[];
  /** Flushes all pending promises to cause the component to be in its final state. */
  reRender: () => Promise<void>;
}
