import { Filter } from '@empathyco/x-types-next';
import { mount, Wrapper } from '@vue/test-utils';
import Vue, { ComponentOptions } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import {
  createNextHierarchicalFilter,
  createNextSimpleFilter
} from '../../../../../__stubs__/filters-stubs.factory';
import { XProvide } from '../../../../../components/decorators/injection.decorators';
import FiltersInjectionMixin from '../filters-injection.mixin';

@Component({
  template: `
    <div>
    <slot/>
    </div>`
})
class Provider extends Vue {
  @Prop()
  @XProvide('filters')
  public injectedData!: any;
}

const Filters: ComponentOptions<Vue> = {
  mixins: [FiltersInjectionMixin],
  template: `
    <div>
    <li v-for="filter of renderedFilters" :key="filter.id">{{ filter.id }}</li>
    </div>
  `
};

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
          <Provider :injectedData="injectedFilters">
          <Filters :filters="propFilters" :parentId="parentId"/>
          </Provider>
        `,
        components: { Provider, Filters }
      },
      {
        data() {
          return {
            propFilters,
            injectedFilters,
            parentId
          };
        }
      }
    );

    return {
      wrapper,
      getRenderedFilterIds(): string[] {
        return wrapper.findAll('li').wrappers.map(element => element.text());
      },
      async setPropFilters(propFilters: Filter[]) {
        await wrapper.setData({ propFilters });
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

  it('renders the injected filters', () => {
    const whiteFilter = createNextSimpleFilter('color', 'white');
    const blackFilter = createNextSimpleFilter('color', 'black');
    const blueFilter = createNextSimpleFilter('color', 'blue');
    const { getRenderedFilterIds } = mountComponent({
      injectedFilters: [whiteFilter, blackFilter, blueFilter]
    });
    let renderedIds = getRenderedFilterIds();

    expect(renderedIds).toContain(whiteFilter.id);
    expect(renderedIds).toContain(blackFilter.id);
    expect(renderedIds).toContain(blueFilter.id);
  });

  it('renders the prop filters when there are injected filters too', () => {
    const whiteFilter = createNextSimpleFilter('color', 'white');
    const blackFilter = createNextSimpleFilter('color', 'black');
    const blueFilter = createNextSimpleFilter('color', 'blue');
    const { getRenderedFilterIds } = mountComponent({
      propFilters: [whiteFilter, blackFilter],
      injectedFilters: [blueFilter]
    });
    let renderedIds = getRenderedFilterIds();

    expect(renderedIds).toContain(whiteFilter.id);
    expect(renderedIds).toContain(blackFilter.id);
    expect(renderedIds).not.toContain(blueFilter.id);
  });

  it('renders the first level Hierarchical Filters when no parentId prop passed', () => {
    /*
     Women
     Men
       Jeans
        Shirts
     */
    const categoryShirts = createNextHierarchicalFilter('category', 'shirts', false);
    const categoryJeans = createNextHierarchicalFilter('category', 'jeans', false);
    const categoryMen = createNextHierarchicalFilter('category', 'men', false, [
      categoryShirts.id,
      categoryJeans.id
    ]);
    categoryShirts.parentId = categoryJeans.parentId = categoryMen.id;
    const categoryWomen = createNextHierarchicalFilter('category', 'women', false);

    const { getRenderedFilterIds } = mountComponent({
      propFilters: [categoryShirts, categoryJeans, categoryMen, categoryWomen]
    });
    let renderedIds = getRenderedFilterIds();

    expect(renderedIds).toContain(categoryWomen.id);
    expect(renderedIds).toContain(categoryMen.id);
    expect(renderedIds).not.toContain(categoryJeans.id);
    expect(renderedIds).not.toContain(categoryShirts.id);
  });

  it('renders the children Hierarchical Filters when parentId prop passed', () => {
    /*
     Women
     Men
       Jeans
        Shirts
     */
    const categoryShirts = createNextHierarchicalFilter('category', 'shirts', false);
    const categoryJeans = createNextHierarchicalFilter('category', 'jeans', false);
    const categoryMen = createNextHierarchicalFilter('category', 'men', false, [
      categoryShirts.id,
      categoryJeans.id
    ]);
    categoryShirts.parentId = categoryJeans.parentId = categoryMen.id;
    const categoryWomen = createNextHierarchicalFilter('category', 'women', false);

    const { getRenderedFilterIds } = mountComponent({
      propFilters: [categoryShirts, categoryJeans, categoryMen, categoryWomen],
      parentId: categoryMen.id
    });
    let renderedIds = getRenderedFilterIds();

    expect(renderedIds).not.toContain(categoryWomen.id);
    expect(renderedIds).not.toContain(categoryMen.id);
    expect(renderedIds).toContain(categoryJeans.id);
    expect(renderedIds).toContain(categoryShirts.id);
  });
});

type TestFilterInjectionAPI = {
  wrapper: Wrapper<Vue>;
  getRenderedFilterIds: () => string[];
  setPropFilters: (propFilters: Filter[]) => Promise<void>;
};
