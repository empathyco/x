import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { CreateElement, VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import Vuex, { Store } from 'vuex';
import { searchBoxXStoreModule } from '../../x-modules/search-box/store/module';
import { Getter, State } from '../decorators';

@Component
class TestingComponent extends Vue {
  @State('searchBox', 'query')
  public query!: string;
  @Getter('searchBox', 'trimmedQuery')
  public trimmedQuery!: string;

  render(createElement: CreateElement): VNode {
    return createElement();
  }
}

describe('testing decorators to map store getters and state', () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let component: Wrapper<TestingComponent>;

  beforeEach(() => {
    component = mount(TestingComponent, {
      localVue,
      store: new Store({
        modules: {
          x: {
            namespaced: true,
            modules: {
              searchBox: { namespaced: true, ...searchBoxXStoreModule }
            }
          }
        }
      })
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
