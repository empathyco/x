import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils';
import { Store } from 'vuex';
import { DeepPartial } from '@empathyco/x-utils';
import { nextTick } from 'vue';
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory';
import {
  findTestDataById,
  getDataTestSelector,
  installNewXPlugin
} from '../../../../__tests__/utils';
import { XComponentsAdapterDummy } from '../../../../__tests__/adapter.dummy';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { XPlugin } from '../../../../plugins/x-plugin';
import { QueryPreviewInfo, QueryPreviewItem } from '../../store/types';
import { queriesPreviewXModule } from '../../x-module';
import QueryPreview from '../query-preview.vue';
import { getEmptySearchResponseStub } from '../../../../__stubs__/index';
import { getHashFromQueryPreviewInfo } from '../../utils/get-hash-from-query-preview';
import { resetXQueriesPreviewStateWith } from './utils';

function renderQueryPreview({
  maxItemsToRender,
  queryPreviewInfo = { query: 'milk' },
  location,
  queryFeature,
  persistInCache = false,
  debounceTimeMs = 0,
  template = `<QueryPreview v-bind="$attrs" />`,
  queryPreviewInState = {
    request: {
      query: queryPreviewInfo.query
    },
    results: getResultsStub(4),
    status: 'success',
    instances: 1,
    totalResults: 100
  }
}: RenderQueryPreviewOptions = {}): RenderQueryPreviewAPI {
  const store = new Store<DeepPartial<RootXStoreState>>({});
  XPlugin.registerXModule(queriesPreviewXModule);

  const queryPreviewRequestUpdatedSpy = jest.fn();
  XPlugin.bus.on('QueryPreviewRequestUpdated').subscribe(queryPreviewRequestUpdatedSpy);

  const queryPreviewUnmounted = jest.fn();
  XPlugin.bus.on('QueryPreviewUnmounted').subscribe(queryPreviewUnmounted);

  if (queryPreviewInState) {
    resetXQueriesPreviewStateWith(store, {
      queriesPreview: {
        [getHashFromQueryPreviewInfo(queryPreviewInfo)]: queryPreviewInState
      }
    });
  }

  const wrapper: VueWrapper = mount(
    {
      components: { QueryPreview },
      template
    },
    {
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [queriesPreviewXModule] })],
        provide: {
          location
        }
      },
      store,
      props: {
        maxItemsToRender,
        queryPreviewInfo,
        queryFeature,
        debounceTimeMs,
        persistInCache
      }
    }
  ).findComponent(QueryPreview);

  return {
    wrapper,
    queryPreviewRequestUpdatedSpy,
    queryPreviewUnmounted,
    queryPreviewInfo,
    queryPreviewInState,
    updateExtraParams: async params => {
      store.commit('x/queriesPreview/setParams', params);
      await nextTick();
    },
    reRender: () => new Promise(resolve => setTimeout(resolve))
  };
}

describe('query preview', () => {
  jest.useFakeTimers();
  afterEach(() => {
    jest.runAllTimers();
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it('is an XComponent which has an XModule', () => {
    const { wrapper } = renderQueryPreview();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toBe('queriesPreview');
  });

  // eslint-disable-next-line max-len
  it('does not send the `QueryPreviewRequestUpdated` event if persistInCache is true, but emits load', () => {
    const { queryPreviewRequestUpdatedSpy, wrapper, queryPreviewInfo } = renderQueryPreview({
      persistInCache: true,
      queryPreviewInfo: {
        query: 'shoes',
        extraParams: { directory: 'Magrathea' },
        filters: ['fit:regular']
      }
    });
    const query = getHashFromQueryPreviewInfo(queryPreviewInfo);

    jest.advanceTimersByTime(0); // Wait for first emission.
    expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(0);
    expect(wrapper.emitted('load')?.length).toBe(1);
    expect(wrapper.emitted('load')?.[0]).toEqual([query]);
  });

  it('emits `QueryPreviewUnmounted` when the component is being unmounted', () => {
    const { queryPreviewUnmounted, wrapper } = renderQueryPreview({
      persistInCache: false,
      queryPreviewInfo: {
        query: 'shoes',
        extraParams: { directory: 'Magrathea' },
        filters: ['fit:regular']
      }
    });

    jest.advanceTimersByTime(0); // Wait for first emission
    wrapper.unmount();
    expect(queryPreviewUnmounted).toHaveBeenCalledTimes(1);

    const { queryPreviewUnmounted: unmountedEvent, wrapper: newWrapper } = renderQueryPreview({
      persistInCache: true,
      queryPreviewInfo: {
        query: 'shoes',
        extraParams: { directory: 'Magrathea' },
        filters: ['fit:regular']
      }
    });

    jest.advanceTimersByTime(0); // Wait for first emission
    newWrapper.unmount();
    expect(unmountedEvent).toHaveBeenCalledTimes(1);
  });

  it('sends the `QueryPreviewRequestUpdated` event', async () => {
    const { queryPreviewRequestUpdatedSpy, wrapper, updateExtraParams } = renderQueryPreview({
      persistInCache: false
    });
    await wrapper.setProps({
      queryPreviewInfo: {
        query: 'shoes',
        extraParams: { directory: 'Magrathea' },
        filters: ['fit:regular']
      }
    });
    jest.advanceTimersByTime(0); // Wait for first emission.
    expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(1);
    expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledWith({
      extraParams: {
        directory: 'Magrathea'
      },
      filters: {
        fit: [
          {
            id: 'fit:regular',
            modelName: 'RawFilter',
            selected: true
          }
        ]
      },
      origin: undefined,
      query: 'shoes',
      rows: 24
    });

    // The timer is relaunched when the prop changes
    await wrapper.setProps({ queryFeature: 'popular_search' });
    // fast-forward until next timer should be executed
    jest.advanceTimersToNextTimer();

    expect(queryPreviewRequestUpdatedSpy).toHaveBeenNthCalledWith(2, {
      extraParams: {
        directory: 'Magrathea'
      },
      filters: {
        fit: [
          {
            id: 'fit:regular',
            modelName: 'RawFilter',
            selected: true
          }
        ]
      },
      origin: 'popular_search:none',
      query: 'shoes',
      rows: 24
    });

    await updateExtraParams({ store: 'Uganda' });
    jest.advanceTimersToNextTimer();

    expect(queryPreviewRequestUpdatedSpy).toHaveBeenNthCalledWith(3, {
      extraParams: {
        directory: 'Magrathea',
        store: 'Uganda'
      },
      filters: {
        fit: [
          {
            id: 'fit:regular',
            modelName: 'RawFilter',
            selected: true
          }
        ]
      },
      origin: 'popular_search:none',
      query: 'shoes',
      rows: 24
    });
  });

  // eslint-disable-next-line max-len
  it('sends the `QueryPreviewRequestUpdated` event with the correct location provided', async () => {
    const { queryPreviewRequestUpdatedSpy, wrapper } = renderQueryPreview({
      queryPreviewInfo: { query: 'shoes' },
      location: 'predictive_layer'
    });
    await wrapper.setProps({ queryFeature: 'query_suggestion' });
    jest.advanceTimersToNextTimer();
    expect(queryPreviewRequestUpdatedSpy).toHaveBeenNthCalledWith(1, {
      extraParams: {},
      filters: undefined,
      origin: 'query_suggestion:predictive_layer',
      query: 'shoes',
      rows: 24
    });
  });

  it('renders the results names in the default slot', () => {
    const { queryPreviewInState, wrapper } = renderQueryPreview();

    const wrappers: DOMWrapper<Element>[] = findTestDataById(wrapper, 'result-name');

    queryPreviewInState!.results.forEach((result, index) => {
      expect(wrappers.at(index)?.element).toHaveTextContent(result.name!);
    });
  });

  it('renders the specified number of results', () => {
    const maxItemsToRender = 2;
    const { wrapper } = renderQueryPreview({
      maxItemsToRender
    });

    expect(findTestDataById(wrapper, 'result-name')).toHaveLength(maxItemsToRender);
  });

  it('exposes the query, the results and the totalResults in the default slot', () => {
    const template = `
      <QueryPreview
          :queryPreviewInfo="$attrs.queryPreviewInfo"
          #default="{ results, queryPreviewInfo, totalResults}">
        <div>
          <span data-test="query-preview-query">{{ queryPreviewInfo.query }}</span>
          <span data-test="total-results">{{ totalResults }}</span>
          <div v-for="result in results" :key="result.id">
            <span data-test="result-name">{{result.name}}</span>
          </div>
        </div>
      </QueryPreview>`;

    const { queryPreviewInfo, wrapper, queryPreviewInState } = renderQueryPreview({
      template
    });

    expect(wrapper.find(getDataTestSelector('query-preview-query')).element).toHaveTextContent(
      queryPreviewInfo.query
    );
    expect(wrapper.find(getDataTestSelector('total-results')).element).toHaveTextContent(
      queryPreviewInState!.totalResults.toString()
    );

    const resultsWrappers = findTestDataById(wrapper, 'result-name');

    queryPreviewInState!.results.forEach((result, index) => {
      expect(resultsWrappers.at(index)?.element).toHaveTextContent(result.name!);
    });
  });

  it('allows changing the result content', () => {
    const template = `
      <QueryPreview :queryPreviewInfo="$attrs.queryPreviewInfo" #result="{ result }">
        <span data-test="result-content">{{result.id}} - {{result.name}}</span>
      </QueryPreview>
    `;
    const { wrapper, queryPreviewInState } = renderQueryPreview({ template });

    const resultsWrapper = findTestDataById(wrapper, 'result-content');

    queryPreviewInState!.results.forEach((result, index) => {
      expect(resultsWrapper.at(index)?.element).toHaveTextContent(`${result.id} - ${result.name!}`);
    });
  });

  it('wont render if there are no results', () => {
    const { wrapper } = renderQueryPreview({
      queryPreviewInState: {
        request: {
          query: 'milk'
        },
        results: [],
        status: 'initial',
        totalResults: 0,
        instances: 1
      }
    });

    expect(wrapper.html()).toEqual('');
  });

  it('emits load event on success', async () => {
    jest.useRealTimers();

    const { wrapper, reRender, queryPreviewInfo } = renderQueryPreview();

    (XComponentsAdapterDummy.search as jest.Mock).mockResolvedValueOnce({
      ...getEmptySearchResponseStub(),
      results: getResultsStub(1),
      totalResults: 1
    });

    const query = getHashFromQueryPreviewInfo(queryPreviewInfo);

    await reRender();

    expect(wrapper.emitted('load')?.length).toBe(1);
    expect(wrapper.emitted('load')?.[0]).toEqual([query]);
    expect(wrapper.emitted('error')).toBeUndefined();

    jest.useFakeTimers();
  });

  it('emits error event on success if results are empty', async () => {
    jest.useRealTimers();
    const { wrapper, reRender, queryPreviewInfo } = renderQueryPreview({
      queryPreviewInState: {
        request: {
          query: 'milk'
        },
        results: [],
        status: 'initial',
        totalResults: 0,
        instances: 1
      }
    });

    const query = getHashFromQueryPreviewInfo(queryPreviewInfo);

    await reRender();

    expect(wrapper.emitted('error')?.length).toBe(1);
    expect(wrapper.emitted('error')?.[0]).toEqual([query]);
    expect(wrapper.emitted('load')).toBeUndefined();

    jest.useFakeTimers();
  });

  it('emits error event on error', async () => {
    jest.useRealTimers();
    (XComponentsAdapterDummy.search as jest.Mock).mockRejectedValueOnce('Some error');

    const { wrapper, reRender } = renderQueryPreview({
      queryPreviewInState: null
    });

    const query = getHashFromQueryPreviewInfo({ query: 'milk' });

    await reRender();

    expect(wrapper.emitted('error')?.length).toBe(1);
    expect(wrapper.emitted('error')?.[0]).toEqual([query]);
    expect(wrapper.emitted('load')).toBeUndefined();
    jest.useFakeTimers();
  });

  describe('debounce', () => {
    it('requests immediately when debounce is set to 0', async () => {
      const { queryPreviewRequestUpdatedSpy, wrapper } = renderQueryPreview({
        debounceTimeMs: 0
      });
      await wrapper.setProps({ queryPreviewInfo: { query: 'bull' } });
      jest.advanceTimersByTime(0);
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(1);
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenNthCalledWith(1, {
        extraParams: {},
        query: 'bull',
        rows: 24
      });
    });

    it('does not emit subsequent requests that happen in less than the debounce time', async () => {
      const { wrapper, queryPreviewRequestUpdatedSpy } = renderQueryPreview({
        debounceTimeMs: 250
      });
      await wrapper.setProps({ queryPreviewInfo: { query: 'bull' } });
      jest.advanceTimersByTime(249);
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(0);

      jest.advanceTimersByTime(1); // 250ms since mounting the component, the debounce tested
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(1);
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenNthCalledWith(1, {
        extraParams: {},
        query: 'bull',
        rows: 24
      });

      jest.advanceTimersByTime(249);
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(1);

      // Emulates user is typing a new query
      await wrapper.setProps({ queryPreviewInfo: { query: 'secall' } }); // Timer relaunched

      jest.advanceTimersByTime(249);
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(1);

      await wrapper.setProps({ queryPreviewInfo: { query: 'secallona' } }); // Timer relaunched

      jest.advanceTimersByTime(249);
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(251);
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(2);
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenNthCalledWith(2, {
        extraParams: {},
        query: 'secallona',
        rows: 24
      });
    });

    // eslint-disable-next-line max-len
    it('updates the debounced request reactively when the debounceTimeMs prop changes', async () => {
      const { wrapper, queryPreviewRequestUpdatedSpy } = renderQueryPreview({
        debounceTimeMs: 250,
        queryPreviewInfo: { query: 'bull' }
      });

      jest.advanceTimersByTime(249);
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(0);

      // Updating the debounce time aborts previous running timers
      await wrapper.setProps({ debounceTimeMs: 100 });
      jest.advanceTimersByTime(99);
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(0);

      jest.advanceTimersByTime(1); // 100ms since mounting the component, the debounce tested
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(0);
    });

    it('cancels pending requests when the component is unmounted', () => {
      const { wrapper, queryPreviewRequestUpdatedSpy } = renderQueryPreview({
        debounceTimeMs: 250,
        queryPreviewInfo: { query: 'bull' }
      });
      jest.advanceTimersByTime(249);
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(0);

      wrapper.unmount();
      jest.advanceTimersByTime(1);
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(0);
    });
  });
});

interface RenderQueryPreviewOptions {
  /** The maximum number of results to render. */
  maxItemsToRender?: number;
  /** The query preview info for which preview its results. */
  queryPreviewInfo?: QueryPreviewInfo;
  /** Boolean to save queries preview in the cache. */
  persistInCache?: boolean;
  /** The location of the query preview in the DOM. */
  location?: string;
  /** The name of the tool that generated the query. */
  queryFeature?: string;
  /** The results preview for the passed query. */
  queryPreviewInState?: QueryPreviewItem | null;
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
  wrapper: VueWrapper;
  /** A Jest spy set in the {@link XPlugin} `on` function. */
  queryPreviewRequestUpdatedSpy?: jest.Mock;
  /** A Jest spy set in the {@link XPlugin} `on` function. */
  queryPreviewUnmounted?: jest.Mock;
  /** The query for which preview its results. */
  queryPreviewInfo: QueryPreviewInfo;
  /** The results preview for the passed query. */
  queryPreviewInState: QueryPreviewItem | null;
  /** Updates the extra params in the module state. */
  updateExtraParams: (params: any) => Promise<void>;
  /** Flushes all pending promises to cause the component to be in its final state. */
  reRender: () => Promise<void>;
}
