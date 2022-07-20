import { mount, Wrapper, createLocalVue, WrapperArray } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { DeepPartial } from '@empathyco/x-utils';
import { NextQuery, NextQueryPreviewResults } from '@empathyco/x-types';
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
    suggestion = createNextQueryStub('milk'),
    template = `<NextQueryPreview :suggestion="suggestion"/>`,
    resultsPreview = {
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
        props: ['suggestion'],
        components: { NextQueryPreview },
        template
      },
      {
        localVue,
        store,
        propsData: {
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
      expect(wrappers.at(index).element).toHaveTextContent(result.name);
    });
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
      expect(resultsWrappers.at(index).element).toHaveTextContent(result.name);
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
  suggestion?: NextQuery;
  eventToSpy?: XEvent;
  resultsPreview?: NextQueryPreviewResults | null;
  template?: string;
}

interface RenderNextQueryPreviewAPI {
  wrapper: Wrapper<Vue>;
  eventSpy?: jest.Mock<any, any>;
  suggestion: NextQuery;
  resultsPreview: NextQueryPreviewResults | null;
  findTestDataById: (testDataId: string) => WrapperArray<Vue>;
}
