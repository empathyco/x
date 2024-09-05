import { DeepPartial } from '@empathyco/x-utils';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { Store } from 'vuex';
import { XPlugin } from '../../../../plugins';
import { RootXStoreState } from '../../../../store';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { historyQueriesXModule } from '../../x-module';
import ClearHistoryQueries from '../clear-history-queries.vue';
import { resetXHistoryQueriesStateWith } from './utils';

function render() {
  const store = new Store<DeepPartial<RootXStoreState>>({});
  const wrapper = mount(ClearHistoryQueries, {
    global: { plugins: [installNewXPlugin({ store, initialXModules: [historyQueriesXModule] })] }
  });

  return {
    store,
    wrapper
  };
}

describe('testing ClearHistoryQueries component', () => {
  it('is disabled if there are not history queries', async () => {
    const { wrapper, store } = render();

    expect(wrapper.attributes()).toHaveProperty('disabled');

    resetXHistoryQueriesStateWith(store, {
      historyQueries: [
        {
          query: 'I want BBQ',
          modelName: 'HistoryQuery',
          timestamp: 0
        }
      ]
    });
    await nextTick();

    expect(wrapper.attributes()).not.toHaveProperty('disabled');
  });

  it('emits UserPressedClearHistoryQueries when clicked', async () => {
    const { wrapper, store } = render();
    const listener = jest.fn();
    XPlugin.bus.on('UserPressedClearHistoryQueries', true).subscribe(listener);

    resetXHistoryQueriesStateWith(store, {
      historyQueries: [
        {
          query: 'I want BBQ',
          modelName: 'HistoryQuery',
          timestamp: 0
        }
      ]
    });

    await nextTick();
    await wrapper.trigger('click');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({
      eventPayload: undefined,
      metadata: {
        moduleName: 'historyQueries',
        target: wrapper.element,
        location: 'none',
        replaceable: true
      }
    });
  });

  it('has an slot rendering a message by default', () => {
    const { wrapper } = render();

    expect(wrapper.element.textContent).toEqual('✕');
  });

  it('has a default slot to customize its contents', () => {
    const store = new Store<DeepPartial<RootXStoreState>>({});

    const wrapper = mount(ClearHistoryQueries, {
      global: { plugins: [installNewXPlugin({ store, initialXModules: [historyQueriesXModule] })] },
      slots: {
        default: {
          template: '<span class="x-clear-history-queries__text">Clear</span>'
        }
      }
    });
    const renderedSlotHTML = wrapper.element.querySelector('.x-clear-history-queries__text');

    expect(renderedSlotHTML).toBeDefined();
    expect(renderedSlotHTML!.textContent).toEqual('Clear');
  });
});
