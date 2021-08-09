import { Filter } from '@empathyco/x-types-next';
import { mount, Wrapper } from '@vue/test-utils';
import { createNextSimpleFilter } from '../../../../../__stubs__/filters-stubs.factory';
import FiltersInjectionMixin from '../filters-injection.mixin';

describe('Test filters injection mixin', () => {
  function mountComponent({
    propFilters,
    injectedFilters,
    parentId
  }: Partial<{
    propFilters: Filter[];
    injectedFilters: Filter[];
    parentId: Filter['id'];
  }> = {}): TestFilterInjectionAPI {
    const wrapper = mount(
      {
        template: `
          <ul>
          <li v-for="filter of renderedFilters" :key="filter.id">{{ filter.id }}</li>
          </ul>
        `,
        mixins: [FiltersInjectionMixin]
      },
      {
        provide: {
          filters: injectedFilters
        },
        propsData: {
          filters: propFilters,
          parentId
        }
      }
    );

    return {
      wrapper,
      getRenderedFilterIds(): string[] {
        return wrapper.findAll('li').wrappers.map(element => element.text());
      },
      async setPropFilters(propFilters: Filter[]) {
        await wrapper.setProps({ filters: propFilters });
      }
    };
  }

  it('renders the props filters', async () => {
    const whiteFilter = createNextSimpleFilter('color', 'white');
    const blackFilter = createNextSimpleFilter('color', 'black');
    const blueFilter = createNextSimpleFilter('color', 'blue');
    const { setPropFilters, getRenderedFilterIds } = mountComponent({
      propFilters: [whiteFilter, blackFilter]
    });
    let renderedIds = getRenderedFilterIds();
    expect(renderedIds).toContain(whiteFilter.id);
    expect(renderedIds).toContain(blackFilter.id);

    await setPropFilters([whiteFilter, blackFilter, blueFilter]);
    renderedIds = getRenderedFilterIds();

    expect(renderedIds).toContain(whiteFilter.id);
    expect(renderedIds).toContain(blackFilter.id);
    expect(renderedIds).toContain(blueFilter.id);
  });
});

type TestFilterInjectionAPI = {
  wrapper: Wrapper<Vue>;
  getRenderedFilterIds: () => string[];
  setPropFilters: (propFilters: Filter[]) => Promise<void>;
};
