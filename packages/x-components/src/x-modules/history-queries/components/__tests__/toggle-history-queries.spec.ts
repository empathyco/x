import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { RootXStoreState } from '../../../../store/store.types';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { historyQueriesXModule } from '../../x-module';
import ToggleHistoryQueries from '../toggle-history-queries.vue';
import { resetXHistoryQueriesStateWith } from './utils';

function renderToggleHistoryQueries(): ToggleHistoryQueriesAPI {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store, initialXModules: [historyQueriesXModule] }, localVue);
  resetXHistoryQueriesStateWith(store, { isEnabled: false });

  const wrapper = mount(ToggleHistoryQueries, {
    localVue,
    store
  });
  return {
    wrapper: wrapper.findComponent(ToggleHistoryQueries)
  };
}

describe('testing ToggleHistoryQueries component', () => {
  it('is an XComponent which has an XModule', () => {
    const { wrapper } = renderToggleHistoryQueries();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('historyQueries');
  });

  it('should emit proper events when toggling its state', () => {
    const { wrapper } = renderToggleHistoryQueries();

    const toggleListener = jest.fn();
    const disableListener = jest.fn();

    wrapper.vm.$x.on('UserToggledHistoryQueries').subscribe(toggleListener);
    wrapper.vm.$x.on('UserDisableHistoryQueries').subscribe(disableListener);

    wrapper.trigger('click');

    expect(toggleListener).toHaveBeenCalledTimes(1);
    expect(toggleListener).toHaveBeenCalledWith(true);

    wrapper.trigger('click');

    expect(disableListener).toHaveBeenCalledTimes(1);
    expect(disableListener).toHaveBeenCalledWith(undefined);
  });
});

/**
 * Test API for the {@link ToggleHistoryQueries} component.
 */
interface ToggleHistoryQueriesAPI {
  /** The wrapper for toggle history queries component. */
  wrapper: Wrapper<Vue>;
}
