import { HistoryQuery as HistoryQueryModel } from '@empathyco/x-types-old';
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial } from '../../../../utils/types';
import { createHistoryQueries } from '../../../../__stubs__/history-queries-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import HistoryQueries from '../history-queries.vue';
import { resetXHistoryQueriesStateWith } from './utils';

describe('testing history queries component', () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);

  const historyQueries: HistoryQueryModel[] = createHistoryQueries(
    'moura',
    'calamares',
    'rubia galega',
    'pulpo',
    'cachelos',
    'navajas',
    'croquetas',
    'zamburiñas'
  );

  const historyQueriesWrapper = mount(HistoryQueries, {
    localVue,
    store
  });

  beforeEach(() => {
    resetXHistoryQueriesStateWith(store, { historyQueries });
  });

  it('is an XComponent which has an XModule', () => {
    expect(isXComponent(historyQueriesWrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(historyQueriesWrapper.vm)).toEqual('historyQueries');
  });

  it('does not render the component if history is empty', async () => {
    resetXHistoryQueriesStateWith(store, { historyQueries: [] });
    await localVue.nextTick();
    expect(historyQueriesWrapper.html()).toEqual('');
  });

  it('renders all the elements in store if the maxItemsToRender property is not provided', () => {
    const historyQueryItemWrapper = findAllInWrapper('history-query-item');
    expect(historyQueryItemWrapper).toHaveLength(historyQueries.length);
  });

  it('limits the number of rendered elements by the maxItemsToRender config property', async () => {
    await historyQueriesWrapper.setProps({ maxItemsToRender: 2 });
    const historyQueryItemWrapper = findAllInWrapper('history-query-item');
    expect(historyQueryItemWrapper).toHaveLength(2);
  });

  describe('test changing history query content', () => {
    it('allows changing history query content using scopedSlots', () => {
      const customWrapper = mount(HistoryQueries, {
        localVue,
        store,
        scopedSlots: {
          ['suggestion-content']:
            '<strong data-test="suggestion-content">{{ props.suggestion.query }}</strong>',
          ['suggestion-remove-content']: '<img data-test="suggestion-remove-content" />'
        }
      });
      const suggestionContentWrappers = findAllInWrapper('suggestion-content', customWrapper);
      const suggestionRemoveWrappers = findAllInWrapper('suggestion-remove-content', customWrapper);

      expect(suggestionContentWrappers).toHaveLength(historyQueries.length);
      expect(suggestionRemoveWrappers).toHaveLength(historyQueries.length);
    });

    it('allows changing history query content using docs example as template', () => {
      const wrapperComponent = {
        template: `
          <HistoryQueries>
            <template #suggestion-content="suggestionContentScope">
              <img src="./history-icon.svg" data-test="suggestion-history-icon"/>
              <span :data-index="suggestionContentScope.index"
                    v-html="suggestionContentScope.queryHTML"></span>
            </template>
            <template #suggestion-remove-content>
              <img src="./remove-icon.svg" data-test="suggestion-remove-icon"/>
            </template>
          </HistoryQueries>
        `,
        components: {
          HistoryQueries
        }
      };
      const customWrapper = mount(wrapperComponent, {
        localVue,
        store
      });
      const suggestionContentWrappers = findAllInWrapper('suggestion-history-icon', customWrapper);
      const suggestionRemoveWrappers = findAllInWrapper('suggestion-remove-icon', customWrapper);

      expect(suggestionContentWrappers).toHaveLength(historyQueries.length);
      expect(suggestionRemoveWrappers).toHaveLength(historyQueries.length);
    });
  });

  it('allows to change HistoryQuery component', () => {
    const customWrapper = mount(HistoryQueries, {
      localVue,
      store,
      scopedSlots: {
        suggestion:
          '<span data-test="suggestion-mock-component">{{ props.suggestion.query }}</span>'
      }
    });
    const historyQueriesWrapper = findAllInWrapper('suggestion-mock-component', customWrapper);

    expect(historyQueriesWrapper).toHaveLength(historyQueries.length);
  });

  function findAllInWrapper(
    selector: string,
    wrapper: Wrapper<Vue> = historyQueriesWrapper
  ): WrapperArray<Vue> {
    return wrapper.findAll(getDataTestSelector(selector));
  }
});
