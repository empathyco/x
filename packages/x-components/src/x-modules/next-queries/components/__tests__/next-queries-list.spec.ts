import { NextQuery } from '@empathyco/x-types';
import { DeepPartial } from '@empathyco/x-utils';
import { mount } from '@vue/test-utils';
import { defineComponent, inject, nextTick, provide, ref, Ref } from 'vue';
import { Store } from 'vuex';
import { createNextQueryStub } from '../../../../__stubs__';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import {
  LIST_ITEMS_KEY,
  QUERY_KEY,
  getXComponentXModuleName,
  isXComponent
} from '../../../../components';
import { RootXStoreState, RequestStatus } from '../../../../store';
import { ListItem } from '../../../../utils/types';
import { nextQueriesXModule } from '../../x-module';
import NextQueriesList from '../next-queries-list.vue';
import { resetXNextQueriesStateWith } from './utils';

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
function createNextQueries(...queries: string[]) {
  return queries.map(query => createNextQueryStub(query));
}

async function render({
  template = `
    <NextQueriesList>
      <template #next-queries-group="{ item }">
        <ul class="next-queries-group">
          <li v-for="nextQuery in item.nextQueries" class="next-query">{{ nextQuery.query }}</li>
        </ul>
      </template>
    </NextQueriesList>`,
  nextQueries = [] as NextQuery[],
  query = 'jacket',
  status = 'initial' as RequestStatus,
  searchQuery = '',
  components = {},
  extraItems = [] as ListItem[],
  offset = 24,
  frequency = 24,
  maxNextQueriesPerGroup = 4,
  maxGroups = undefined as undefined | number,
  showOnlyAfterOffset = false
} = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({});

  const wrapper = mount(
    {
      template,
      components: { NextQueriesList, ...components },
      setup() {
        provide(LIST_ITEMS_KEY as string, ref(extraItems));
        provide(QUERY_KEY as string, ref(searchQuery));
      }
    },
    {
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [nextQueriesXModule] })]
      },
      props: { offset, frequency, maxNextQueriesPerGroup, maxGroups, showOnlyAfterOffset }
    }
  );

  resetXNextQueriesStateWith(store, { nextQueries, query, status });
  await nextTick();

  const nextQueriesListWrapper = wrapper.findComponent(NextQueriesList);

  function getSearchItemWrappers() {
    const nextQueriesGroups = getDataTestSelector('next-queries-groups-list-item');
    const extraItemsGroups = getDataTestSelector('extra-items-list-item');
    return nextQueriesListWrapper.findAll(`${nextQueriesGroups}, ${extraItemsGroups}`);
  }

  return {
    wrapper: nextQueriesListWrapper,
    getSearchItemWrappers,
    getNextQueryGroupWrappers: () => nextQueriesListWrapper.findAll('.next-queries-group'),
    getItemsRenderedText: () => getSearchItemWrappers().map(wrapper => wrapper.text()),
    setStatusState: async () => {
      store.commit('x/nextQueries/setStatus', status);
      await nextTick();
    }
  };
}

describe('testing NextQueriesList component', () => {
  it('is an XComponent and has Search as XModule', async () => {
    const { wrapper } = await render();

    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('nextQueries');
  });

  it('renders no group if no list items are injected', async () => {
    const nextQueries = createNextQueries('milk', 'sugar', 'beer');
    const { getNextQueryGroupWrappers, getSearchItemWrappers } = await render({
      nextQueries,
      maxNextQueriesPerGroup: 2,
      extraItems: []
    });

    expect(getSearchItemWrappers()).toHaveLength(0);
    expect(getNextQueryGroupWrappers()).toHaveLength(0);
  });

  it('inserts next queries groups in the appropriate order', async () => {
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
    const { getItemsRenderedText } = await render({
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

  it('does not render more than the specified groups', async () => {
    const nextQueries = createNextQueries(
      'tequila',
      'mezcal',
      'absinthe',
      'vodka',
      'rum', // Should be ignored because maxGroups: 2
      'dark-rum' // Should be ignored because maxGroups: 2
    );
    const extraItems = createExtraItems(10);
    const { getItemsRenderedText } = await render({
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

  it('renders a group even if it has not enough next queries', async () => {
    const nextQueries = createNextQueries('piña colada');
    const extraItems = createExtraItems(4);
    const { getItemsRenderedText } = await render({
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

  it('provides the modified list of list items', async () => {
    const CustomList = defineComponent({
      name: 'CustomList',
      setup: () => ({ injectedListItems: inject<Ref<ListItem[]>>(LIST_ITEMS_KEY as string) }),
      template: `<ul><li class="search-item" v-for="item in injectedListItems">{{ item.id }}</li></ul>`
    });
    const nextQueries = createNextQueries('rib chop', 'shoulder steak');
    const extraItems = createExtraItems(4);
    const { wrapper } = await render({
      template: `<NextQueriesList><CustomList/></NextQueriesList>`,
      components: { CustomList },
      nextQueries,
      extraItems,
      maxNextQueriesPerGroup: 1,
      frequency: 3,
      offset: 2
    });

    const customItemsRenderedText = wrapper.findAll('.search-item').map(wrapper => wrapper.text());

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

    it('renders extra items if the next queries query and the search query are different', async () => {
      const { getItemsRenderedText } = await render({
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

    it('renders extra items if the status of the next queries requests is not success', async () => {
      const query = 'jacket';
      const { getItemsRenderedText } = await render({
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

    it('renders next queries and extra items if the status is success and the search query and the query are equal', async () => {
      const query = 'jacket';
      const { getItemsRenderedText, setStatusState } = await render({
        nextQueries,
        extraItems,
        query,
        searchQuery: query,
        maxNextQueriesPerGroup: 1,
        frequency: 1,
        offset: 0,
        status: 'success'
      });

      /*
        To avoid side effects with `NextQueriesRequestUpdated` event emitter because `query` change
        and `status` set to `loading`.
        Status workflow: 'initial' -> 'success' -> 'loading' -> `success`
      */
      await setStatusState();

      expect(getItemsRenderedText()).toEqual([
        ...nextQueries.map(nextQuery => nextQuery.query),
        ...extraItems.map(item => item.id)
      ]);
    });
  });

  describe('when the offset is lower than the number of items', () => {
    it('inserts next queries groups by default', async () => {
      const nextQueries = createNextQueries(
        'steak',
        'tomahawk' // This one should be ignored as there is no room for it.
      );
      const extraItems = createExtraItems(5);
      const { getItemsRenderedText } = await render({
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

    it('does not insert next queries groups if `showOnlyAfterOffset` is `true`', async () => {
      const nextQueries = createNextQueries('steak', 'tomahawk');
      const extraItems = createExtraItems(5);
      const { getItemsRenderedText } = await render({
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
