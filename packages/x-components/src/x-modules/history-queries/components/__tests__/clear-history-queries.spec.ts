import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { RootXStoreState } from '../../../../store/store.types';
import { installNewXPlugin } from '../../../../__tests__/utils';
import ClearHistoryQueries from '../clear-history-queries.vue';
import { resetXHistoryQueriesStateWith } from './utils';

describe('testing ClearHistoryQueries component', () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);

  beforeEach(() => {
    resetXHistoryQueriesStateWith(store);
  });

  it('is disabled if there are not history queries', async () => {
    const clearHistoryQueries = mount(ClearHistoryQueries, { localVue, store });

    expect(clearHistoryQueries.attributes().disabled).toEqual('disabled');

    resetXHistoryQueriesStateWith(store, {
      historyQueries: [
        {
          query: 'I want BBQ',
          modelName: 'HistoryQuery',
          timestamp: 0
        }
      ]
    });
    await localVue.nextTick();
    expect(clearHistoryQueries.attributes()).not.toHaveProperty('disabled');
  });

  it('emits UserPressedClearHistoryQueries when clicked', async () => {
    const listener = jest.fn();
    const clearHistoryQueries = mount(ClearHistoryQueries, { localVue, store });
    clearHistoryQueries.vm.$x.on('UserPressedClearHistoryQueries', true).subscribe(listener);
    resetXHistoryQueriesStateWith(store, {
      historyQueries: [
        {
          query: 'I want BBQ',
          modelName: 'HistoryQuery',
          timestamp: 0
        }
      ]
    });

    await localVue.nextTick();
    clearHistoryQueries.trigger('click');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({
      eventPayload: undefined,
      metadata: {
        moduleName: 'historyQueries',
        target: clearHistoryQueries.element,
        location: 'none',
        replaceable: true
      }
    });
  });

  it('has an slot rendering a message by default', () => {
    const clearHistoryQueries = mount(ClearHistoryQueries, {
      localVue,
      store
    });

    expect(clearHistoryQueries.vm.$el.textContent).toEqual('✕');
  });

  it('has a default slot to customize its contents', () => {
    const clearHistoryQueries = mount(ClearHistoryQueries, {
      localVue,
      store,
      slots: {
        default: {
          template: '<span class="x-clear-history-queries__text">Clear</span>'
        }
      }
    });
    const renderedSlotHTML = clearHistoryQueries.element.querySelector(
      '.x-clear-history-queries__text'
    );

    expect(renderedSlotHTML).toBeDefined();
    expect(renderedSlotHTML!.textContent).toEqual('Clear');
  });
});
