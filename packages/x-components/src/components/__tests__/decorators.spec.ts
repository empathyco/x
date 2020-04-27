import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { CreateElement, VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import Vuex, { Store } from 'vuex';
import { searchBoxXStoreModule } from '../../x-modules/search-box/store/module';
import { installNewXPlugin } from '../../__tests__/utils';
import { Getter, State, XOn } from '../decorators';

const listener = jest.fn();
const createdListener = jest.fn();

@Component
class TestingComponent extends Vue {
  @State('searchBox', 'query')
  public query!: string;
  @Getter('searchBox', 'trimmedQuery')
  public trimmedQuery!: string;

  @XOn('UserAcceptedAQuery')
  testingXOn(payload: string): void {
    listener(this, payload);
  }

  created(): void {
    createdListener(this);
  }

  render(createElement: CreateElement): VNode {
    return createElement();
  }
}

describe('testing decorators', () => {
  let localVue: typeof Vue;
  let component: Wrapper<TestingComponent>;

  beforeEach(() => {
    jest.clearAllMocks();
    localVue = createLocalVue();
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

  afterEach(() => {
    component.vm.$destroy();
  });

  describe('testing map state and getter', () => {
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

  describe(`testing ${XOn.name} decorator`, () => {
    it('calls original created hook', () => {
      expect(createdListener).toHaveBeenCalledWith(component.vm);
    });

    it('subscribes to the event', () => {
      component.vm.$x.emit('UserAcceptedAQuery', 'algo grasioso');

      expect(listener).toHaveBeenCalled();
      expect(listener).toHaveBeenCalledWith(component.vm, 'algo grasioso');
    });

    it('un-subscribes to the event when destroying the component', () => {
      component.vm.$destroy();
      component.vm.$x.emit('UserAcceptedAQuery', 'que pasara que misterios habra');

      expect(listener).not.toHaveBeenCalled();
    });
  });
});
