import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { ComponentOptions } from 'vue';
import Vuex, { Store } from 'vuex';
import { XPlugin } from '../../plugins/x-plugin';
import { RootXStoreState } from '../../store/store.types';
import { SearchBoxConfig } from '../../x-modules/search-box/config.types';
import { searchBoxXModule } from '../../x-modules/search-box/x-module';
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
  localVue.use(XPlugin, { store });

  beforeEach(() => {
    jest.resetModules().clearAllMocks();
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

  describe('testing XComponentMixin saving config props to store', () => {
    it('syncs immediately the configuration', () => {
      mount(xComponent, {
        localVue,
        store,
        propsData: {
          maxLength: 47
        } as Partial<SearchBoxConfig>
      });

      expect(store.state.x.searchBox.config).toMatchObject({
        maxLength: 47
      });
    });

    it('creates a prop for each config option in the store module', () => {
      xComponentWrapper.setProps({
        maxLength: 100,
        autoComplete: true
      } as Partial<SearchBoxConfig>);

      expect(xComponentWrapper.vm.$props.maxLength).toEqual(100);
      expect(xComponentWrapper.vm.$props.autoComplete).toEqual(true);
    });

    it('keeps the value of the configuration synced between the props and the store', () => {
      xComponentWrapper.setProps({
        maxLength: 69,
        autoComplete: true
      } as Partial<SearchBoxConfig>);

      expect(store.state.x.searchBox.config).toMatchObject({
        maxLength: 69,
        autoComplete: true
      });
    });

    it('allows passing a list of config keys to override the generated props', () => {
      const customComponent = mount(
        {
          mixins: [
            xComponentMixin(searchBoxXModule, {
              configPropsNames: ['allowVeganQueries']
            })
          ],
          render: h => h()
        },
        { localVue, store }
      );

      customComponent.setProps({
        autoComplete: true,
        allowVeganQueries: false
      } as Partial<SearchBoxConfig>);

      expect(customComponent.vm.$props.allowVeganQueries).toEqual(false);
      expect(customComponent.vm.$props.autoComplete).not.toBeDefined();
    });

    it(
      'allows the component to define a "setConfig" method which will be called instead of' +
        ' directly committing to the store',
      () => {
        const setConfig = jest.fn();
        const customComponent = mount(
          {
            mixins: [xComponentMixin(searchBoxXModule)],
            render: h => h(),
            methods: {
              setConfig
            }
          },
          { localVue, store }
        );

        expect(setConfig).not.toHaveBeenCalled();

        customComponent.setProps({ maxLength: 33 });

        expect(setConfig).toHaveBeenCalledWith('maxLength', 33);
      }
    );
  });
});
