import { DeepPartial } from '@empathyco/x-utils';
import { mount } from '@vue/test-utils';
import { Store } from 'vuex';
import { nextTick } from 'vue';
import { createNextQueryStub, getNextQueriesStub } from '../../../../__stubs__';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components';
import { RootXStoreState } from '../../../../store';
import NextQueries from '../next-queries.vue';
import { default as NextQueryComponent } from '../next-query.vue';
import { nextQueriesXModule } from '../../x-module';
import { resetXNextQueriesStateWith } from './utils';

async function render({
  nextQueries = getNextQueriesStub(),
  template = '<NextQueries :suggestions="suggestions" :highlightCurated="highlightCurated"/>'
} = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({});
  const resetStoreState = async (state: Parameters<typeof resetXNextQueriesStateWith>[1]) => {
    resetXNextQueriesStateWith(store, state);
    await nextTick();
  };

  const wrapper = mount(
    {
      template,
      components: { NextQueries, NextQuery: NextQueryComponent },
      props: ['suggestions', 'highlightCurated']
    },
    {
      props: { suggestions: null, highlightCurated: false },
      global: { plugins: [installNewXPlugin({ store, initialXModules: [nextQueriesXModule] })] }
    }
  );

  await resetStoreState({ nextQueries });

  return {
    wrapper,
    nqWrapper: wrapper.findComponent(NextQueries),
    nextQueries,
    resetStoreState,
    findDataTestWrapper: (dataTest: string) => wrapper.findAll(getDataTestSelector(dataTest))
  };
}

describe('testing next queries component', () => {
  it('is an XComponent which has an XModule', async () => {
    const { nqWrapper } = await render();

    expect(isXComponent(nqWrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(nqWrapper.vm)).toEqual('nextQueries');
  });

  it('renders a button with the query of the next query(suggestion)', async () => {
    const { nextQueries, findDataTestWrapper } = await render();
    const nextQueryItems = findDataTestWrapper('next-query-item');

    nextQueryItems.forEach((nextQueryItemWrapper, index) =>
      expect(nextQueryItemWrapper.text()).toEqual(nextQueries[index].query)
    );
  });

  it('renders a span, an image & a highlighting icon overriding the default Next Query content', async () => {
    const { wrapper, nextQueries, resetStoreState, findDataTestWrapper } = await render({
      template: `
        <NextQueries :highlightCurated="highlightCurated">
          <template #suggestion-content="{ shouldHighlightCurated, suggestion, index }">
            <span data-test="next-query-highlight">
              <img v-if="shouldHighlightCurated" src="#" alt="" />
            </span>
            <img src="#" class="x-next-query__icon" data-test="icon" alt="" />
            <span class="x-next-query__query" data-test="query" :data-index="index">{{ suggestion.query }}</span>
          </template>
        </NextQueries>`
    });

    nextQueries[0].isCurated = true;
    await resetStoreState({ nextQueries });

    const eventSpansList = findDataTestWrapper('query');
    const iconsList = findDataTestWrapper('icon');
    let highlightIconList = findDataTestWrapper('next-query-highlight');

    nextQueries.forEach((nextQuery, index) => {
      expect(eventSpansList.at(index)?.element.innerHTML).toEqual(nextQuery.query);
      expect(eventSpansList.at(index)?.element.getAttribute('data-index')).toEqual(`${index}`);
      expect(highlightIconList.at(index)?.find('img').exists()).toEqual(false);
      expect(iconsList.at(index)).toBeDefined();
    });

    await wrapper.setProps({ highlightCurated: true });
    highlightIconList = findDataTestWrapper('next-query-highlight');

    nextQueries.forEach((nextQuery, index) => {
      expect(highlightIconList.at(index)?.find('img').exists())?.toEqual(!!nextQuery.isCurated);
    });
  });

  it('renders a button, a highlighting icon & a custom Next Query', async () => {
    const { wrapper, nextQueries, resetStoreState, findDataTestWrapper } = await render({
      template: `
        <NextQueries :highlightCurated="highlightCurated">
          <template #suggestion="{ suggestion, highlightCurated, index }">
            <NextQuery :suggestion="suggestion" :highlightCurated="highlightCurated">
              <template #default="{ shouldHighlightCurated }">
                <span data-test="next-query-highlight">
                  <img v-if="shouldHighlightCurated" src="#" alt="" />
                </span>
                <img src="#" class="x-next-query__icon" data-test="icon" alt="" />
                <span class="x-next-query__query" data-test="query" :data-index="index">{{ suggestion.query }}</span>
              </template>
            </NextQuery>
            <button data-test="custom-button">Custom Behaviour</button>
          </template>
        </NextQueries>`
    });

    expect(wrapper.findComponent(NextQueryComponent)).toBeDefined();

    nextQueries[0].isCurated = true;
    await resetStoreState({ nextQueries });

    const eventSpansList = findDataTestWrapper('query');
    const iconsList = findDataTestWrapper('icon');
    const customButtonList = findDataTestWrapper('custom-button');
    let highlightIconList = findDataTestWrapper('next-query-highlight');

    nextQueries.forEach((nextQuery, index) => {
      expect(eventSpansList.at(index)?.element.innerHTML).toEqual(nextQuery.query);
      expect(eventSpansList.at(index)?.element.getAttribute('data-index')).toEqual(`${index}`);
      expect(iconsList.at(index)).toBeDefined();
      expect(customButtonList.at(index)).toBeDefined();
      expect(highlightIconList.at(index)?.find('img').exists()).toEqual(false);
    });

    await wrapper.setProps({ highlightCurated: true });
    highlightIconList = findDataTestWrapper('next-query-highlight');

    nextQueries.forEach((nextQuery, index) =>
      expect(highlightIconList.at(index)?.find('img').exists()).toEqual(!!nextQuery.isCurated)
    );
  });

  it('does not render any NextQuery if the are none', async () => {
    const { wrapper } = await render({ nextQueries: [] });

    expect(wrapper.find('x-next-queries').exists()).toEqual(false);
  });

  it('renders at most the number of NextQuery defined by `maxItemsToRender` prop', async () => {
    const { nextQueries, findDataTestWrapper, wrapper } = await render();

    await wrapper.setProps({ maxItemsToRender: 2 });
    expect(findDataTestWrapper('next-query')).toHaveLength(2);

    await wrapper.setProps({ maxItemsToRender: 3 });
    expect(findDataTestWrapper('next-query')).toHaveLength(3);

    await wrapper.setProps({ maxItemsToRender: 5 });
    expect(findDataTestWrapper('next-query')).toHaveLength(nextQueries.length);
  });

  it('renders the `suggestions` passed by props instead the ones from the state', async () => {
    let queries = ['Lettuce', 'Tomato'];
    const { wrapper, findDataTestWrapper } = await render({
      nextQueries: queries.map(q => createNextQueryStub(q))
    });

    expect(findDataTestWrapper('next-query')).toHaveLength(2);
    queries.forEach((query, i) =>
      expect(findDataTestWrapper('next-query').at(i)?.text()).toEqual(query)
    );

    queries = ['Bread', 'Meat', 'Cheese'];
    await wrapper.setProps({
      suggestions: queries.map(q => createNextQueryStub(q))
    });

    expect(findDataTestWrapper('next-query')).toHaveLength(3);
    queries.forEach((query, i) =>
      expect(findDataTestWrapper('next-query').at(i)?.text()).toEqual(query)
    );
  });
});
