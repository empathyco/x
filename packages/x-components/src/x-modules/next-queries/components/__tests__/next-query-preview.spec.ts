import { mount, Wrapper, createLocalVue, WrapperArray } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { DeepPartial } from '@empathyco/x-utils';
import { NextQuery, PreviewResults } from '@empathyco/x-types';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import NextQueryPreview from '../next-query-preview.vue';
import { RootXStoreState } from '../../../../store/store.types';
import {
  findTestDataById,
  getDataTestSelector,
  installNewXPlugin
} from '../../../../__tests__/utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { nextQueriesXModule } from '../../x-module';
import { XEvent } from '../../../../wiring/events.types';
import { createNextQueryStub, getResultsStub } from '../../../../__stubs__/index';
import { resetXNextQueriesStateWith } from './utils';

describe('next query preview', () => {
  function renderNextQueryPreview({
    maxItemsToRender,
    suggestion = createNextQueryStub('milk'),
    template = `<NextQueryPreview :maxItemsToRender="maxItemsToRender" :suggestion="suggestion" />`,
    resultsPreview = {
      query: suggestion.query,
      items: getResultsStub(4),
      totalResults: 100
    },
    eventToSpy
  }: RenderNextQueryPreviewOptions = {}): RenderNextQueryPreviewAPI {
    const localVue = createLocalVue();
    localVue.use(Vuex);

    const store = new Store<DeepPartial<RootXStoreState>>({});
    installNewXPlugin({ store }, localVue);
    XPlugin.registerXModule(nextQueriesXModule);

    if (resultsPreview) {
      resetXNextQueriesStateWith(store, {
        resultsPreview: {
          [suggestion.query]: resultsPreview
        }
      });
    }

    let eventSpy;
    if (eventToSpy) {
      eventSpy = jest.fn();
      XPlugin.bus.on(eventToSpy).subscribe(eventSpy);
    }

    const wrapper = mount(
      {
        props: ['maxItemsToRender', 'suggestion'],
        components: { NextQueryPreview },
        template
      },
      {
        localVue,
        store,
        propsData: {
          maxItemsToRender,
          suggestion
        }
      }
    ).findComponent(NextQueryPreview);

    return {
      wrapper,
      eventSpy,
      suggestion,
      resultsPreview,
      findTestDataById: findTestDataById.bind(undefined, wrapper)
    };
  }

  it('is an XComponent', () => {
    const { wrapper } = renderNextQueryPreview();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toBe('nextQueries');
  });

  it('sends the next query preview mounted event', () => {
    const { eventSpy, suggestion } = renderNextQueryPreview({
      eventToSpy: 'NextQueryPreviewMounted'
    });
    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenCalledWith(suggestion.query);
  });

  it('renders the results names in the default slot', () => {
    const { resultsPreview, findTestDataById } = renderNextQueryPreview();

    const wrappers = findTestDataById('result-name');

    resultsPreview!.items.forEach((result, index) => {
      expect(wrappers.at(index).element).toHaveTextContent(result.name!);
    });
  });

  it('renders the specified number of items', () => {
    const maxItemsToRender = 2;
    const { findTestDataById } = renderNextQueryPreview({
      maxItemsToRender
    });

    expect(findTestDataById('result-name')).toHaveLength(maxItemsToRender);
  });

  it('exposes the suggestion, the results and the totalResults in the default slot', () => {
    const template = `
      <NextQueryPreview
          :suggestion="suggestion"
          #default="{ results, suggestion: slotSuggestion, totalResults}">
        <span data-test="next-query-query">{{slotSuggestion.query}}</span>
        <span data-test="total-results">{{ totalResults }}</span>
        <div v-for="result in results" :key="result.id">
          <span data-test="result-name">{{result.name}}</span>
        </div>
      </NextQueryPreview>`;

    const { suggestion, wrapper, resultsPreview, findTestDataById } = renderNextQueryPreview({
      template
    });

    expect(wrapper.find(getDataTestSelector('next-query-query')).element).toHaveTextContent(
      suggestion.query
    );
    expect(wrapper.find(getDataTestSelector('total-results')).element).toHaveTextContent(
      resultsPreview!.totalResults.toString()
    );

    const resultsWrappers = findTestDataById('result-name');

    resultsPreview!.items.forEach((result, index) => {
      expect(resultsWrappers.at(index).element).toHaveTextContent(result.name!);
    });
  });

  it('allows changing the result content', () => {
    const template = `
      <NextQueryPreview :suggestion="suggestion" #result="{ result }">
        <span data-test="result-content">{{result.id}} - {{result.name}}</span>
      </NextQueryPreview>
    `;
    const { findTestDataById, resultsPreview } = renderNextQueryPreview({ template });

    const resultsWrapper = findTestDataById('result-content');

    resultsPreview!.items.forEach((result, index) => {
      expect(resultsWrapper.at(index).element).toHaveTextContent(`${result.id} - ${result.name!}`);
    });
  });

  it('wont render if there are no results', () => {
    const { wrapper } = renderNextQueryPreview({
      resultsPreview: null
    });

    expect(wrapper.find(getDataTestSelector('next-query-preview')).element).toBeFalsy();
  });
});

interface RenderNextQueryPreviewOptions {
  /** The maximum number of items to render. */
  maxItemsToRender?: number;
  /** The initial next query to render. */
  suggestion?: NextQuery;
  /**
   * An event to spy on.
   * This prop is convenient because the spy is created before mounting the component.
   */
  eventToSpy?: XEvent;
  /** The results preview of the next query search request. */
  resultsPreview?: PreviewResults | null;
  /**
   * The template to render. Receives `suggestion` via prop, and has registered the
   * {@link NextQueryPreview} component.
   */
  template?: string;
}

interface RenderNextQueryPreviewAPI {
  /** The Vue testing utils wrapper for the {@link NextQueryPreview} component. */
  wrapper: Wrapper<Vue>;
  /** A Jest spy set in the {@link XPlugin} `on` function. */
  eventSpy?: jest.Mock<any, any>;
  /** The rendered next query. */
  suggestion: NextQuery;
  /** The results preview of the next query search request. */
  resultsPreview: PreviewResults | null;
  /** Find test data in the wrapper for the {@link NextQueryPreview} component. */
  findTestDataById: (testDataId: string) => WrapperArray<Vue>;
}
