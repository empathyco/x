import { mount } from '@vue/test-utils';
import { createPopularSearch } from '../../../../__stubs__/popular-searches-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { WireMetadata } from '../../../../wiring/wiring.types';
import PopularSearch from '../popular-search.vue';

describe('testing popular search item component', () => {
  const suggestion = createPopularSearch('beer');

  const [, localVue] = installNewXPlugin();

  const popularSearchWrapper = mount(PopularSearch, { localVue, propsData: { suggestion } });

  it('is an XComponent', () => {
    expect(isXComponent(popularSearchWrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(popularSearchWrapper.vm)).toBe('popularSearches');
  });

  it('emits UserSelectedAPopularSearch when a popular search is selected', async () => {
    const listener = jest.fn();
    popularSearchWrapper.vm.$x.on('UserSelectedAPopularSearch', true).subscribe(listener);

    await popularSearchWrapper.trigger('click');

    expect(listener).toHaveBeenCalled();
    expect(listener).toHaveBeenCalledWith({
      eventPayload: suggestion,
      metadata: expect.objectContaining<Partial<WireMetadata>>({
        moduleName: 'popularSearches',
        target: popularSearchWrapper.element,
        feature: 'popular_search'
      })
    });
  });

  it('renders a button with the query of the popular search (suggestion)', () => {
    expect(popularSearchWrapper.find('span').element).toBeFalsy();
    expect(popularSearchWrapper.element.innerHTML).toEqual(suggestion.query);
  });

  it('renders a button overriding the default content', () => {
    const wrapperComponent = {
      template: `
        <PopularSearch :suggestion="suggestion">
          <template #default="{ suggestion }">
            <svg data-test="icon" height="10" width="10">
              <circle cx="5" cy="5" r="4" stroke="black"/>
            </svg>
            <span data-test="query" :aria-label="suggestion.query">{{ suggestion.query }}</span>
          </template>
        </PopularSearch>
      `,
      props: ['suggestion'],
      components: {
        PopularSearch
      }
    };

    const popularSearchWrapper = mount(wrapperComponent, {
      localVue,
      propsData: { suggestion }
    });

    expect(popularSearchWrapper.find(getDataTestSelector('popular-search')).element).toBeTruthy();
    expect(popularSearchWrapper.find(getDataTestSelector('icon')).element).toBeTruthy();
    expect(popularSearchWrapper.find(getDataTestSelector('query')).element.textContent).toEqual(
      suggestion.query
    );
  });
});
