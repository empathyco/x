import { Suggestion } from '@empathyco/x-types';
import { mount, WrapperArray, Wrapper } from '@vue/test-utils';
import { getPopularSearchesStub } from '../../../__stubs__/popular-searches-stubs.factory';
import { getDataTestSelector } from '../../../__tests__/utils';
import BaseSuggestions from '../base-suggestions.vue';

describe('testing Base Suggestions component', () => {
  const suggestions = getPopularSearchesStub();

  it('renders a list of suggestions passed as props', () => {
    const wrapper = mount(BaseSuggestions, {
      propsData: { suggestions }
    });

    expect(wrapper.findAll('li')).toHaveLength(suggestions.length);
    // Expect generated keys to be unique
    const listItemKeys = new Set((wrapper.vm as any).suggestionsKeys);
    expect(listItemKeys.size).toEqual(suggestions.length);
  });

  it('has a default scoped slot to render each suggestion', () => {
    const wrapper = mount(BaseSuggestions, {
      propsData: { suggestions },
      scopedSlots: {
        default({ suggestion, index }: { suggestion: Suggestion; index: number }) {
          return `${index} - ${suggestion.query}`;
        }
      }
    });

    const liWrappers = wrapper.findAll('li');
    suggestions.forEach((suggestion, index) =>
      expect(liWrappers.at(index).element.textContent).toEqual(`${index} - ${suggestion.query}`)
    );
  });

  it('renders at most the number of suggestions defined by `maxItemsToRender` prop', async () => {
    const wrapper = mount(BaseSuggestions, {
      propsData: { suggestions }
    });
    const renderedSuggestions = (): WrapperArray<Vue> =>
      findTestDataById(wrapper, 'suggestion-item');

    expect(renderedSuggestions()).toHaveLength(suggestions.length);

    await wrapper.setProps({ maxItemsToRender: suggestions.length - 1 });
    expect(renderedSuggestions()).toHaveLength(suggestions.length - 1);

    await wrapper.setProps({ maxItemsToRender: suggestions.length });
    expect(renderedSuggestions()).toHaveLength(suggestions.length);

    await wrapper.setProps({ maxItemsToRender: suggestions.length + 1 });
    expect(renderedSuggestions()).toHaveLength(suggestions.length);
  });

  function findTestDataById(wrapper: Wrapper<Vue>, testDataId: string): WrapperArray<Vue> {
    return wrapper.findAll(getDataTestSelector(testDataId));
  }
});
