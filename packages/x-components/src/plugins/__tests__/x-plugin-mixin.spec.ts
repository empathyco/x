import { mount, shallowMount, Wrapper } from '@vue/test-utils';
import { ComponentOptions, CreateElement, VNode, default as Vue } from 'vue';
import { Component } from 'vue-property-decorator';
import { installNewXPlugin } from '../../__tests__/utils';
import { xComponentMixin } from '../../components/x-component.mixin';
import { searchBoxXModule } from '../../x-modules/search-box/x-module';

describe('testing $x component API global mixin', () => {
  const component: ComponentOptions<Vue> & ThisType<Vue> = {
    render(createElement) {
      return createElement();
    }
  };

  let localVue: typeof Vue;
  let componentInstance: Wrapper<Vue>;

  beforeEach(() => {
    [, localVue] = installNewXPlugin();
    componentInstance = shallowMount(component, { localVue });
  });

  afterEach(() => {
    componentInstance.destroy();
    jest.clearAllMocks();
  });

  describe('testing origin', () => {
    it('includes "default" origin in the $x.emit metadata', () => {
      const listener = jest.fn();

      componentInstance.vm.$x.on('UserIsTypingAQuery', true).subscribe(listener);
      componentInstance.vm.$x.emit('UserIsTypingAQuery', 'So awesome, much quality, such skill');

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith({
        eventPayload: 'So awesome, much quality, such skill',
        metadata: { moduleName: null }
      });
    });

    it('overrides the origin in the $x.emit metadata', () => {
      const listener = jest.fn();

      @Component({
        template: `<div><slot/></div>`,
        provide: {
          origin: 'origin-test'
        }
      })
      class Provider extends Vue {}

      @Component({
        mixins: [xComponentMixin(searchBoxXModule)]
      })
      class Injecter extends Vue {
        render(createElement: CreateElement): VNode {
          return createElement();
        }
      }

      const wrapper = mount(
        {
          template: `<Provider><Injecter /></Provider>`,
          components: {
            Provider,
            Injecter
          }
        } as ComponentOptions<any> & ThisType<Vue>,
        {
          localVue
        }
      );

      wrapper
        .findComponent(Injecter)
        .vm.$x.emit('UserIsTypingAQuery', 'So awesome, much quality, such skill');
      componentInstance.vm.$x.on('UserIsTypingAQuery', true).subscribe(listener);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith({
        eventPayload: 'So awesome, much quality, such skill',
        metadata: { moduleName: 'searchBox', origin: 'origin-test' }
      });
    });
  });

  it('allows emitting and subscribing to events via $x object', () => {
    const listener = jest.fn();

    componentInstance.vm.$x.on('UserIsTypingAQuery').subscribe(listener);
    componentInstance.vm.$x.emit('UserIsTypingAQuery', 'So awesome, much quality, such skill');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('So awesome, much quality, such skill');
  });

  it('emits the event metadata', () => {
    const listener = jest.fn();
    const testTarget = document.createElement('div');

    const emitterComponent: ComponentOptions<any> & ThisType<Vue> = {
      mounted() {
        this.$x.emit('UserIsTypingAQuery', 'Sexy Lego', { target: testTarget });
      },
      render(createElement) {
        return createElement('input');
      }
    };

    mount(
      {
        mixins: [xComponentMixin(searchBoxXModule)],
        created() {
          this.$x.on('UserIsTypingAQuery', true).subscribe(listener);
        },
        render(createElement) {
          return createElement(emitterComponent);
        }
      } as ComponentOptions<any> & ThisType<Vue>,
      { localVue }
    );

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({
      eventPayload: 'Sexy Lego',
      metadata: { moduleName: 'searchBox', target: testTarget }
    });
  });

  it('smart components emits the event metadata', () => {
    const listener = jest.fn();
    const testTarget = document.createElement('div');
    mount(
      {
        mixins: [xComponentMixin(searchBoxXModule)],
        created() {
          this.$x.on('UserIsTypingAQuery', true).subscribe(listener);
        },
        mounted() {
          this.$x.emit('UserIsTypingAQuery', 'Sexy Lego', { target: testTarget });
        },
        render(createElement) {
          return createElement('input');
        }
      } as ComponentOptions<any> & ThisType<Vue>,
      { localVue }
    );
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({
      eventPayload: 'Sexy Lego',
      metadata: { moduleName: 'searchBox', target: testTarget }
    });
  });

  it('finds the root x-component and emits the bus events as Vue events', () => {
    const listener = jest.fn();
    const emitterComponent: ComponentOptions<any> & ThisType<Vue> = {
      mixins: [xComponentMixin(searchBoxXModule)], // Flag it as x-component
      mounted() {
        this.$x.emit('UserIsTypingAQuery', 'Sexy Playmobil');
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
              UserIsTypingAQuery: listener
            }
          });
        }
      },
      { localVue }
    );

    expect(listener).toHaveBeenCalledTimes(1);
  });
});
