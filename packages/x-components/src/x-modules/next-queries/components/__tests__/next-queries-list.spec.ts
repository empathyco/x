import { NextQuery } from '@empathyco/x-types';
import { DeepPartial, Dictionary } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue, { ComponentOptions, VueConstructor } from 'vue';
import Vuex, { Store } from 'vuex';
import Component from 'vue-class-component';
import { createNextQueryStub } from '../../../../__stubs__/next-queries-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { ItemsListInjectionMixin } from '../../../../components/items-list-injection.mixin';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { ListItem } from '../../../../utils/types';
import { nextQueriesXModule } from '../../x-module';
import NextQueriesList from '../next-queries-list.vue';
import { XProvide } from '../../../../components/decorators/injection.decorators';
import { QUERY_KEY } from '../../../../components/decorators/injection.consts';
import { RequestStatus } from '../../../../store/utils/status-store.utils';
import { resetXNextQueriesStateWith } from './utils';

/**
 * Renders the `NextQueriesList` component, exposing a basic API for testing.
 *
 * @param options - The options to render the component with.
 * @returns The API for testing the `NextQueriesList` component.
 */
function renderNextQueriesList({
  template = `
    <ProviderWrapper>
      <NextQueriesList v-bind="$attrs">
       <template #next-queries-group="{ item }">
          <ul class="next-queries-group">
            <li v-for="nextQuery in item.nextQueries" class="next-query">{{
             nextQuery.query
            }}</li>
          </ul>
        </template>
      </NextQueriesList>
    </ProviderWrapper>
    `,
  nextQueries = [],
  query = 'jacket',
  status = 'initial',
  searchQuery,
  components,
  extraItems,
  ...props
}: RenderNextQueriesListOptions = {}): RenderNextQueriesListAPI {
  @Component({
    template: `<div><slot/></div>`
  })
  class ProviderWrapper extends Vue {
    @XProvide(QUERY_KEY)
    public searchQuery = searchQuery;
  }

  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store, initialXModules: [nextQueriesXModule] }, localVue);
  resetXNextQueriesStateWith(store, { nextQueries, query, status });

  const wrapper = mount(
    {
      template,
      components: {
        ProviderWrapper,
        NextQueriesList,
        ...components
      },
      mixins: [ItemsListInjectionMixin],
      computed: {
        items() {
          return extraItems;
        }
      }
    },
    {
      localVue,
      store,
      propsData: props
    }
  );

  const nextQueriesListWrapper = wrapper.findComponent(NextQueriesList);

  function getSearchItemWrappers(): WrapperArray<Vue> {
    return nextQueriesListWrapper.findAll(
      `${getDataTestSelector('next-queries-groups-list-item')}, ${getDataTestSelector(
        'extra-items-list-item'
      )}`
    );
  }

  return {
    wrapper: nextQueriesListWrapper,
    getSearchItemWrappers,
    getNextQueryGroupWrappers() {
      return nextQueriesListWrapper.findAll('.next-queries-group');
    },
    getNextQueryWrappers(root = nextQueriesListWrapper) {
      return root.findAll('.next-query');
    },
    getItemsRenderedText() {
      return getSearchItemWrappers().wrappers.map(wrapper => wrapper.text());
    }
  };
}

/**
 * Creates a list of {@link ListItem} of the given length.
 *
 * @param length - The length of the list to create.
 * @returns A list of simple {@link ListItem}s.
 */
function createExtraItems(length: number): ListItem[] {
  return Array.from({ length }, (_, index) => ({
    id: `Extra ${index}`,
    modelName: `ExtraItem`
  }));
}

/**
 * Creates a list of {@link NextQuery|NextQueries} the given list of queries.
 *
 * @param queries - The queries from whom create the next queries objects.
 * @returns A list of {@link NextQuery|NextQueries}.
 */
function createNextQueries(...queries: string[]): NextQuery[] {
  return queries.map(query => createNextQueryStub(query));
}

describe('testing NextQueriesList component', () => {
  it('is an XComponent', () => {
    const { wrapper } = renderNextQueriesList();
    expect(isXComponent(wrapper.vm)).toEqual(true);
  });

  it('has Search as XModule', () => {
    const { wrapper } = renderNextQueriesList();
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('nextQueries');
  });

  it('renders no group if no list items are injected', () => {
    const nextQueries = createNextQueries('milk', 'sugar', 'beer');
    const { getNextQueryGroupWrappers, getSearchItemWrappers } = renderNextQueriesList({
      nextQueries,
      maxNextQueriesPerGroup: 2,
      extraItems: []
    });

    expect(getSearchItemWrappers()).toHaveLength(0);
    expect(getNextQueryGroupWrappers()).toHaveLength(0);
  });

  it('inserts next queries groups in the appropriate order', () => {
    const nextQueries = createNextQueries(
      'steak',
      'tomahawk',
      't-bone',
      'porterhouse',
      'rib-eye',
      'ribs',
      'picanha',
      'short-ribs',
      'flank steak' // This one should be ignored as there is no room for it.
    );
    const extraItems = createExtraItems(11);
    const { getItemsRenderedText } = renderNextQueriesList({
      nextQueries,
      extraItems,
      maxNextQueriesPerGroup: 2,
      frequency: 3,
      offset: 4
    });

    // 11 extra items + 4 groups of NQs at index 4, 7, 10, 13
    expect(getItemsRenderedText()).toEqual([
      extraItems[0].id,
      extraItems[1].id,
      extraItems[2].id,
      extraItems[3].id,
      ['steak', 'tomahawk'].join(''),
      extraItems[4].id,
      extraItems[5].id,
      ['t-bone', 'porterhouse'].join(''),
      extraItems[6].id,
      extraItems[7].id,
      ['rib-eye', 'ribs'].join(''),
      extraItems[8].id,
      extraItems[9].id,
      ['picanha', 'short-ribs'].join(''),
      extraItems[10].id
    ]);
  });

  it('does not render more than the specified groups', () => {
    const nextQueries = createNextQueries(
      'tequila',
      'mezcal',
      'absinthe',
      'vodka',
      'rum', // Should be ignored because maxGroups: 2
      'dark-rum' // Should be ignored because maxGroups: 2
    );
    const extraItems = createExtraItems(10);
    const { getItemsRenderedText } = renderNextQueriesList({
      nextQueries,
      extraItems,
      maxNextQueriesPerGroup: 2,
      frequency: 3,
      offset: 4,
      maxGroups: 2
    });

    // 10 extra items + 2 groups of NQs at index 4, 7
    expect(getItemsRenderedText()).toEqual([
      extraItems[0].id,
      extraItems[1].id,
      extraItems[2].id,
      extraItems[3].id,
      ['tequila', 'mezcal'].join(''),
      extraItems[4].id,
      extraItems[5].id,
      ['absinthe', 'vodka'].join(''),
      extraItems[6].id,
      extraItems[7].id,
      extraItems[8].id,
      extraItems[9].id
    ]);
  });

  it('renders a group even if it has not enough next queries', () => {
    const nextQueries = createNextQueries('piña colada');
    const extraItems = createExtraItems(4);
    const { getItemsRenderedText } = renderNextQueriesList({
      nextQueries,
      extraItems,
      maxNextQueriesPerGroup: 4,
      offset: 2
    });

    // 4 extra items + 1 groups of NQs at index 2
    expect(getItemsRenderedText()).toEqual([
      extraItems[0].id,
      extraItems[1].id,
      'piña colada',
      extraItems[2].id,
      extraItems[3].id
    ]);
  });

  it('provides the modified list of list items', () => {
    const CustomList: ComponentOptions<Vue> = {
      mixins: [ItemsListInjectionMixin],
      template: `
        <ul>
        <li class="search-item" v-for="item in injectedListItems">{{ item.id }}</li>
        </ul>`
    };
    const nextQueries = createNextQueries('rib chop', 'shoulder steak');
    const extraItems = createExtraItems(4);
    const { wrapper } = renderNextQueriesList({
      template: `
        <NextQueriesList v-bind="$attrs">
        <CustomList/>
        </NextQueriesList>`,
      components: { CustomList },
      nextQueries,
      extraItems,
      maxNextQueriesPerGroup: 1,
      frequency: 3,
      offset: 2
    });

    const customItemsRenderedText = wrapper
      .findAll('.search-item')
      .wrappers.map(wrapper => wrapper.text());

    expect(customItemsRenderedText).toEqual([
      extraItems[0].id,
      extraItems[1].id,
      'rib chop',
      extraItems[2].id,
      extraItems[3].id,
      'shoulder steak'
    ]);
  });

  describe('when a search query is provided', () => {
    const extraItems = createExtraItems(5);
    const nextQueries = createNextQueries('gloves', 'hat');

    it('renders extra items if the next queries query and the search query are different', () => {
      const { getItemsRenderedText } = renderNextQueriesList({
        nextQueries,
        extraItems,
        query: 'jacket',
        searchQuery: 'tshirt',
        maxNextQueriesPerGroup: 1,
        frequency: 1,
        offset: 0
      });
      expect(getItemsRenderedText()).toEqual(extraItems.map(item => item.id));
    });

    it('renders extra items if the status of the next queries requests is not success', () => {
      const query = 'jacket';
      const { getItemsRenderedText } = renderNextQueriesList({
        nextQueries,
        extraItems,
        query,
        searchQuery: query,
        maxNextQueriesPerGroup: 1,
        frequency: 1,
        offset: 0
      });
      expect(getItemsRenderedText()).toEqual(extraItems.map(item => item.id));
    });

    // eslint-disable-next-line max-len
    it('renders next queries and extra items if the status is success and the search query and the query are equal', () => {
      const query = 'jacket';
      const { getItemsRenderedText } = renderNextQueriesList({
        nextQueries,
        extraItems,
        query,
        searchQuery: query,
        maxNextQueriesPerGroup: 1,
        frequency: 1,
        offset: 0,
        status: 'success'
      });
      expect(getItemsRenderedText()).toEqual([
        ...nextQueries.map(nextQuery => nextQuery.query),
        ...extraItems.map(item => item.id)
      ]);
    });
  });

  describe('when the offset is lower than the number of items', () => {
    it('inserts next queries groups by default', () => {
      const nextQueries = createNextQueries(
        'steak',
        'tomahawk' // This one should be ignored as there is no room for it.
      );
      const extraItems = createExtraItems(5);
      const { getItemsRenderedText } = renderNextQueriesList({
        nextQueries,
        extraItems,
        maxNextQueriesPerGroup: 1,
        frequency: 48,
        offset: 24
      });

      // 5 extra items + 1 group of NQs at index 5
      expect(getItemsRenderedText()).toEqual([
        extraItems[0].id,
        extraItems[1].id,
        extraItems[2].id,
        extraItems[3].id,
        extraItems[4].id,
        ['steak'].join('')
      ]);
    });

    it('does not insert next queries groups if `showOnlyAfterOffset` is `true`', () => {
      const nextQueries = createNextQueries('steak', 'tomahawk');
      const extraItems = createExtraItems(5);
      const { getItemsRenderedText } = renderNextQueriesList({
        nextQueries,
        extraItems,
        maxNextQueriesPerGroup: 1,
        frequency: 48,
        offset: 24,
        showOnlyAfterOffset: true
      });

      // 5 extra items + no groups of NQs
      expect(getItemsRenderedText()).toEqual([
        extraItems[0].id,
        extraItems[1].id,
        extraItems[2].id,
        extraItems[3].id,
        extraItems[4].id
      ]);
    });
  });
});

interface RenderNextQueriesListOptions {
  /**
   * Determines if a group is added to the injected items list when the number
   * of items is smaller than the offset.
   */
  showOnlyAfterOffset?: boolean;
  /** Extra components to be registered and rendered. */
  components?: Dictionary<VueConstructor | ComponentOptions<Vue>>;
  /** Extra items to be rendered. */
  extraItems?: ListItem[];
  /** Indicates the cycle size to insert next queries group at. */
  frequency?: number;
  /** The maximum number of groups to add to the list items list. */
  maxGroups?: number;
  /** The maximum number of next queries to insert in a group. */
  maxNextQueriesPerGroup?: number;
  /** The `nextQueries` used to be rendered. */
  nextQueries?: NextQuery[];
  /** The first list index that a next queries group should appear in. */
  offset?: number;
  /** The template to be rendered. */
  template?: string;
  /** The query of the next queries request. */
  query?: string;
  /** The search query, it will be provided in a wrapper with XProvide. */
  searchQuery?: string;
  /** The next queries request status. */
  status?: RequestStatus;
}

interface RenderNextQueriesListAPI {
  /** Retrieves the wrappers of the next queries group. */
  getNextQueryGroupWrappers: () => WrapperArray<Vue>;
  /** Retrieves the wrappers of the individual next queries. */
  getNextQueryWrappers: (root?: Wrapper<Vue>) => WrapperArray<Vue>;
  /** Retrieves the wrappers of the list items. */
  getSearchItemWrappers: () => WrapperArray<Vue>;
  /** Retrieves rendered text for each DOM list item. */
  getItemsRenderedText: () => string[];
  /** The `wrapper` wrapper component. */
  wrapper: Wrapper<Vue>;
}
