import { mount, Wrapper } from '@vue/test-utils';
import { BooleanFilter, Facet, Suggestion } from '@empathyco/x-types';
import { createPopularSearch } from '../../../../__stubs__/popular-searches-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { WireMetadata } from '../../../../wiring/wiring.types';
import PopularSearch from '../popular-search.vue';
import { createFacetWithAFilter } from '../../../../__stubs__/base-suggestion-stubs.factory';

function renderPopularSearch({
  suggestion = createPopularSearch('beer'),
  facets = [],
  slotContent = ''
}: PopularSearchOptions = {}): PopularSearchAPI {
  const [, localVue] = installNewXPlugin();

  if (facets) {
    suggestion.facets = facets;
  }

  const wrapper = mount(PopularSearch, {
    localVue,
    propsData: {
      suggestion
    },
    scopedSlots: slotContent ? { default: slotContent } : {}
  });

  return {
    wrapper,
    suggestion,
    filter: facets.length ? <BooleanFilter>facets[0].filters[0] : undefined
  };
}

describe('testing popular search item component', () => {
  it('is an XComponent', () => {
    const { wrapper } = renderPopularSearch();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toBe('popularSearches');
  });

  it('emits UserSelectedAPopularSearch when a popular search is selected', async () => {
    const { wrapper, suggestion } = renderPopularSearch();
    const listener = jest.fn();
    wrapper.vm.$x.on('UserSelectedAPopularSearch', true).subscribe(listener);

    await wrapper.trigger('click');

    expect(listener).toHaveBeenCalled();
    expect(listener).toHaveBeenCalledWith({
      eventPayload: suggestion,
      metadata: expect.objectContaining<Partial<WireMetadata>>({
        moduleName: 'popularSearches',
        target: wrapper.element,
        feature: 'popular_search'
      })
    });
  });

  it('renders a button with the query of the popular search (suggestion)', () => {
    const { wrapper, suggestion } = renderPopularSearch();
    expect(wrapper.find(getDataTestSelector('popular-search')).element).toBeInstanceOf(
      HTMLButtonElement
    );
    expect(wrapper.element.innerHTML).toContain(suggestion.query);
  });

  it('shows the suggestion filter', () => {
    const { wrapper, suggestion, filter } = renderPopularSearch({
      facets: createFacetWithAFilter()
    });
    expect(wrapper.element.textContent).toBe(`${suggestion.query} ${filter!.label}`);
  });

  it('renders a button overriding the default content', () => {
    const slotContent =
      `<div>
      <svg data-test="icon" height="10" width="10">
        <circle cx="5" cy="5" r="4" stroke="black"/>
      </svg>
      <span data-test="query" :aria-label="props.suggestion.query">` +
      '{{ props.suggestion.query }} {{props.filter.label}}' +
      `</span>
      </div>`;

    const { wrapper, suggestion, filter } = renderPopularSearch({
      slotContent,
      facets: createFacetWithAFilter()
    });

    expect(wrapper.find(getDataTestSelector('popular-search')).element).toBeTruthy();
    expect(wrapper.find(getDataTestSelector('icon')).element).toBeTruthy();
    expect(wrapper.find(getDataTestSelector('query')).element.textContent).toEqual(
      `${suggestion.query} ${filter!.label}`
    );
  });
});

/**
 * The options to render the {@link PopularSearch} component.
 */
interface PopularSearchOptions {
  /** The suggestion (Popular Search) to be rendered. */
  suggestion?: Suggestion;
  /** The facets to be included in the suggestion. By default, the suggestion has not facets. */
  facets?: Facet[];
  /** The content to be rendered in the default slot. */
  slotContent?: string;
}

/**
 * Test API for the {@link PopularSearch} component.
 */
interface PopularSearchAPI {
  /** The wrapper for popular search component. */
  wrapper: Wrapper<Vue>;
  /** The rendered suggestion. */
  suggestion: Suggestion;
  /** The filter of the suggestion. */
  filter: BooleanFilter | undefined;
}
