import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { NextQuery } from '@empathyco/x-types';
import { createNextQueryStub, getNextQueriesStub } from '../../../../__stubs__';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import NextQueries from '../next-queries.vue';
import { default as NextQueryComponent } from '../next-query.vue';
import { XPlugin } from '../../../../plugins/x-plugin';
import { nextQueriesXModule } from '../../x-module';
import { resetXNextQueriesStateWith } from './utils';

describe('testing next queries component', () => {
  function renderNextQueries({
    nextQueries = getNextQueriesStub(),
    template = '<NextQueries :suggestions="customSuggestions"/>'
  }: RenderNExtQueriesOptions = {}): RenderNextQueriesAPI {
    const localVue = createLocalVue();
    localVue.use(Vuex);
    const store = new Store<DeepPartial<RootXStoreState>>({});
    installNewXPlugin({ store }, localVue);

    // Manually re-installing the xModule and updating its state
    XPlugin.registerXModule(nextQueriesXModule);
    resetXNextQueriesStateWith(store, { nextQueries });

    const wrapperTemplate = mount(
      {
        props: ['nextQueries', 'highlightCurated', 'customSuggestions'],
        components: {
          NextQueries,
          NextQuery: NextQueryComponent
        },
        template
      },
      {
        localVue,
        store,
        propsData: { nextQueries, customSuggestions: null }
      }
    );
    const wrapper = wrapperTemplate.findComponent(NextQueries);

    const findTestDataById = (testDataId: string): WrapperArray<Vue> =>
      wrapper.findAll(getDataTestSelector(testDataId));

    return {
      wrapper,
      nextQueries,
      findTestDataById,
      getNextQueryItems() {
        return findTestDataById('next-query-item');
      },
      setCustomSuggestions(suggestions: NextQuery[]) {
        return wrapperTemplate.setProps({ customSuggestions: suggestions });
      }
    };
  }

  it('is an XComponent', () => {
    const { wrapper } = renderNextQueries();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toBe('nextQueries');
  });

  it('renders a button with the query of the next query(suggestion)', () => {
    const { nextQueries, getNextQueryItems } = renderNextQueries();

    getNextQueryItems().wrappers.forEach((nextQueryItemWrapper, index) => {
      expect(nextQueryItemWrapper.text()).toEqual(nextQueries[index].query);
    });
  });

  //eslint-disable-next-line max-len
  it('renders a span, an image & a highlighting icon overriding the default Next Query content', async () => {
    const template = `
        <NextQueries>
          <template #suggestion-content="suggestionContentScope">
            <span data-test="next-query-highlight">
              <img
                src="./chevron-icon.svg"
                v-if="suggestionContentScope.shouldHighlightCurated"
              />
            </span>
            <img src="./next-query-icon.svg" class="x-next-query__icon" data-test="icon"/>
            <span
              class="x-next-query__query"
              data-test="query"
              :data-index="suggestionContentScope.index"
            >{{ suggestionContentScope.suggestion.query }}</span>
          </template>
        </NextQueries>
      `;

    const { wrapper, nextQueries, findTestDataById } = renderNextQueries({
      template
    });

    nextQueries[0].isCurated = true;
    const eventSpansList = findTestDataById('query');
    const iconsList = findTestDataById('icon');
    let highlightIconList = findTestDataById('next-query-highlight');

    nextQueries.forEach((nextQuery, index) => {
      expect(eventSpansList.at(index).element.innerHTML).toEqual(nextQuery.query);
      expect(eventSpansList.at(index).element.getAttribute('data-index')).toEqual(`${index}`);
      expect(highlightIconList.at(index).contains('img')).toBe(false);
      expect(iconsList.at(index)).toBeDefined();
    });

    await wrapper.setProps({ highlightCurated: true });
    highlightIconList = findTestDataById('next-query-highlight');

    nextQueries.forEach((nextQuery, index) => {
      expect(highlightIconList.at(index).contains('img')).toBe(!!nextQuery.isCurated);
    });
  });

  it('renders a button, a highlighting icon & a custom Next Query', async () => {
    const template = `
        <NextQueries>
          <template #suggestion="{ suggestion, highlightCurated, index }">
            <NextQuery :suggestion="suggestion"
                       :highlightCurated="highlightCurated">
              <template #default="suggestionContentScope">
                <span data-test="next-query-highlight">
                  <img
                    src="./chevron-icon.svg"
                    v-if="suggestionContentScope.shouldHighlightCurated"
                  />
                </span>
                <img src="./next-query-icon.svg"
                  class="x-next-query__icon"
                  data-test="icon"/>
                <span
                  class="x-next-query__query"
                  data-test="query"
                  :data-index="index"
                >{{ suggestion.query }}</span>
              </template>
            </NextQuery>
            <button data-test="custom-button">Custom Behaviour</button>
          </template>
        </NextQueries>
      `;

    const { wrapper, nextQueries, findTestDataById } = renderNextQueries({
      template
    });

    expect(wrapper.findComponent(NextQueryComponent)).toBeDefined();

    nextQueries[0].isCurated = true;
    const eventSpansList = findTestDataById('query');
    const iconsList = findTestDataById('icon');
    const customButtonList = findTestDataById('custom-button');
    let highlightIconList = findTestDataById('next-query-highlight');

    nextQueries.forEach((nextQuery, index) => {
      expect(eventSpansList.at(index).element.innerHTML).toEqual(nextQuery.query);
      expect(eventSpansList.at(index).element.getAttribute('data-index')).toEqual(`${index}`);
      expect(iconsList.at(index)).toBeDefined();
      expect(customButtonList.at(index)).toBeDefined();
      expect(highlightIconList.at(index).contains('img')).toBe(false);
    });

    await wrapper.setProps({ highlightCurated: true });
    highlightIconList = findTestDataById('next-query-highlight');

    nextQueries.forEach((nextQuery, index) => {
      expect(highlightIconList.at(index).contains('img')).toBe(!!nextQuery.isCurated);
    });
  });

  it('does not render any NextQuery if the are none', () => {
    const { wrapper } = renderNextQueries({
      nextQueries: []
    });

    expect(wrapper.html()).toEqual('');
  });

  it('renders at most the number of NextQuery defined by `maxItemsToRender` prop', async () => {
    const { wrapper, nextQueries, findTestDataById } = renderNextQueries();

    await wrapper.setProps({ maxItemsToRender: 2 });
    expect(findTestDataById('next-query')).toHaveLength(2);

    await wrapper.setProps({ maxItemsToRender: 3 });
    expect(findTestDataById('next-query')).toHaveLength(3);

    await wrapper.setProps({ maxItemsToRender: 5 });
    expect(findTestDataById('next-query')).toHaveLength(nextQueries.length);
  });

  it('renders the `suggestions` passed by props instead the ones from the state', async () => {
    const { findTestDataById, setCustomSuggestions } = renderNextQueries({
      nextQueries: [createNextQueryStub('Lettuce'), createNextQueryStub('Tomato')]
    });

    const myNextQueries = [
      createNextQueryStub('Bread'),
      createNextQueryStub('Meat'),
      createNextQueryStub('Cheese')
    ];

    expect(findTestDataById('next-query')).toHaveLength(2);
    expect(findTestDataById('next-query').at(0).text()).toBe('Lettuce');
    expect(findTestDataById('next-query').at(1).text()).toBe('Tomato');

    await setCustomSuggestions(myNextQueries);
    expect(findTestDataById('next-query')).toHaveLength(3);
    expect(findTestDataById('next-query').at(0).text()).toBe('Bread');
    expect(findTestDataById('next-query').at(1).text()).toBe('Meat');
    expect(findTestDataById('next-query').at(2).text()).toBe('Cheese');
  });
});

interface RenderNExtQueriesOptions {
  /** The initial next queries to render. */
  nextQueries?: NextQuery[];
  /**
   * The template to render. Receives the `nextQueries` via prop, and has registered the
   * {@link NextQueries} component.
   */
  template?: string;
}

interface RenderNextQueriesAPI {
  /** The Vue testing utils wrapper for the {@link NextQueries} component. */
  wrapper: Wrapper<Vue>;
  /** The initial list of next queries that are going to be rendered. */
  nextQueries: NextQuery[];
  /**
   * Retrieves the wrapper for the items of the list rendered by the {@link NextQueries}
   * component.
   */
  getNextQueryItems: () => WrapperArray<Vue>;
  /** Find test data in the wrapper for the {@link NextQueries} component. */
  findTestDataById: (testDataId: string) => WrapperArray<Vue>;
  /** Set the custom suggestions prop to the template wrapper. */
  setCustomSuggestions: (suggestions: NextQuery[]) => Promise<void> | void;
}
