import { createLocalVue, mount, shallowMount, Wrapper } from '@vue/test-utils';
import { ComponentOptions, default as Vue } from 'vue';
import { xComponentMixin } from '../../components/x-component.mixin';
import { searchBoxXModule } from '../../x-modules/search-box/x-module';
import { createXComponentAPIMixin } from '../x-plugin.mixin';

describe('testing $x component API global mixin', () => {
  const component: ComponentOptions<Vue> & ThisType<Vue> = {
    render(createElement) {
      return createElement();
    }
  };
  let componentInstance: Wrapper<Vue>;

  const localVue = createLocalVue();
  localVue.mixin(createXComponentAPIMixin);

  beforeEach(() => {
    componentInstance = shallowMount(component, { localVue });
  });

  afterEach(() => {
    componentInstance.destroy();
    jest.clearAllMocks();
  });

  it('allows emitting and subscribing to events via $x object', () => {
    const listener = jest.fn();

    componentInstance.vm.$x.on('UserTyped').subscribe(listener);
    componentInstance.vm.$x.emit('UserTyped', 'So awesome, much quality, such skill');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('So awesome, much quality, such skill');
  });

  it('finds the root x-component and emits the bus events as Vue events', () => {
    const listener = jest.fn();
    const emitterComponent: ComponentOptions<any> & ThisType<Vue> = {
      mixins: [xComponentMixin(searchBoxXModule)], // Flag it as x-component
      mounted() {
        this.$x.emit('UserTyped', 'Sexy Playmobil');
      },
      render(createElement) {
        return createElement('input');
      }
    };

    const parentComponent: ComponentOptions<any> & ThisType<Vue> = {
      mixins: [xComponentMixin(searchBoxXModule)], // Flag it as x-component
      render(createElement) {
        return createElement(emitterComponent);
      }
    };

    mount(
      {
        render(createElement) {
          return createElement(parentComponent, {
            on: {
              UserTyped: listener
            }
          });
        }
      },
      { localVue }
    );

    expect(listener).toHaveBeenCalledTimes(1);
  });
});
