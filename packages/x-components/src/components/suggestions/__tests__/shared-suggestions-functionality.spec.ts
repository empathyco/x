import { Suggestion } from '@empathyco/x-types';
import { mount, Wrapper, createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { DeepPartial } from '@empathyco/x-utils';
import { VueConstructor } from 'vue';
import { deepMerge } from '@empathyco/x-deep-merge';
import {
  createPopularSearch,
  getPopularSearchesStub
} from '../../../__stubs__/popular-searches-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import BaseSuggestions from '../base-suggestions.vue';
import { createSimpleFacetStub } from '../../../__stubs__/facets-stubs.factory';
import { RootXStoreState } from '../../../store/store.types';
// eslint-disable-next-line max-len
import QuerySuggestions from '../../../x-modules/query-suggestions/components/query-suggestions.vue';
import PopularSearches from '../../../x-modules/popular-searches/components/popular-searches.vue';
import { querySuggestionsXStoreModule } from '../../../x-modules/query-suggestions/store/module';
import { popularSearchesXStoreModule } from '../../../x-modules/popular-searches/store/module';

const localVue = createLocalVue();
localVue.use(Vuex);

const store = new Store<DeepPartial<RootXStoreState>>({});
installNewXPlugin({ store }, localVue);

function renderListComponent({
  component,
  defaultSlot,
  // BaseSuggestions has a default slot, the rest of the components have a suggestion slot.
  template = `<ListComponent v-bind="$attrs">
      <template #suggestion="{ suggestion, index, filter }">
        ${defaultSlot ?? ''}
      </template>
      <template #default="{ suggestion, index, filter }">
        ${defaultSlot ?? ''}
      </template>
    </ListComponent>`,
  suggestions = getPopularSearchesStub(),
  showFacets = false,
  showPlainSuggestion = false
}: BaseSuggestionsOptions): BaseSuggestionsAPI {
  store.replaceState({
    x: {
      querySuggestions: deepMerge({}, querySuggestionsXStoreModule.state(), {
        suggestions
      }),
      popularSearches: deepMerge({}, popularSearchesXStoreModule.state(), {
        popularSearches: suggestions
      })
    }
  });

  const wrapper = mount(
    {
      template,
      components: {
        ListComponent: component
      }
    },
    {
      localVue,
      store,
      propsData: { showFacets, showPlainSuggestion, suggestions }
    }
  );

  return {
    wrapper: wrapper.findComponent(BaseSuggestions),
    suggestions,
    getSuggestionsWrappers() {
      return wrapper.findAll(getDataTestSelector('suggestion-item')).wrappers;
    }
  };
}

const listComponents = [BaseSuggestions, QuerySuggestions, PopularSearches];

describe.each(listComponents)('shared list suggestions functionalities', component => {
  it(`${component.name} renders the suggestions`, () => {
    const { wrapper, suggestions, getSuggestionsWrappers } = renderListComponent({ component });

    expect(getSuggestionsWrappers()).toHaveLength(suggestions.length);
    // Expect generated keys to be unique
    const listItemKeys = new Set((wrapper.vm as any).suggestionsKeys);
    expect(listItemKeys.size).toEqual(suggestions.length);
  });

  it(`${component.name} renders the content passed to the default slot`, () => {
    const { suggestions, getSuggestionsWrappers } = renderListComponent({
      component,
      defaultSlot: '<span>{{ index }} - {{ suggestion.query}}</span>'
    });
    getSuggestionsWrappers().forEach((suggestionItemWrapper, index) =>
      expect(suggestionItemWrapper.text()).toEqual(`${index} - ${suggestions[index].query}`)
    );
  });

  it(// eslint-disable-next-line max-len
  `${component.name} renders at most the number of suggestions defined by 'maxItemsToRender' prop, including those with facets`, async () => {
    const { wrapper, getSuggestionsWrappers } = renderListComponent({
      component,
      defaultSlot: `<span>{{suggestion.query}}{{filter ?  ' - ' + filter.label : ''}}</span>`,
      showFacets: true,
      showPlainSuggestion: true,
      suggestions: [
        createPopularSearch('t-shirt', {
          facets: [
            createSimpleFacetStub('category', createFilter => [
              createFilter('man'),
              createFilter('woman')
            ])
          ]
        }),
        createPopularSearch('jeans')
      ]
    });

    const suggestionsWrappers = getSuggestionsWrappers();
    expect(suggestionsWrappers).toHaveLength(4);
    expect(suggestionsWrappers[0].text()).toEqual('t-shirt');
    expect(suggestionsWrappers[1].text()).toEqual('t-shirt - man');
    expect(suggestionsWrappers[2].text()).toEqual('t-shirt - woman');
    expect(suggestionsWrappers[3].text()).toEqual('jeans');

    await wrapper.setProps({ maxItemsToRender: 2 });
    const updatedSuggestionsWrappers = getSuggestionsWrappers();
    expect(updatedSuggestionsWrappers).toHaveLength(2);
    expect(updatedSuggestionsWrappers[0].text()).toEqual('t-shirt');
    expect(updatedSuggestionsWrappers[1].text()).toEqual('t-shirt - man');

    await wrapper.setProps({ maxItemsToRender: 0 });
    expect(getSuggestionsWrappers()).toHaveLength(0);
  });

  it(`${component.name} renders suggestions without facets when 'showFacets' is false`, () => {
    const suggestions = [
      createPopularSearch('t-shirt', {
        facets: [
          createSimpleFacetStub('category', createFilter => [
            createFilter('woman'),
            createFilter('man')
          ])
        ]
      }),
      createPopularSearch('jeans', {
        facets: [
          createSimpleFacetStub('category', createFilter => [
            createFilter('kids'),
            createFilter('adults')
          ])
        ]
      })
    ];

    const { getSuggestionsWrappers } = renderListComponent({
      component,
      defaultSlot: "<span>{{ suggestion.query }} {{ filter?.label ?? '' }}</span>",
      suggestions
    });
    const suggestionsWrappers = getSuggestionsWrappers();

    expect(suggestionsWrappers).toHaveLength(2);
    suggestionsWrappers.forEach((suggestionWrapper, index) => {
      expect(suggestionWrapper.text()).toBe(suggestions[index].query);
    });
  });

  // eslint-disable-next-line max-len
  it(`${component.name} renders the plain suggestion when 'showFacets' and 'showPlainSuggestion' are set to true`, () => {
    const { getSuggestionsWrappers } = renderListComponent({
      component,
      defaultSlot: `<span>{{suggestion.query}}{{filter ?  ' - ' + filter.label : ''}}</span>`,
      showFacets: true,
      showPlainSuggestion: true,
      suggestions: [
        createPopularSearch('t-shirt', {
          facets: [
            createSimpleFacetStub('category', createFilter => [
              createFilter('man'),
              createFilter('woman')
            ])
          ]
        }),
        createPopularSearch('jeans', {
          facets: [
            createSimpleFacetStub('category', createFilter => [
              createFilter('kids'),
              createFilter('adults')
            ])
          ]
        })
      ]
    });

    const suggestionsWrappers = getSuggestionsWrappers();
    expect(suggestionsWrappers).toHaveLength(6);
    expect(suggestionsWrappers[0].text()).toEqual('t-shirt');
    expect(suggestionsWrappers[1].text()).toEqual('t-shirt - man');
    expect(suggestionsWrappers[2].text()).toEqual('t-shirt - woman');
    expect(suggestionsWrappers[3].text()).toEqual('jeans');
    expect(suggestionsWrappers[4].text()).toEqual('jeans - kids');
    expect(suggestionsWrappers[5].text()).toEqual('jeans - adults');
  });
});

/**
 * The options for the `renderListComponent` function.
 */
interface BaseSuggestionsOptions {
  /** Default slot content. */
  defaultSlot?: string;
  /** Component template to render. */
  template?: string;
  /** List component to render. */
  component: VueConstructor;
  /** List of suggestions to render. */
  suggestions?: Suggestion[];
  /** Flag to indicate if facets should be rendered. */
  showFacets?: boolean;
  /** Flag to indicate if a suggestion with filters should be rendered. */
  showPlainSuggestion?: boolean;
}

/**
 * Test API for the {@link BaseSuggestions} component.
 */
interface BaseSuggestionsAPI {
  /** The wrapper for base suggestions component. */
  wrapper: Wrapper<Vue>;
  /** The rendered suggestions. */
  suggestions: Suggestion[];
  /** The wrappers of the rendered suggestions. */
  getSuggestionsWrappers: () => Wrapper<Vue>[];
}
