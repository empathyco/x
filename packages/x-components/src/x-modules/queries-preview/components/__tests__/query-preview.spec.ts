import { mount, Wrapper, createLocalVue, WrapperArray } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { DeepPartial } from '@empathyco/x-utils';
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory';
import {
  findTestDataById,
  getDataTestSelector,
  installNewXPlugin
} from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { XPlugin } from '../../../../plugins/x-plugin';
import { XEvent } from '../../../../wiring/events.types';
import { QueryPreviewItem } from '../../store/types';
import { queriesPreviewXModule } from '../../x-module';
import QueryPreview from '../query-preview.vue';
import { resetXQueriesPreviewStateWith } from './utils';

describe('query preview', () => {
  function renderQueryPreview({
    maxItemsToRender,
    query = 'milk',
    location,
    queryFeature,
    template = `<QueryPreview
                  :maxItemsToRender="maxItemsToRender"
                  :query="query"
                  :queryFeature="queryFeature"
                />`,
    queryPreview = {
      request: {
        query
      },
      results: getResultsStub(4),
      status: 'success',
      totalResults: 100
    },
    eventToSpy
  }: RenderQueryPreviewOptions = {}): RenderQueryPreviewAPI {
    const localVue = createLocalVue();
    localVue.use(Vuex);

    const store = new Store<DeepPartial<RootXStoreState>>({});
    installNewXPlugin({ store }, localVue);
    XPlugin.registerXModule(queriesPreviewXModule);

    let eventSpy: jest.Mock | undefined;
    if (eventToSpy) {
      eventSpy = jest.fn();
      XPlugin.bus.on(eventToSpy).subscribe(eventSpy);
    }

    if (queryPreview) {
      resetXQueriesPreviewStateWith(store, {
        queriesPreview: {
          [query]: queryPreview
        }
      });
    }

    const wrapper = mount(
      {
        props: ['maxItemsToRender', 'query', 'queryFeature'],
        components: { QueryPreview },
        template,
        provide: {
          location
        }
      },
      {
        localVue,
        store,
        propsData: {
          maxItemsToRender,
          query,
          queryFeature
        }
      }
    ).findComponent(QueryPreview);

    return {
      wrapper,
      eventSpy,
      query,
      queryPreview,
      findTestDataById: findTestDataById.bind(undefined, wrapper),
      updateExtraParams: async params => {
        store.commit('x/queriesPreview/setParams', params);
        await localVue.nextTick();
      }
    };
  }

  it('is an XComponent which has an XModule', () => {
    const { wrapper } = renderQueryPreview();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toBe('queriesPreview');
  });

  it('sends the `QueryPreviewRequestChanged` event', async () => {
    const { eventSpy, wrapper, updateExtraParams } = renderQueryPreview({
      eventToSpy: 'QueryPreviewRequestChanged'
    });

    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenCalledWith({
      extraParams: {},
      origin: undefined,
      query: 'milk',
      rows: 24
    });

    await wrapper.setProps({ queryFeature: 'popular_search' });

    expect(eventSpy).toHaveBeenNthCalledWith(2, {
      extraParams: {},
      origin: 'popular_search:none',
      query: 'milk',
      rows: 24
    });

    await updateExtraParams({ store: 'Uganda' });

    expect(eventSpy).toHaveBeenNthCalledWith(3, {
      extraParams: { store: 'Uganda' },
      origin: 'popular_search:none',
      query: 'milk',
      rows: 24
    });
  });

  it('sends the `QueryPreviewRequestChanged` event with the correct location provided', () => {
    const { eventSpy } = renderQueryPreview({
      eventToSpy: 'QueryPreviewRequestChanged',
      location: 'predictive_layer',
      query: 'shoes',
      queryFeature: 'query_suggestion'
    });

    expect(eventSpy).toHaveBeenNthCalledWith(1, {
      extraParams: {},
      origin: 'query_suggestion:predictive_layer',
      query: 'shoes',
      rows: 24
    });
  });

  it('renders the results names in the default slot', () => {
    const { queryPreview, findTestDataById } = renderQueryPreview();

    const wrappers = findTestDataById('result-name');

    queryPreview!.results.forEach((result, index) => {
      expect(wrappers.at(index).element).toHaveTextContent(result.name!);
    });
  });

  it('renders the specified number of results', () => {
    const maxItemsToRender = 2;
    const { findTestDataById } = renderQueryPreview({
      maxItemsToRender
    });

    expect(findTestDataById('result-name')).toHaveLength(maxItemsToRender);
  });

  it('exposes the query, the results and the totalResults in the default slot', () => {
    const template = `
      <QueryPreview
          :query="query"
          #default="{ results, query, totalResults}">
        <div>
          <span data-test="query-preview-query">{{ query }}</span>
          <span data-test="total-results">{{ totalResults }}</span>
          <div v-for="result in results" :key="result.id">
            <span data-test="result-name">{{result.name}}</span>
          </div>
        </div>
      </QueryPreview>`;

    const { query, wrapper, queryPreview, findTestDataById } = renderQueryPreview({
      template
    });

    expect(wrapper.find(getDataTestSelector('query-preview-query')).element).toHaveTextContent(
      query
    );
    expect(wrapper.find(getDataTestSelector('total-results')).element).toHaveTextContent(
      queryPreview!.totalResults.toString()
    );

    const resultsWrappers = findTestDataById('result-name');

    queryPreview!.results.forEach((result, index) => {
      expect(resultsWrappers.at(index).element).toHaveTextContent(result.name!);
    });
  });

  it('allows changing the result content', () => {
    const template = `
      <QueryPreview :query="query" #result="{ result }">
        <span data-test="result-content">{{result.id}} - {{result.name}}</span>
      </QueryPreview>
    `;
    const { findTestDataById, queryPreview } = renderQueryPreview({ template });

    const resultsWrapper = findTestDataById('result-content');

    queryPreview!.results.forEach((result, index) => {
      expect(resultsWrapper.at(index).element).toHaveTextContent(`${result.id} - ${result.name!}`);
    });
  });

  it('wont render if there are no results', () => {
    const { wrapper } = renderQueryPreview({
      queryPreview: {
        request: {
          query: 'milk'
        },
        results: [],
        status: 'initial',
        totalResults: 0
      }
    });

    expect(wrapper.html()).toEqual('');
  });
});

interface RenderQueryPreviewOptions {
  /** The maximum number of results to render. */
  maxItemsToRender?: number;
  /** The query for which preview its results. */
  query?: string;
  /** The location of the query preview in the DOM. */
  location?: string;
  /** The name of the tool that generated the query. */
  queryFeature?: string;
  /**
   * An event to spy on.
   * This prop is convenient because the spy is created before mounting the component.
   */
  eventToSpy?: XEvent;
  /** The results preview for the passed query. */
  queryPreview?: QueryPreviewItem;
  /**
   * The template to render. Receives `query` via prop, and has registered the
   * {@link QueryPreview} component.
   */
  template?: string;
}

interface RenderQueryPreviewAPI {
  /** The Vue testing utils wrapper for the {@link QueryPreview} component. */
  wrapper: Wrapper<Vue>;
  /** A Jest spy set in the {@link XPlugin} `on` function. */
  eventSpy?: jest.Mock<any, any>;
  /** The query for which preview its results. */
  query: string;
  /** The results preview for the passed query. */
  queryPreview: QueryPreviewItem | null;
  /** Find test data in the wrapper for the {@link QueryPreview} component. */
  findTestDataById: (testDataId: string) => WrapperArray<Vue>;
  /** Updates the extra params in the module state. */
  updateExtraParams: (params: any) => Promise<void>;
}
