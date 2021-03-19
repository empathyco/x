import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { CreateElement, VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import Vuex, { Store } from 'vuex';
import { installNewXPlugin } from '../../../__tests__/utils';
import { searchBoxXStoreModule } from '../../../x-modules/search-box/store/module';
import { searchBoxXModule } from '../../../x-modules/search-box/x-module';
import { xComponentMixin } from '../../x-component.mixin';
import { Getter, State } from '../store.decorators';

@Component({
  mixins: [xComponentMixin(searchBoxXModule)]
})
class TestingComponent extends Vue {
  @State('searchBox', 'query')
  public query!: string;
  @Getter('searchBox', 'trimmedQuery')
  public trimmedQuery!: string;

  render(createElement: CreateElement): VNode {
    return createElement();
  }
}

describe('testing store decorators', () => {
  let component: Wrapper<TestingComponent>;

  beforeEach(() => {
    component?.vm.$destroy();
    jest.clearAllMocks();
    const localVue = createLocalVue();
    localVue.use(Vuex);
    const store = new Store({
      modules: {
        x: {
          namespaced: true,
          modules: {
            searchBox: { namespaced: true, ...searchBoxXStoreModule } as any
          }
        }
      }
    });
    installNewXPlugin({}, localVue);

    component = mount(TestingComponent, {
      localVue,
      store
    });
  });

  it('maps store state', () => {
    expect(component.vm.query).toEqual('');

    component.vm.$store.commit('x/searchBox/setQuery', 'pork shoulder ');

    expect(component.vm.query).toEqual('pork shoulder ');
  });

  it('maps store getters', () => {
    expect(component.vm.trimmedQuery).toEqual('');

    component.vm.$store.commit('x/searchBox/setQuery', 'short ribs ');

    expect(component.vm.trimmedQuery).toEqual('short ribs');
  });
});
