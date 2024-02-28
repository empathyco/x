import { mount, Wrapper } from '@vue/test-utils';
import Vue, { ComponentOptions } from 'vue';
import { Result } from '@empathyco/x-types';
import { getDataTestSelector } from '../../__tests__/utils';
import PageLoaderButton from '../page-loader-button.vue';
import { getResultsStub } from '../../__stubs__/index';

function renderPageLoaderButton({
  scopedSlots,
  query = 'dress',
  results = getResultsStub(48),
  totalResults = results.length
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
    slots: scopedSlots
  });

  return {
    wrapper
  };
}

describe('testing PageLoaderButton component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a page loader button component with the passed slots', () => {
    const { wrapper } = renderPageLoaderButton({
      scopedSlots: {
        renderedCount: `<template #renderedCount></template>`,
        buttonContent: `<template #buttonContent>Load more results</template>`
      }
    });

    expect(wrapper.find(getDataTestSelector('page-loader')).exists()).toBe(true);
    expect(wrapper.find(getDataTestSelector('results-count')).exists()).toBe(true);
    expect(wrapper.find(getDataTestSelector('event-button')).exists()).toBe(true);
  });

  it('only renders the buttonContent slot with its default content if any slot is passed', () => {
    const { wrapper } = renderPageLoaderButton();

    expect(wrapper.find(getDataTestSelector('results-count')).exists()).toBe(false);
    expect(wrapper.find(getDataTestSelector('event-button')).exists()).toBe(true);
    expect(wrapper.find(getDataTestSelector('event-button')).text().trim()).toBe('Load');
  });

  it('renders a base event button with custom button classes if passed as props', async () => {
    const { wrapper } = renderPageLoaderButton();

    wrapper.setProps({ buttonClasses: 'x-rounded-full' });
    await wrapper.vm.$nextTick();

    expect(wrapper.find(getDataTestSelector('event-button')).exists()).toBe(true);
    expect(wrapper.find('.x-rounded-full').exists()).toBe(true);
  });

  // eslint-disable-next-line jest/no-commented-out-tests
  // it('emits the event UserReachedResultsListEnd when the button is clicked', async () => {});

  // eslint-disable-next-line jest/no-commented-out-tests
  // it('does not render the button if there are no more results to be rendered', async () => {});
});

/**
 * Options to configure how the page loader button component should be rendered.
 */
interface RenderPageLoaderButtonOptions {
  /** Scoped slots to be passed to the mount function. */
  scopedSlots?: Record<string, string>;
  /** The `query` used to perform a search. */
  query?: string;
  /** The `results` used to be rendered. */
  results?: Result[];
  /** The total number of results. */
  totalResults?: number;
}

/**
 * Options to configure how the page loader button component should be rendered.
 */
interface RenderPageLoaderButtonAPI {
  /** The wrapper for the page loader button component. */
  wrapper: Wrapper<Vue>;
}
