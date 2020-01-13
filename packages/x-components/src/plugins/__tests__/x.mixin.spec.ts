import { createLocalVue, mount, shallowMount, Wrapper } from '@vue/test-utils';
import { ComponentOptions, default as Vue } from 'vue';
import { CreateXComponentAPIMixin } from '../x.mixin';

const component: ComponentOptions<Vue> & ThisType<Vue> = {
  render(createElement) {
    return createElement();
  }
};
let componentInstance: Wrapper<Vue>;

const localVue = createLocalVue();
localVue.mixin(CreateXComponentAPIMixin);

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

it('emits X events as Vue events', () => {
  const listener = jest.fn();
  const emitterComponent: ComponentOptions<any> & ThisType<Vue> = {
    mounted() {
      this.$x.emit('UserTyped', 'Sexy Playmobil');
    },
    render(createElement) {
      return createElement('h1');
    }
  };
  mount({
    render(createElement) {
      return createElement(emitterComponent, {
        on: {
          UserTyped: listener
        }
      });
    }
  }, { localVue });

  expect(listener).toHaveBeenCalledTimes(1);
});
