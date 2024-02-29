import { mount, Wrapper } from '@vue/test-utils';
import Vue, { ComponentOptions, nextTick } from 'vue';
import { Result } from '@empathyco/x-types';
import { getDataTestSelector } from '../../__tests__/utils';
import PageLoaderButton from '../page-loader-button.vue';
import { getResultsStub } from '../../__stubs__/index';

function renderPageLoaderButton({
  query = 'dress',
  results = getResultsStub(48),
  totalResults = 100,
  scopedSlots = {
    resultsCount: `<p class="x-text x-py-16" data-test="results-count">
        You are seeing ${results.length} of ${totalResults} results
      </p>`,
    buttonContent: `<span>Load</span>`
  }
}: RenderPageLoaderButtonOptions = {}): RenderPageLoaderButtonAPI {
  const emit = jest.fn();

  const wrapper = mount(PageLoaderButton as ComponentOptions<Vue>, {
    propsData: {
      buttonClasses: ''
    },
    mocks: {
      $x: {
        emit,
        query,
        results,
        totalResults
      }
    },
    scopedSlots
  });

  return {
    emit,
    wrapper
  };
}

describe('testing PageLoaderButton component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a page loader button component with slots', () => {
    const { wrapper } = renderPageLoaderButton();

    expect(wrapper.find(getDataTestSelector('page-loader')).exists()).toBe(true);
    expect(wrapper.find(getDataTestSelector('results-count')).exists()).toBe(true);
    expect(wrapper.find(getDataTestSelector('load-content')).exists()).toBe(true);
  });

  it('only renders the buttonContent slot with its default content if any slot is passed', () => {
    const { wrapper } = renderPageLoaderButton({ scopedSlots: { resultsCount: `` } });

    expect(wrapper.find(getDataTestSelector('results-count')).exists()).toBe(false);
    expect(wrapper.find(getDataTestSelector('load-content')).exists()).toBe(true);
    expect(wrapper.find(getDataTestSelector('load-content')).text().trim()).toBe('Load');
  });

  it('renders a base event button with custom button classes if passed as props', async () => {
    const { wrapper } = renderPageLoaderButton();

    wrapper.setProps({ buttonClasses: 'x-rounded-full' });
    await wrapper.vm.$nextTick();

    expect(wrapper.find(getDataTestSelector('load-content')).exists()).toBe(true);
    expect(wrapper.find('.x-rounded-full').exists()).toBe(true);
  });

  it('emits the event UserReachedResultsListEnd when the button is clicked', async () => {
    const { wrapper, emit } = renderPageLoaderButton();
    const baseEventButton = wrapper.find(getDataTestSelector('load-content'));

    baseEventButton.trigger('click');
    await nextTick();

    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith('UserReachedResultsListEnd', undefined, {
      target: baseEventButton.element
    });
  });

  it('does not render the button if there are no more results to be rendered', () => {
    const { wrapper } = renderPageLoaderButton({
      results: getResultsStub(24),
      totalResults: 24
    });

    expect(wrapper.find(getDataTestSelector('page-loader')).exists()).toBe(true);
    expect(wrapper.find(getDataTestSelector('results-count')).exists()).toBe(true);
    expect(wrapper.find(getDataTestSelector('load-content')).exists()).toBe(false);
  });

  it('does not render the component if a query has not been searched', () => {
    const { wrapper } = renderPageLoaderButton({
      query: ''
    });
    expect(wrapper.find(getDataTestSelector('page-loader')).exists()).toBe(false);
  });

  it('does not render the component if there are no results', () => {
    const { wrapper } = renderPageLoaderButton({
      results: getResultsStub(0)
    });

    expect(wrapper.find(getDataTestSelector('page-loader')).exists()).toBe(false);
  });
});

/**
 * Options to configure how the page loader button component should be rendered.
 */
interface RenderPageLoaderButtonOptions {
  /** The `query` used to perform a search. */
  query?: string;
  /** The `results` used to be rendered. */
  results?: Result[];
  /** The total number of results. */
  totalResults?: number;
  /** Scoped slots to be passed to the mount function. */
  scopedSlots?: Record<string, string>;
}

/**
 * Options to configure how the page loader button component should be rendered.
 */
interface RenderPageLoaderButtonAPI {
  /** Mock of the {@link XBus.emit} function. */
  emit: jest.Mock;
  /** The wrapper for the page loader button component. */
  wrapper: Wrapper<Vue>;
}
