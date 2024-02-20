import { ComputedRef, defineComponent } from 'vue';
import Vuex, { Store } from 'vuex';
import { createLocalVue, mount } from '@vue/test-utils';
import { Dictionary } from '@empathyco/x-utils';
import { installNewXPlugin } from '../../__tests__/utils';
import { useState } from '../use-state';
import { searchBoxXStoreModule } from '../../x-modules/search-box/index';
import { AnyXStoreModule } from '../../store/index';
import { ExtractState } from '../../x-modules/x-modules.types';

const renderUseStateTest = (modulePropertyPaths: string[]): renderUseStateTestAPI => {
  const testComponent = defineComponent({
    setup() {
      const searchBoxState = useState(
        'searchBox',
        modulePropertyPaths as (keyof ExtractState<'searchBox'>)[]
      );
      return {
        searchBoxState
      };
    }
  });

  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store = new Store({
    modules: {
      x: {
        namespaced: true,
        modules: {
          searchBox: { namespaced: true, ...searchBoxXStoreModule } as AnyXStoreModule
        }
      }
    }
  });
  installNewXPlugin({ store }, localVue);

  const wrapper = mount(testComponent, {
    localVue,
    store
  });

  return {
    searchBoxState: (wrapper.vm as any).searchBoxState,
    store
  };
};

describe('testing useState composable', () => {
  it('maps store state', () => {
    const { searchBoxState, store } = renderUseStateTest(['query', 'inputStatus']);
    expect(searchBoxState.query.value).toEqual('');
    expect(searchBoxState.inputStatus.value).toEqual('initial');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    store.commit('x/searchBox/setQuery', 'pork shoulder ');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    store.commit('x/searchBox/setInputStatus', 'filled');

    expect(searchBoxState.query.value).toEqual('pork shoulder ');
    expect(searchBoxState.inputStatus.value).toEqual('filled');
  });

  it('does not return not requested state properties', () => {
    const { searchBoxState } = renderUseStateTest(['query']);
    expect(searchBoxState.query).toBeDefined();
    expect(searchBoxState.inputStatus).toBeUndefined();
  });
});

type renderUseStateTestAPI = {
  searchBoxState: Dictionary<ComputedRef<string[]>>;
  store: Store<any>;
};
