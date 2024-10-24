import { DeepPartial } from '@empathyco/x-utils';
import { HistoryQuery } from '@empathyco/x-types';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
import { Store } from 'vuex';
import { RootXStoreState } from '../../../../store/store.types';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { historyQueriesXModule } from '../../x-module';
import HistoryQueriesSwitch from '../history-queries-switch.vue';
import { createHistoryQueries } from '../../../../__stubs__/index';
import { XPlugin } from '../../../../plugins/x-plugin';
import { resetXHistoryQueriesStateWith } from './utils';

async function renderHistoryQueriesSwitch({
  historyQueries = createHistoryQueries('jacket', 'tshirt'),
  isEnabled = false
}: HistoryQueriesSwitchOptions = {}): Promise<HistoryQueriesSwitchAPI> {
  const store = new Store<DeepPartial<RootXStoreState>>({});

  const wrapper = mount(HistoryQueriesSwitch, {
    global: {
      plugins: [installNewXPlugin({ store, initialXModules: [historyQueriesXModule] })]
    }
  });

  resetXHistoryQueriesStateWith(store, { isEnabled, historyQueries });
  await nextTick();

  return {
    wrapper
  };
}

describe('testing HistoryQueriesSwitch component', () => {
  it('is an XComponent which has an XModule', async () => {
    const { wrapper } = await renderHistoryQueriesSwitch();

    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('historyQueries');
  });

  it('should emit proper events when toggling its state', async () => {
    const { wrapper } = await renderHistoryQueriesSwitch();
    const enableListener = jest.fn();
    const disableListener = jest.fn();

    XPlugin.bus.on('UserClickedEnableHistoryQueries').subscribe(enableListener);
    XPlugin.bus.on('UserClickedDisableHistoryQueries').subscribe(disableListener);

    wrapper.trigger('click');

    expect(enableListener).toHaveBeenCalledTimes(1);
    expect(XPlugin.store.state.x.historyQueries.isEnabled).toBe(true);

    wrapper.trigger('click');

    expect(disableListener).toHaveBeenCalledTimes(1);
  });

  it('should emit confirm disable event if there are not history queries', async () => {
    const { wrapper } = await renderHistoryQueriesSwitch({
      historyQueries: [],
      isEnabled: true
    });
    const listener = jest.fn();
    XPlugin.bus.on('UserClickedConfirmDisableHistoryQueries').subscribe(listener);

    wrapper.trigger('click');
    await flushPromises();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(XPlugin.store.state.x.historyQueries.isEnabled).toBe(false);
  });
});

/**
 * Test options for the {@link HistoryQueriesSwitch} component.
 */
interface HistoryQueriesSwitchOptions {
  /** The History Queries to set in the state. */
  historyQueries?: HistoryQuery[];
  /** Initial state of the switch. */
  isEnabled?: boolean;
}

/**
 * Test API for the {@link HistoryQueriesSwitch} component.
 */
interface HistoryQueriesSwitchAPI {
  /** The wrapper for HistoryQueriesSwitch component. */
  wrapper: VueWrapper;
}
