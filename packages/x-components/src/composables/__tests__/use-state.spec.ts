import { defineComponent } from 'vue';
import Vuex, { Store } from 'vuex';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import { installNewXPlugin } from '../../__tests__/utils';
import { useState } from '../use-state';
import { searchBoxXStoreModule } from '../../x-modules/search-box/index';
import { AnyXStoreModule } from '../../store/index';

const TestComponent = defineComponent({
  setup() {
    const searchBoxState = useState('searchBox', ['query', 'inputStatus']);
    return {
      searchBoxState
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
            searchBox: { namespaced: true, ...searchBoxXStoreModule } as AnyXStoreModule
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
    expect(component.vm.searchBoxState.query.value).toEqual('');
    expect(component.vm.searchBoxState.inputStatus.value).toEqual('initial');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    component.vm.$store.commit('x/searchBox/setQuery', 'pork shoulder ');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    component.vm.$store.commit('x/searchBox/setInputStatus', 'filled');

    expect(component.vm.searchBoxState.query.value).toEqual('pork shoulder ');
    expect(component.vm.searchBoxState.inputStatus.value).toEqual('filled');
  });
});
