import { mount, Wrapper } from '@vue/test-utils';
import { ComponentOptions, default as Vue } from 'vue';
import { installNewXPlugin } from '../../__tests__/utils';
import { xComponentMixin } from '../../components/x-component.mixin';
import { FeatureLocation, QueryFeature } from '../../types/origin';
import { WireMetadata } from '../../wiring/wiring.types';
import { searchBoxXModule } from '../../x-modules/search-box/x-module';
import { XPlugin } from '../x-plugin';

describe('testing $x component API global mixin', () => {
  describe('testing origin', () => {
    /** Options to render the component to test component's bus origin functionality. */
    interface RenderOriginComponentOptions {
      /** The feature to be emitted. */
      feature?: QueryFeature;
      /** The location to be emitted. */
      location?: FeatureLocation;
    }

    /** API returned by the component to test component's bus origin functionality. */
    interface RenderOriginComponentAPI {
      /** The bus emit, to assert that it has been called with a proper origin. */
      busListener: jest.SpyInstance;
      /** The component testing wrapper. Will emit a {@link XEvent} when clicked. */
      wrapper: Wrapper<Vue>;
    }

    function renderOriginComponent({
      feature,
      location
    }: RenderOriginComponentOptions = {}): RenderOriginComponentAPI {
      const [, localVue] = installNewXPlugin();
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

    it('emits location and feature in the metadata when they are available', () => {
      const { wrapper, busListener } = renderOriginComponent({
        location: 'predictive_layer',
        feature: 'search_box'
      });
      wrapper.trigger('click');

      expect(busListener).toHaveBeenCalledTimes(1);
      expect(busListener).toHaveBeenCalledWith(
        expect.any(String),
        expect.anything(),
        expect.objectContaining<Partial<WireMetadata>>({
          location: 'predictive_layer',
          feature: 'search_box'
        })
      );
    });
  });

  describe('testing $x API', () => {
    it('allows emitting and subscribing to events via $x object', () => {
      const [, localVue] = installNewXPlugin();
      const wrapper = mount(
        {
          render(createElement) {
            return createElement();
          }
        },
        { localVue }
      );
      const listener = jest.fn();

      wrapper.vm.$x.on('UserIsTypingAQuery').subscribe(listener);
      wrapper.vm.$x.emit('UserIsTypingAQuery', 'So awesome, much quality, such skill');

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith('So awesome, much quality, such skill');
    });

    it('emits the event metadata', () => {
      const [, localVue] = installNewXPlugin();
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
      const [, localVue] = installNewXPlugin();
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
      const [, localVue] = installNewXPlugin();
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

    it('can access the $x API from an immediate watcher', () => {
      const [, localVue] = installNewXPlugin();
      const queryCallback = jest.fn();
      const wrapper = mount(
        {
          computed: {
            query(): string {
              return this.$x.query.search;
            }
          },
          watch: {
            query: {
              handler(query: string): void {
                this.$x.emit('UserAcceptedAQuery', query);
              },
              immediate: true
            }
          },
          render(h) {
            return h();
          }
        } as ComponentOptions<Vue> & ThisType<Vue>,
        { localVue }
      );
      wrapper.vm.$x.on('UserAcceptedAQuery').subscribe(queryCallback);

      expect(queryCallback).toHaveBeenCalledTimes(1);
    });
  });
});
