import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { HistoryQuery } from '@empathyco/x-types';
import { RootXStoreState } from '../../../../store/store.types';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { historyQueriesXModule } from '../../x-module';
import HistoryQueriesSwitch from '../history-queries-switch.vue';
import { createHistoryQueries } from '../../../../__stubs__/index';
import { resetXHistoryQueriesStateWith } from './utils';

function renderHistoryQueriesSwitch({
  historyQueries = createHistoryQueries('jacket', 'tshirt'),
  isEnabled = false
}: HistoryQueriesSwitchOptions = {}): HistoryQueriesSwitchAPI {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store, initialXModules: [historyQueriesXModule] }, localVue);
  resetXHistoryQueriesStateWith(store, { isEnabled, historyQueries });

  const wrapper = mount(HistoryQueriesSwitch, {
    localVue,
    store
  });

  return {
    wrapper
  };
}

describe('testing HistoryQueriesSwitch component', () => {
  it('is an XComponent which has an XModule', () => {
    const { wrapper } = renderHistoryQueriesSwitch();

    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('historyQueries');
  });

  it('should emit proper events when toggling its state', () => {
    const { wrapper } = renderHistoryQueriesSwitch();
    const enableListener = jest.fn();
    const disableListener = jest.fn();

    wrapper.vm.$x.on('UserClickedEnableHistoryQueries').subscribe(enableListener);
    wrapper.vm.$x.on('UserClickedDisableHistoryQueries').subscribe(disableListener);

    wrapper.trigger('click');

    expect(enableListener).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$store.state.x.historyQueries.isEnabled).toBe(true);

    wrapper.trigger('click');

    expect(disableListener).toHaveBeenCalledTimes(1);
  });

  it('should emit confirm disable event if there are not history queries', async () => {
    const { wrapper } = renderHistoryQueriesSwitch({
      historyQueries: [],
      isEnabled: true
    });
    const listener = jest.fn();
    wrapper.vm.$x.on('UserClickedConfirmDisableHistoryQueries').subscribe(listener);

    wrapper.trigger('click');

    await new Promise(resolve => setTimeout(resolve));

    expect(listener).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$store.state.x.historyQueries.isEnabled).toBe(false);
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
  wrapper: Wrapper<Vue>;
}
