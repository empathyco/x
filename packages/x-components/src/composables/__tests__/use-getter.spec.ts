import { ComputedRef, defineComponent } from 'vue';
import Vuex, { Store } from 'vuex';
import { createLocalVue, mount } from '@vue/test-utils';
import { Dictionary } from '@empathyco/x-utils';
import { installNewXPlugin } from '../../__tests__/utils';
import { useGetter } from '../use-getter';
import { historyQueriesXStoreModule } from '../../x-modules/history-queries';
import { AnyXStoreModule } from '../../store/index';
import { ExtractGetters } from '../../x-modules/x-modules.types';

const renderUseGetterTest = (getters: string[]): renderUseGetterTestAPI => {
  const testComponent = defineComponent({
    setup() {
      const historyQueriesGetter = useGetter(
        'historyQueries',
        getters as (keyof ExtractGetters<'historyQueries'>)[]
      );
      return {
        historyQueriesGetter
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
          historyQueries: { namespaced: true, ...historyQueriesXStoreModule } as AnyXStoreModule
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
    store,
    historyQueriesGetter: (wrapper.vm as any).historyQueriesGetter
  };
};

describe('testing useGetter composable', () => {
  it('maps store getters', () => {
    const { historyQueriesGetter, store } = renderUseGetterTest(['storageKey', 'historyQueries']);
    expect(historyQueriesGetter.storageKey.value).toEqual('history-queries');
    expect(historyQueriesGetter.historyQueries.value).toHaveLength(0);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    store.dispatch('x/historyQueries/addQueryToHistory', 'chorizo');

    expect(historyQueriesGetter.historyQueries.value).toHaveLength(1);
  });

  it('does not return not requested getters', () => {
    const { historyQueriesGetter } = renderUseGetterTest(['storageKey']);
    expect(historyQueriesGetter.storageKey).toBeDefined();
    expect(historyQueriesGetter.historyQueries).toBeUndefined();
  });
});

type renderUseGetterTestAPI = {
  historyQueriesGetter: Dictionary<ComputedRef<string[]>>;
  store: Store<any>;
};
