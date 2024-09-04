import { DeepPartial } from '@empathyco/x-utils';
import { mount } from '@vue/test-utils';
import { Store } from 'vuex';
import { nextTick } from 'vue';
import { HistoryQuery } from '@empathyco/x-types';
import { RootXStoreState } from '../../../../store/store.types';
import { installNewXPlugin } from '../../../../__tests__/utils';
import ClearHistoryQueries from '../clear-history-queries.vue';
import { XPlugin } from '../../../../plugins/x-plugin';
import { XDummyBus } from '../../../../__tests__/bus.dummy';
import { historyQueriesXModule } from '../../x-module';
import { resetXHistoryQueriesStateWith } from './utils';

const bus = new XDummyBus();
function renderClearHistoryQueries({
  historyQueries = [],
  template = '<ClearHistoryQueries v-bind="$attrs" />'
}: RenderHistoryQueriesOptions) {
  const store = new Store<DeepPartial<RootXStoreState>>({});

  const clearHistoryQueries = mount(
    {
      template,
      components: {
        ClearHistoryQueries
      }
    },
    {
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [historyQueriesXModule] }, bus)]
      },
      store
    }
  );
  resetXHistoryQueriesStateWith(store, { historyQueries });

  return {
    clearHistoryQueries
  };
}

describe('testing ClearHistoryQueries component', () => {
  it('is disabled if there are not history queries', () => {
    const { clearHistoryQueries } = renderClearHistoryQueries({ historyQueries: [] });

    expect(clearHistoryQueries.attributes().disabled).toEqual('disabled');
    /*const { clearHistoryQueries } = renderClearHistoryQueries({
      historyQueries: [
        {
          query: 'I want BBQ',
          modelName: 'HistoryQuery',
          timestamp: 0
        }
      ]
    });
    expect(clearHistoryQueries.attributes()).not.toHaveProperty('disabled');*/
  });

  it('emits UserPressedClearHistoryQueries when clicked', async () => {
    const { clearHistoryQueries } = renderClearHistoryQueries({
      historyQueries: [
        {
          query: 'I want BBQ',
          modelName: 'HistoryQuery',
          timestamp: 0
        }
      ]
    });
    const listener = jest.fn();
    XPlugin.bus.on('UserPressedClearHistoryQueries', true).subscribe(listener);

    await nextTick();

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
    const { clearHistoryQueries } = renderClearHistoryQueries({});

    expect(clearHistoryQueries.vm.$el.textContent).toEqual('✕');
  });

  it('has a default slot to customize its contents', () => {
    const { clearHistoryQueries } = renderClearHistoryQueries({
      template: `<ClearHistoryQueries v-bind="$attrs" >
                    <span class="x-clear-history-queries__text">Clear</span>
                 </ClearHistoryQueries>`
    });

    expect(clearHistoryQueries.find('.x-clear-history-queries__text').exists()).toBe(true);
    expect(clearHistoryQueries.find('.x-clear-history-queries__text').text()).toEqual('Clear');
  });
});

interface RenderHistoryQueriesOptions {
  /** The suggestions list to render. */
  historyQueries?: HistoryQuery[];
  /** The template to render. */
  template?: string;
}
