import { mount, shallowMount, Wrapper } from '@vue/test-utils';
import { ComponentOptions, default as Vue } from 'vue';
import { installNewXPlugin } from '../../__tests__/utils';
import { xComponentMixin } from '../../components/x-component.mixin';
import { Feature, FeatureLocation } from '../../types/origin';
import { WireMetadata } from '../../wiring/wiring.types';
import { searchBoxXModule } from '../../x-modules/search-box/x-module';
import { XPlugin } from '../x-plugin';

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
    interface RenderOriginComponentOptions {
      feature?: Feature;
      location?: FeatureLocation;
    }

    interface RenderOriginComponentAPI {
      busListener: jest.SpyInstance;
      wrapper: Wrapper<Vue>;
    }

    function renderOriginComponent({
      feature,
      location
    }: RenderOriginComponentOptions = {}): RenderOriginComponentAPI {
      const busListener = jest.spyOn(XPlugin.bus, 'emit');
      const wrapper = mount(
        {
          template: `
            <MyButton/>`,
          components: {
            MyButton: {
              template: '<button @click="emit">Click me</button>',
              methods: {
                emit(this: Vue) {
                  this.$x.emit('UserIsTypingAQuery', 'So awesome, much quality, such skill', {
                    feature
                  });
                }
              }
            }
          },
          provide: {
            location
          }
        },
        {
          localVue
        }
      );
      return { wrapper, busListener };
    }

    it("doesn't include origin in the $x.emit if there is no location", () => {
      const { wrapper, busListener } = renderOriginComponent({
        feature: 'search_box',
        location: undefined
      });
      wrapper.trigger('click');

      expect(busListener).toHaveBeenCalledTimes(1);
      expect(busListener).toHaveBeenCalledWith(
        expect.any(String),
        expect.anything(),
        expect.objectContaining<Partial<WireMetadata>>({ origin: undefined })
      );
    });

    it("doesn't include origin in the $x.emit if there is no feature", () => {
      const { wrapper, busListener } = renderOriginComponent({
        feature: undefined,
        location: 'predictive_layer'
      });
      wrapper.trigger('click');

      expect(busListener).toHaveBeenCalledTimes(1);
      expect(busListener).toHaveBeenCalledWith(
        expect.any(String),
        expect.anything(),
        expect.objectContaining<Partial<WireMetadata>>({ origin: undefined })
      );
    });

    it('emits a valid origin when both location and feature are available', () => {
      const { wrapper, busListener } = renderOriginComponent({
        feature: 'search_box',
        location: 'predictive_layer'
      });
      wrapper.trigger('click');

      expect(busListener).toHaveBeenCalledTimes(1);
      expect(busListener).toHaveBeenCalledWith(
        expect.any(String),
        expect.anything(),
        expect.objectContaining<Partial<WireMetadata>>({ origin: 'search_box:predictive_layer' })
      );
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
