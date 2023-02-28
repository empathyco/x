import { Result, XComponentsAdapter } from '@empathyco/x-types';
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import {
  createResultStub,
  getEmptySearchResponseStub,
  getResultsStub
} from '../../../../__stubs__/index';
import { XComponentsAdapterDummy } from '../../../../__tests__/adapter.dummy';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { queriesPreviewXModule } from '../../x-module';
import QueryPreviewList from '../query-preview-list.vue';

function renderQueryPreviewList({
  template = `
        <QueryPreviewList v-bind="$attrs" #default="{ query, results }">
          {{ query }} - {{results[0].name}}
        </QueryPreviewList>`,
  queries = ['milk'],
  results = { milk: getResultsStub(1) }
}: RenderQueryPreviewListOptions): RenderQueryPreviewListAPI {
  const localVue = createLocalVue();
  const adapter: XComponentsAdapter = {
    ...XComponentsAdapterDummy,
    search({ query }) {
      const fakeResults = results[query];
      return Promise.resolve({
        ...getEmptySearchResponseStub(),
        results: fakeResults,
        totalResults: fakeResults.length
      });
    }
  };
  installNewXPlugin({ initialXModules: [queriesPreviewXModule], adapter }, localVue);
  const wrapper = mount(
    {
      template,
      components: {
        QueryPreviewList
      }
    },
    {
      localVue,
      propsData: {
        queries
      }
    }
  );
  return {
    wrapper: wrapper.findComponent(QueryPreviewList),
    getQueryPreviewItemWrappers() {
      return wrapper.findAll(getDataTestSelector('query-preview-item'));
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
      queries: ['shirt', 'jeans'],
      results: { shirt: [createResultStub('Cool shirt')], jeans: [createResultStub('Sick jeans')] }
    });

    // Shirt query preview
    let queryPreviews = getQueryPreviewItemWrappers();
    expect(queryPreviews.wrappers).toHaveLength(1);
    expect(queryPreviews.at(0).text()).toEqual(''); // Query preview still is loading

    // Shirt, Jeans query previews
    await reRender();
    queryPreviews = getQueryPreviewItemWrappers();
    expect(queryPreviews.wrappers).toHaveLength(2);
    expect(queryPreviews.at(0).text()).toEqual('shirt - Cool shirt');
    expect(queryPreviews.at(1).text()).toEqual('');

    await reRender();
    queryPreviews = getQueryPreviewItemWrappers();
    expect(queryPreviews.wrappers).toHaveLength(2);
    expect(queryPreviews.at(0).text()).toEqual('shirt - Cool shirt');
    expect(queryPreviews.at(1).text()).toEqual('jeans - Sick jeans');
  });

  it('hides queries with no results', async () => {
    const { getQueryPreviewItemWrappers, reRender } = renderQueryPreviewList({
      queries: ['noResults', 'shoes'],
      results: { noResults: [], shoes: [createResultStub('Crazy shoes')] }
    });

    // noResults query preview
    await reRender();
    let queryPreviews = getQueryPreviewItemWrappers();
    expect(queryPreviews.wrappers).toHaveLength(1);
    expect(queryPreviews.at(0).text()).toEqual('');

    await reRender();
    queryPreviews = getQueryPreviewItemWrappers();
    expect(queryPreviews.wrappers).toHaveLength(1);
    expect(queryPreviews.at(0).text()).toEqual('shoes - Crazy shoes');
  });
  // TODO When error handling is added this component should exclude also queries that failed.
});

interface RenderQueryPreviewListOptions {
  /** The template to render the {@link QueryPreviewList} component. */
  template?: string;
  /** The queries for which preview its results. */
  queries?: string[];
  /** The results to return from the mocked search endpoint adapter. */
  results?: Record<string, Result[]>;
}

interface RenderQueryPreviewListAPI {
  /** The Vue testing utils wrapper for the {@link QueryPreviewList} component. */
  wrapper: Wrapper<Vue>;
  /** Returns an array with the {@link QueryPreview} items wrappers. */
  getQueryPreviewItemWrappers: () => WrapperArray<Vue>;
  /** Flushes all pending promises to cause the component to be in its final state. */
  reRender: () => Promise<void>;
}
