import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { getNextQueriesStub } from '../../../../__stubs__';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial } from '../../../../utils/types';
import NextQueries from '../next-queries.vue';
import NextQuery from '../next-query.vue';
import { resetXNextQueriesStateWith } from './utils';

describe('testing next queries component', () => {
  const nextQueries = getNextQueriesStub();

  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store });

  let nextQueriesWrapper: Wrapper<Vue>;

  beforeEach(() => {
    nextQueriesWrapper = mount(NextQueries, { localVue, store });
    resetXNextQueriesStateWith(store, { nextQueries });
  });

  it('is an XComponent', () => {
    expect(isXComponent(nextQueriesWrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(nextQueriesWrapper.vm)).toBe('nextQueries');
  });

  it('renders a button with the query of the next query(suggestion)', () => {
    const eventButtonsList = findTestDataById(nextQueriesWrapper, 'next-query');

    nextQueries.forEach((nextQuery, index) => {
      expect(eventButtonsList.at(index).element.innerHTML).toEqual(nextQuery.query);
    });
  });

  it('renders a span & and image overriding the default Next Query content', () => {
    const wrapperComponent = {
      template: `
        <NextQueries>
        <template #suggestion-content="suggestionContentScope">
          <img src="./next-query-icon.svg" class="x-next-query__icon" data-test="icon"/>
          <span
              class="x-next-query__query"
              data-test="query"
              :data-index="suggestionContentScope.index"
          >{{ suggestionContentScope.suggestion.query }}</span>
        </template>
        </NextQueries>
      `,
      components: {
        NextQueries
      }
    };

    nextQueriesWrapper = mount(wrapperComponent, {
      localVue,
      store
    });

    const eventSpansList = findTestDataById(nextQueriesWrapper, 'query');
    const iconsList = findTestDataById(nextQueriesWrapper, 'icon');

    nextQueries.forEach((nextQuery, index) => {
      expect(eventSpansList.at(index).element.innerHTML).toEqual(nextQuery.query);
      expect(eventSpansList.at(index).element.getAttribute('data-index')).toEqual(`${index}`);
      expect(iconsList.at(index)).toBeDefined();
    });
  });

  it('renders a button & a custom Next Query', () => {
    const wrapperComponent = {
      template: `
        <NextQueries>
        <template #suggestion="suggestionScope">
          <NextQuery :suggestion="suggestionScope.suggestion">
            <template #default="sugestionContentScope">
              <img src="./next-query-icon.svg"
                   class="x-next-query__icon"
                   data-test="icon"/>
              <span
                  class="x-next-query__query"
                  data-test="query"
                  :data-index="suggestionScope.index"
              >{{ suggestionScope.suggestion.query }}</span>
            </template>
          </NextQuery>
          <button data-test="custom-button">Custom Behaviour</button>
        </template>
        </NextQueries>
      `,
      components: {
        NextQueries,
        NextQuery
      }
    };

    nextQueriesWrapper = mount(wrapperComponent, {
      localVue,
      store
    });

    expect(nextQueriesWrapper.findComponent(NextQuery)).toBeDefined();

    const eventSpansList = findTestDataById(nextQueriesWrapper, 'query');
    const iconsList = findTestDataById(nextQueriesWrapper, 'icon');
    const customButtonList = findTestDataById(nextQueriesWrapper, 'custom-button');

    nextQueries.forEach((nextQuery, index) => {
      expect(eventSpansList.at(index).element.innerHTML).toEqual(nextQuery.query);
      expect(eventSpansList.at(index).element.getAttribute('data-index')).toEqual(`${index}`);
      expect(iconsList.at(index)).toBeDefined();
      expect(customButtonList.at(index)).toBeDefined();
    });
  });

  it('does not render any NextQuery if the are none', async () => {
    resetXNextQueriesStateWith(store);

    await localVue.nextTick();

    expect(nextQueriesWrapper.html()).toEqual('');
  });

  it('renders at most the number of NextQuery defined by `maxItemsToRender` prop', async () => {
    const renderedNextQueries = (): WrapperArray<Vue> =>
      findTestDataById(nextQueriesWrapper, 'next-query');

    await nextQueriesWrapper.setProps({ maxItemsToRender: 2 });
    expect(renderedNextQueries()).toHaveLength(2);

    await nextQueriesWrapper.setProps({ maxItemsToRender: 3 });
    expect(renderedNextQueries()).toHaveLength(3);

    await nextQueriesWrapper.setProps({ maxItemsToRender: 5 });
    expect(renderedNextQueries()).toHaveLength(nextQueries.length);
  });

  function findTestDataById(wrapper: Wrapper<Vue>, testDataId: string): WrapperArray<Vue> {
    return wrapper.findAll(getDataTestSelector(testDataId));
  }
});
