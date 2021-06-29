import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial } from '../../../../utils/types';
import { getSuggestionsStub } from '../../../../__stubs__/suggestions-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import QuerySuggestions from '../query-suggestions.vue';
import { resetXQuerySuggestionsStateWith } from './utils';

describe('testing Suggestions component', () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);

  const suggestions = getSuggestionsStub('QuerySuggestion');

  const component = mount(QuerySuggestions, {
    localVue,
    store
  });

  beforeEach(() => {
    resetXQuerySuggestionsStateWith(store, {});
  });

  it('is an XComponent', () => {
    expect(isXComponent(component.vm)).toEqual(true);
  });

  it('has QuerySuggestionModule as XModule', () => {
    expect(getXComponentXModuleName(component.vm)).toEqual('querySuggestions');
  });

  it('does not render anything when suggestions are empty', () => {
    expect(component.findAll('li')).toHaveLength(0);
  });

  it('renders a list of suggestions passed as props', async () => {
    resetXQuerySuggestionsStateWith(store, { suggestions });

    await localVue.nextTick();

    expect(component.findAll('li')).toHaveLength(suggestions.length);
  });

  it('renders a custom query suggestion when overriding the suggestion slot', () => {
    resetXQuerySuggestionsStateWith(store, { suggestions });

    const suggestionSlotOverridden = {
      template: `
        <QuerySuggestions>
          <template #suggestion="suggestionContentScope">
            <img
              class="x-query-suggestion__icon"
              data-test="icon"
              src="./query-suggestion-icon.svg"
            />
            <span class="x-query-suggestion__query" :data-index="suggestionContentScope.index"
                  data-test="query">
              {{ suggestionContentScope.suggestion.query }}
            </span>
          </template>
        </QuerySuggestions>
      `,
      components: {
        QuerySuggestions
      }
    };

    const querySuggestions = mount(suggestionSlotOverridden, {
      localVue,
      store
    });

    const suggestionsItemWrappers = querySuggestions.findAll(
      getDataTestSelector('suggestion-item')
    ).wrappers;
    expect(suggestionsItemWrappers).toHaveLength(suggestions.length);

    suggestionsItemWrappers.forEach((slot, index) => {
      expect(slot.find(getDataTestSelector('icon')).element).toBeDefined();
      expect(slot.find(getDataTestSelector('query')).text()).toEqual(suggestions[index].query);
    });
  });

  it('renders custom content when overriding the suggestion-content slot', () => {
    resetXQuerySuggestionsStateWith(store, { suggestions });

    const suggestionContentSlotOverridden = {
      template: `
        <QuerySuggestions>
          <template #suggestion-content="{ suggestion, queryHTML }">
            <img
              class="x-query-suggestion__icon"
              data-test="icon"
              src="/query-suggestion-icon.svg"
            />
            <span
              :aria-label="'Select ' + suggestion.query"
              class="x-query-suggestion__query"
              data-test="query"
              v-html="queryHTML"
            />
          </template>
        </QuerySuggestions>
      `,
      components: {
        QuerySuggestions
      }
    };

    const querySuggestions = mount(suggestionContentSlotOverridden, {
      localVue,
      store
    });

    const suggestionsItemWrappers = querySuggestions.findAll(
      getDataTestSelector('query-suggestion')
    ).wrappers;
    expect(suggestionsItemWrappers).toHaveLength(suggestions.length);

    suggestionsItemWrappers.forEach((slot, index) => {
      expect(slot.find(getDataTestSelector('icon')).element).toBeDefined();
      expect(slot.find(getDataTestSelector('query')).text()).toEqual(suggestions[index].query);
    });
  });
});
