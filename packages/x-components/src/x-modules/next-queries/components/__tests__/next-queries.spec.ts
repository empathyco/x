import { DeepPartial } from '@empathyco/x-utils';
import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils';
import { Store } from 'vuex';
import { NextQuery } from '@empathyco/x-types';
import { nextTick } from 'vue';
import { createNextQueryStub, getNextQueriesStub } from '../../../../__stubs__';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import NextQueries from '../next-queries.vue';
import { default as NextQueryComponent } from '../next-query.vue';
import { nextQueriesXModule } from '../../x-module';
import { resetXNextQueriesStateWith } from './utils';

describe('testing next queries component', () => {
  function renderNextQueries({
    nextQueries = getNextQueriesStub(),
    template = '<NextQueries :suggestions="customSuggestions"/>'
  }: RenderNExtQueriesOptions = {}): RenderNextQueriesAPI {
    const store = new Store<DeepPartial<RootXStoreState>>({});

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
        global: { plugins: [installNewXPlugin({ store, initialXModules: [nextQueriesXModule] })] },
        store,
        props: { nextQueries, customSuggestions: null }
      }
    );

    resetXNextQueriesStateWith(store, { nextQueries });

    const findTestDataById = (testDataId: string): DOMWrapper<Element>[] =>
      wrapperTemplate.findAll(getDataTestSelector(testDataId));

    return {
      wrapper: wrapperTemplate.findComponent(NextQueries),
      wrapperTemplate,
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

    getNextQueryItems().forEach((nextQueryItemWrapper, index) => {
      expect(nextQueryItemWrapper.text()).toEqual(nextQueries[index].query);
    });
  });

  //eslint-disable-next-line max-len
  it('renders a span, an image & a highlighting icon overriding the default Next Query content', async () => {
    const { nextQueries, findTestDataById, wrapperTemplate } = renderNextQueries({
      template: `
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
      `
    });

    await nextTick();

    nextQueries[0].isCurated = true;
    const eventSpansList = findTestDataById('query');
    const iconsList = findTestDataById('icon');
    let highlightIconList = findTestDataById('next-query-highlight');

    nextQueries.forEach((nextQuery, index) => {
      expect(eventSpansList.at(index)?.element.innerHTML).toEqual(nextQuery.query);
      expect(eventSpansList.at(index)?.element.getAttribute('data-index')).toEqual(`${index}`);
      expect(highlightIconList.at(index)?.find('img').exists()).toBe(false);
      expect(iconsList.at(index)).toBeDefined();
    });

    await wrapperTemplate.setProps({ highlightCurated: true });
    highlightIconList = findTestDataById('next-query-highlight');

    nextQueries.forEach(async (nextQuery, index) => {
      await nextTick();
      expect(highlightIconList.at(index)?.find('img'))?.toBe(!!nextQuery.isCurated);
    });
  });

  it('renders a button, a highlighting icon & a custom Next Query', async () => {
    const { wrapper, nextQueries, findTestDataById, wrapperTemplate } = renderNextQueries({
      template: `
        <NextQueries>
          <template #suggestion="{ suggestion, highlightCurated, index }">
            <NextQuery :suggestion="suggestion"
                       :highlightCurated="highlightCurated">
              <template #default="{ shouldHighlightCurated }">
                <span data-test="next-query-highlight">
                  <img
                    src="./chevron-icon.svg"
                    v-if="shouldHighlightCurated"
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
      `
    });

    expect(wrapper.findComponent(NextQueryComponent)).toBeDefined();

    nextQueries[0].isCurated = true;
    await nextTick();
    const eventSpansList = findTestDataById('query');
    const iconsList = findTestDataById('icon');
    const customButtonList = findTestDataById('custom-button');
    let highlightIconList = findTestDataById('next-query-highlight');

    nextQueries.forEach((nextQuery, index) => {
      expect(eventSpansList.at(index)?.element.innerHTML).toEqual(nextQuery.query);
      expect(eventSpansList.at(index)?.element.getAttribute('data-index')).toEqual(`${index}`);
      expect(iconsList.at(index)).toBeDefined();
      expect(customButtonList.at(index)).toBeDefined();
      expect(highlightIconList.at(index)?.find('img').exists()).toBe(false);
    });

    await wrapperTemplate.setProps({ highlightCurated: true });
    highlightIconList = findTestDataById('next-query-highlight');

    nextQueries.forEach((nextQuery, index) => {
      expect(highlightIconList.at(index)?.find('img').exists()).toBe(!!nextQuery.isCurated);
    });
  });

  it('does not render any NextQuery if the are none', () => {
    const { wrapper } = renderNextQueries({
      nextQueries: []
    });

    expect(wrapper.find('x-next-queries').exists()).toBe(false);
  });

  it('renders at most the number of NextQuery defined by `maxItemsToRender` prop', async () => {
    const { nextQueries, findTestDataById, wrapperTemplate } = renderNextQueries();

    await wrapperTemplate.setProps({ maxItemsToRender: 2 });
    expect(findTestDataById('next-query')).toHaveLength(2);

    await wrapperTemplate.setProps({ maxItemsToRender: 3 });
    expect(findTestDataById('next-query')).toHaveLength(3);

    await wrapperTemplate.setProps({ maxItemsToRender: 5 });
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

    await nextTick();

    expect(findTestDataById('next-query')).toHaveLength(2);
    expect(findTestDataById('next-query').at(0)?.text()).toBe('Lettuce');
    expect(findTestDataById('next-query').at(1)?.text()).toBe('Tomato');

    await setCustomSuggestions(myNextQueries);
    expect(findTestDataById('next-query')).toHaveLength(3);
    expect(findTestDataById('next-query').at(0)?.text()).toBe('Bread');
    expect(findTestDataById('next-query').at(1)?.text()).toBe('Meat');
    expect(findTestDataById('next-query').at(2)?.text()).toBe('Cheese');
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
  wrapper: VueWrapper;
  wrapperTemplate: VueWrapper;
  /** The initial list of next queries that are going to be rendered. */
  nextQueries: NextQuery[];
  /**
   * Retrieves the wrapper for the items of the list rendered by the {@link NextQueries}
   * component.
   */
  getNextQueryItems: () => DOMWrapper<Element>[];
  /** Find test data in the wrapper for the {@link NextQueries} component. */
  findTestDataById: (testDataId: string) => DOMWrapper<Element>[];
  /** Set the custom suggestions prop to the template wrapper. */
  setCustomSuggestions: (suggestions: NextQuery[]) => Promise<void> | void;
}
