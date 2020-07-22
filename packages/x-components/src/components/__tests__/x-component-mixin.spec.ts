import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { ComponentOptions } from 'vue';
import Vuex, { Store } from 'vuex';
import { RootXStoreState } from '../../store/store.types';
import { searchBoxXModule } from '../../x-modules/search-box/x-module';
import { installNewXPlugin } from '../../__tests__/utils';
import { xComponentMixin } from '../x-component.mixin';
import { isXComponent } from '../x-component.utils';

describe('testing XComponent Mixin', () => {
  const xComponent: ComponentOptions<Vue> = {
    mixins: [xComponentMixin(searchBoxXModule)],
    render: h => h()
  };
  let xComponentWrapper: Wrapper<Vue>;
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store: Store<RootXStoreState> = new Store({});
  installNewXPlugin({ store }, localVue);

  beforeEach(() => {
    xComponentWrapper = mount(xComponent, { localVue, store });
  });

  describe('testing XComponentMixin initializing a component as an XComponent', () => {
    it('registers the x-module', () => {
      expect(store.state.x.searchBox).toBeDefined();
    });

    it('flags components as x-components', () => {
      const normalComponentWrapper = mount({
        render: h => h()
      });
      expect(isXComponent(xComponentWrapper.vm)).toEqual(true);
      expect(isXComponent(normalComponentWrapper.vm)).toEqual(false);
    });
  });
});
