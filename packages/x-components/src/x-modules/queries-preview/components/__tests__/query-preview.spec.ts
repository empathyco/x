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
    debounceTimeMs,
    template = `<QueryPreview v-bind="$attrs" />`,
    queryPreview = {
      request: {
        query
      },
      results: getResultsStub(4),
      status: 'success',
      totalResults: 100
    }
  }: RenderQueryPreviewOptions = {}): RenderQueryPreviewAPI {
    const localVue = createLocalVue();
    localVue.use(Vuex);

    const store = new Store<DeepPartial<RootXStoreState>>({});
    installNewXPlugin({ store }, localVue);
    XPlugin.registerXModule(queriesPreviewXModule);

    const queryPreviewRequestChangedSpy = jest.fn();
    XPlugin.bus.on('QueryPreviewRequestChanged').subscribe(queryPreviewRequestChangedSpy);

    if (queryPreview) {
      resetXQueriesPreviewStateWith(store, {
        queriesPreview: {
          [query]: queryPreview
        }
      });
    }

    const wrapper = mount(
      {
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
          queryFeature,
          debounceTimeMs
        }
      }
    ).findComponent(QueryPreview);

    return {
      wrapper,
      queryPreviewRequestChangedSpy,
      query,
      queryPreview,
      findTestDataById: findTestDataById.bind(undefined, wrapper),
      updateExtraParams: async params => {
        store.commit('x/queriesPreview/setParams', params);
        await localVue.nextTick();
      }
    };
  }

  jest.useFakeTimers();
  afterEach(() => {
    jest.runAllTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it('is an XComponent which has an XModule', () => {
    const { wrapper } = renderQueryPreview();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toBe('queriesPreview');
  });

  it('sends the `QueryPreviewRequestChanged` event', async () => {
    const { queryPreviewRequestChangedSpy, wrapper, updateExtraParams } = renderQueryPreview({
      eventToSpy: 'QueryPreviewRequestChanged'
    });

    jest.advanceTimersByTime(0); // Wait for first emission.
    expect(queryPreviewRequestChangedSpy).toHaveBeenCalledTimes(1);
    expect(queryPreviewRequestChangedSpy).toHaveBeenCalledWith({
      extraParams: {},
      origin: undefined,
      query: 'milk',
      rows: 24
    });

    await wrapper.setProps({ queryFeature: 'popular_search' });

    expect(queryPreviewRequestChangedSpy).toHaveBeenNthCalledWith(2, {
      extraParams: {},
      origin: 'popular_search:none',
      query: 'milk',
      rows: 24
    });

    await updateExtraParams({ store: 'Uganda' });

    expect(queryPreviewRequestChangedSpy).toHaveBeenNthCalledWith(3, {
      extraParams: { store: 'Uganda' },
      origin: 'popular_search:none',
      query: 'milk',
      rows: 24
    });
  });

  it('sends the `QueryPreviewRequestChanged` event with the correct location provided', () => {
    const { queryPreviewRequestChangedSpy } = renderQueryPreview({
      eventToSpy: 'QueryPreviewRequestChanged',
      location: 'predictive_layer',
      query: 'shoes',
      queryFeature: 'query_suggestion'
    });

    expect(queryPreviewRequestChangedSpy).toHaveBeenNthCalledWith(1, {
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

  describe('debounce', () => {
    it('requests immediately when debounce is set to 0', () => {
      const { queryPreviewRequestChangedSpy } = renderQueryPreview({
        debounceTimeMs: 0,
        query: 'bull'
      });

      jest.advanceTimersByTime(0);
      expect(queryPreviewRequestChangedSpy).toHaveBeenCalledTimes(1);
      expect(queryPreviewRequestChangedSpy).toHaveBeenNthCalledWith(1, {
        extraParams: {},
        query: 'bull',
        rows: 24
      });
    });

    it('does not emit subsequent requests that happen in less than the debounce time', () => {
      const { queryPreviewRequestChangedSpy } = renderQueryPreview({
        debounceTimeMs: 250,
        query: 'bull'
      });

      jest.advanceTimersByTime(249);
      expect(queryPreviewRequestChangedSpy).toHaveBeenCalledTimes(0);

      jest.advanceTimersByTime(1); // 250ms since mounting the component, the debounce tested
      expect(queryPreviewRequestChangedSpy).toHaveBeenCalledTimes(1);
      expect(queryPreviewRequestChangedSpy).toHaveBeenNthCalledWith(1, {
        extraParams: {},
        query: 'bull',
        rows: 24
      });
    });

    it('updates the debounced request reactively when the debounceTimeMs prop changes', () => {});

    it('cancels pending requests when the component is destroyed', () => {});
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
  /** Time to debounce requests.  */
  debounceTimeMs?: number;
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
  queryPreviewRequestChangedSpy?: jest.Mock<any, any>;
  /** The query for which preview its results. */
  query: string;
  /** The results preview for the passed query. */
  queryPreview: QueryPreviewItem | null;
  /** Find test data in the wrapper for the {@link QueryPreview} component. */
  findTestDataById: (testDataId: string) => WrapperArray<Vue>;
  /** Updates the extra params in the module state. */
  updateExtraParams: (params: any) => Promise<void>;
}
