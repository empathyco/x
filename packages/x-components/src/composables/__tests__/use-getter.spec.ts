import { defineComponent } from 'vue';
import Vuex, { Store } from 'vuex';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import { installNewXPlugin } from '../../__tests__/utils';
import { useGetter } from '../use-getter';
import { historyQueriesXStoreModule } from '../../x-modules/history-queries';

const TestComponent = defineComponent({
  setup() {
    const historyQueriesGetter = useGetter('historyQueries', ['storageKey', 'historyQueries']);
    return {
      historyQueriesGetter
    };
  }
});

describe('testing useState composable', () => {
  let component: Wrapper<any>;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    component?.vm.$destroy();
    jest.clearAllMocks();
    const localVue = createLocalVue();
    localVue.use(Vuex);

    const store = new Store({
      modules: {
        x: {
          namespaced: true,
          modules: {
            historyQueries: { namespaced: true, ...historyQueriesXStoreModule } as any
          }
        }
      }
    });
    installNewXPlugin({ store }, localVue);

    component = mount(TestComponent, {
      localVue,
      store
    });
  });

  it('maps store state', () => {
    expect(component.vm.historyQueriesGetter.storageKey.value).toEqual('history-queries');
    expect(component.vm.historyQueriesGetter.historyQueries.value).toHaveLength(0);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    component.vm.$store.dispatch('x/historyQueries/addQueryToHistory', 'chorizo');

    expect(component.vm.historyQueriesGetter.historyQueries.value).toHaveLength(1);
  });
});
