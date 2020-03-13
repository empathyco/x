import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { ComponentOptions } from 'vue';
import Vuex, { Store } from 'vuex';
import { XPlugin } from '../../plugins/x-plugin';
import { RootXStoreState } from '../../store/store.types';
import { searchBoxXModule } from '../../x-modules/search-box/x-module';
import { xComponentMixin } from '../x-component.mixin';
import { isXComponent } from '../x-component.utils';

describe('testing XComponent mixin', () => {
  const normalComponent: ComponentOptions<Vue> = {
    render: h => h()
  };
  const xComponent: ComponentOptions<Vue> = {
    mixins: [xComponentMixin(searchBoxXModule)],
    render: h => h()
  };

  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store: Store<RootXStoreState> = new Store({});
  localVue.use(XPlugin, { store });

  let normalComponentWrapper: Wrapper<Vue>;
  let xComponentWrapper: Wrapper<Vue>;
  beforeEach(() => {
    jest.resetModules().clearAllMocks();

    normalComponentWrapper = mount(normalComponent, { localVue, store });
    xComponentWrapper = mount(xComponent, { localVue, store });
  });

  it('registers the x-module', () => {
    expect(store.state.x.searchBox).toBeDefined();
  });

  it('flags components as x-components', () => {
    expect(isXComponent(xComponentWrapper.vm)).toEqual(true);
    expect(isXComponent(normalComponentWrapper.vm)).toEqual(false);
  });
});
