import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { Suggestion } from '@empathyco/x-types';
import { createQuerySuggestion } from '../../../../__stubs__/query-suggestions-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { WireMetadata } from '../../../../wiring/wiring.types';
import QuerySuggestion from '../query-suggestion.vue';
import { createFacetWithAFilter } from '../../../../__stubs__/base-suggestion-stubs.factory';
import { resetXQuerySuggestionsStateWith } from './utils';

const localVue = createLocalVue();
localVue.use(Vuex);

const store = new Store<DeepPartial<RootXStoreState>>({});
installNewXPlugin({ store }, localVue);

function renderQuerySuggestion({
  suggestion = createQuerySuggestion('baileys'),
  query = ''
}: QuerySuggestionOptions = {}): QuerySuggestionAPI {
  resetXQuerySuggestionsStateWith(store, { query });

  const wrapper = mount(QuerySuggestion, {
    localVue,
    store,
    propsData: { suggestion }
  });

  return {
    wrapper,
    suggestion
  };
}

describe('testing query-suggestion component', () => {
  it('is an XComponent', () => {
    const { wrapper } = renderQuerySuggestion();
    expect(isXComponent(wrapper.vm)).toEqual(true);
  });

  it('has QuerySuggestionModule as XModule', () => {
    const { wrapper } = renderQuerySuggestion();
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('querySuggestions');
  });

  // TODO: Refactor state to normalized query getter
  it('highlights the suggestion matching parts with the state query', () => {
    const { wrapper } = renderQuerySuggestion({ query: 'Bá' });

    expect(wrapper.classes()).toContain('x-suggestion--matching');
  });

  it('renders the suggestion received as prop', () => {
    const { wrapper } = renderQuerySuggestion({ suggestion: createQuerySuggestion('baileys') });
    expect(wrapper.text()).toContain('baileys');
  });

  it('shows the suggestion filter', () => {
    const suggestion = createQuerySuggestion('baileys', {
      facets: createFacetWithAFilter('FILTER')
    });
    const { wrapper } = renderQuerySuggestion({ suggestion });
    expect(wrapper.element.textContent).toBe(`baileys FILTER`);
  });

  it('emits UserSelectedAQuerySuggestion event on click', async () => {
    const listener = jest.fn();
    const { wrapper, suggestion } = renderQuerySuggestion();
    const button = wrapper.find(getDataTestSelector('query-suggestion')).element;
    wrapper.vm.$x.on('UserSelectedAQuerySuggestion', true).subscribe(listener);
    await wrapper.trigger('click');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({
      eventPayload: suggestion,
      metadata: expect.objectContaining<Partial<WireMetadata>>({
        moduleName: 'querySuggestions',
        target: button,
        feature: 'query_suggestion'
      })
    });
  });
});

/**
 * The options to render the {@link QuerySuggestion} component.
 */
interface QuerySuggestionOptions {
  /** The suggestion (Query Suggestion) to be rendered. */
  suggestion?: Suggestion;
  /** The searched query. */
  query?: string;
}

/**
 * Test API for the {@link QuerySuggestion} component.
 */
interface QuerySuggestionAPI {
  /** The wrapper for query suggestion component. */
  wrapper: Wrapper<Vue>;
  suggestion: Suggestion;
}
