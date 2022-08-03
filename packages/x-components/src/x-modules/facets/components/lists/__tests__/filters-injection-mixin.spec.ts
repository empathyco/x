import { Filter } from '@empathyco/x-types';
import { mount, Wrapper } from '@vue/test-utils';
import Vue, { ComponentOptions } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import {
  createHierarchicalFilter,
  createSimpleFilter
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

describe('test filters injection mixin', () => {
  function renderFiltersMixin({
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
    const whiteFilter = createSimpleFilter('color', 'white');
    const blackFilter = createSimpleFilter('color', 'black');
    const blueFilter = createSimpleFilter('color', 'blue');
    const { setPropFilters, getRenderedFilterIds } = renderFiltersMixin({
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
    const whiteFilter = createSimpleFilter('color', 'white');
    const blackFilter = createSimpleFilter('color', 'black');
    const blueFilter = createSimpleFilter('color', 'blue');
    const { getRenderedFilterIds } = renderFiltersMixin({
      injectedFilters: [whiteFilter, blackFilter, blueFilter]
    });
    const renderedIds = getRenderedFilterIds();

    expect(renderedIds).toContain(whiteFilter.id);
    expect(renderedIds).toContain(blackFilter.id);
    expect(renderedIds).toContain(blueFilter.id);
  });

  it('renders the prop filters when there are injected filters too', () => {
    const whiteFilter = createSimpleFilter('color', 'white');
    const blackFilter = createSimpleFilter('color', 'black');
    const blueFilter = createSimpleFilter('color', 'blue');
    const { getRenderedFilterIds } = renderFiltersMixin({
      propFilters: [whiteFilter, blackFilter],
      injectedFilters: [blueFilter]
    });
    const renderedIds = getRenderedFilterIds();

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
    const categoryShirts = createHierarchicalFilter('category', 'shirts', false);
    const categoryJeans = createHierarchicalFilter('category', 'jeans', false);
    const categoryMen = createHierarchicalFilter('category', 'men', false, [
      categoryShirts,
      categoryJeans
    ]);
    categoryShirts.parentId = categoryJeans.parentId = categoryMen.id;
    const categoryWomen = createHierarchicalFilter('category', 'women', false);

    const { getRenderedFilterIds } = renderFiltersMixin({
      propFilters: [categoryShirts, categoryJeans, categoryMen, categoryWomen]
    });
    const renderedIds = getRenderedFilterIds();

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
    const categoryShirts = createHierarchicalFilter('category', 'shirts', false);
    const categoryJeans = createHierarchicalFilter('category', 'jeans', false);
    const categoryMen = createHierarchicalFilter('category', 'men', false, [
      categoryShirts,
      categoryJeans
    ]);
    categoryShirts.parentId = categoryJeans.parentId = categoryMen.id;
    const categoryWomen = createHierarchicalFilter('category', 'women', false);

    const { getRenderedFilterIds } = renderFiltersMixin({
      propFilters: [categoryShirts, categoryJeans, categoryMen, categoryWomen],
      parentId: categoryMen.id
    });
    const renderedIds = getRenderedFilterIds();

    expect(renderedIds).not.toContain(categoryWomen.id);
    expect(renderedIds).not.toContain(categoryMen.id);
    expect(renderedIds).toContain(categoryJeans.id);
    expect(renderedIds).toContain(categoryShirts.id);
  });
});

/**
 * The returned API of the method {@link renderFiltersMixin}.
 */
type TestFilterInjectionAPI = {
  /** The wrapper of the mounted component. */
  wrapper: Wrapper<Vue>;
  /** It returns an array with the filter ids rendered in the mounted component. */
  getRenderedFilterIds: () => string[];
  /** Changes the propFilters of the mounted component. */
  setPropFilters: (propFilters: Filter[]) => Promise<void>;
};
