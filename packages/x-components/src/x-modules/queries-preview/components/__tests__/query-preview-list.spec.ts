import { Result, XComponentsAdapter } from '@empathyco/x-types';
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import {
  createResultStub,
  getEmptySearchResponseStub,
  getResultsStub
} from '../../../../__stubs__/index';
import { XComponentsAdapterDummy } from '../../../../__tests__/adapter.dummy';
import {
  getDataTestSelector,
  getMockedAdapter,
  installNewXPlugin
} from '../../../../__tests__/utils';
import { queriesPreviewXModule } from '../../x-module';
import QueryPreviewList from '../query-preview-list.vue';

function renderQueryPreviewList({
  template = '<QueryPreviewList v-bind="$attrs"/>',
  queries = ['milk'],
  results = { milk: getResultsStub(1) }
}: RenderQueryPreviewListOptions): RenderQueryPreviewListApi {
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
      template: `
        <QueryPreviewList v-bind="$attrs" #default="{ query, results }">
          {{ query }} - {{results[0].name}}
        </QueryPreviewList>`,
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
      template: `
        <QueryPreviewList v-bind="$attrs" #default="{ query, results }">
          {{ query }} - {{results[0].name}}
        </QueryPreviewList>`,
      queries: ['noResults', 'shoes'],
      results: { noResults: [], shoes: [createResultStub('Crazy shoes')] }
    });

    // noResults query preview
    let queryPreviews = getQueryPreviewItemWrappers();
    expect(queryPreviews.wrappers).toHaveLength(1);
    expect(queryPreviews.at(0).text()).toEqual(''); // Query preview still is loading

    // Jeans query preview
    await reRender();
    queryPreviews = getQueryPreviewItemWrappers();
    expect(queryPreviews.wrappers).toHaveLength(1);
    expect(queryPreviews.at(0).text()).toEqual('');

    await reRender();
    queryPreviews = getQueryPreviewItemWrappers();
    expect(queryPreviews.wrappers).toHaveLength(1);
    expect(queryPreviews.at(0).text()).toEqual('jeans - Sick jeans');
  });
  // TODO When error handling is added this component should exclude also queries that failed.
});

interface RenderQueryPreviewListOptions {
  template?: string;
  queries?: string[];
  results?: Record<string, Result[]>;
}

interface RenderQueryPreviewListApi {
  wrapper: Wrapper<Vue>;
  getQueryPreviewItemWrappers: () => WrapperArray<Vue>;

  reRender: () => Promise<void>;
}
