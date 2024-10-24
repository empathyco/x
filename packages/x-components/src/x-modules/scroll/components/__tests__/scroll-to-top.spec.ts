import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { XEvent, XEventPayload } from '../../../../wiring';
import { scrollXModule } from '../../x-module';
import ScrollToTop from '../scroll-to-top.vue';
import { XPlugin } from '../../../../plugins';

/**
 * Renders the {@link ScrollToTop} with the provided options.
 *
 * @param options - The options to render the component with.
 * @returns An small API to test the component.
 */
function renderScrollToTop({
  defaultSlot = '<span>Top</span>',
  scrollId = 'scrollId',
  thresholdPx = undefined as undefined | number
} = {}) {
  const wrapper = mount(ScrollToTop, {
    propsData: { scrollId, thresholdPx },
    global: { plugins: [installNewXPlugin({ initialXModules: [scrollXModule] })] },
    slots: {
      default: defaultSlot
    }
  });

  const scrollToTopWrapper = wrapper.findComponent(ScrollToTop);

  return {
    scrollToTopWrapper,
    click: async () => await scrollToTopWrapper.trigger('click'),
    emitXEvent: <Event extends XEvent>(event: Event, payload: XEventPayload<Event>) => {
      XPlugin.bus.emit(event, payload, { id: 'scrollId', moduleName: null });
      return nextTick();
    }
  };
}

describe('testing Scroll To Top component', () => {
  it('renders the content in the slot', async () => {
    const { scrollToTopWrapper, emitXEvent } = renderScrollToTop();
    await emitXEvent('UserAlmostReachedScrollEnd', true);
    await emitXEvent('UserChangedScrollDirection', 'DOWN');
    expect(scrollToTopWrapper.text()).toEqual('Top');
  });

  it('shows if a scroll is almost reaching the end and there is no threshold', async () => {
    const { scrollToTopWrapper, emitXEvent } = renderScrollToTop();
    expect(scrollToTopWrapper.find('.x-scroll-to-top').exists()).toEqual(false);
    await emitXEvent('UserAlmostReachedScrollEnd', true);
    await emitXEvent('UserChangedScrollDirection', 'DOWN');
    expect(scrollToTopWrapper.html()).not.toEqual('');
  });

  it('shows if the scroll is over the threshold and user scrolls up', async () => {
    const { scrollToTopWrapper, emitXEvent } = renderScrollToTop({ thresholdPx: 200 });
    expect(scrollToTopWrapper.find('.x-scroll-to-top').exists()).toEqual(false);

    await emitXEvent('UserScrolled', 250);
    await emitXEvent('UserChangedScrollDirection', 'UP');

    expect(scrollToTopWrapper.html()).not.toEqual('');
  });

  it("emits event with the component's id as payload when clicked", async () => {
    const { emitXEvent, click } = renderScrollToTop();
    const listener = jest.fn();
    XPlugin.bus.on('UserClickedScrollToTop').subscribe(listener);

    await emitXEvent('UserAlmostReachedScrollEnd', true);
    await emitXEvent('UserChangedScrollDirection', 'DOWN');
    await click();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('scrollId');
  });

  it('hides when the scroll direction is up once the scroll has almost reached the end', async () => {
    const { scrollToTopWrapper, emitXEvent } = renderScrollToTop();

    await emitXEvent('UserChangedScrollDirection', 'DOWN');
    await emitXEvent('UserAlmostReachedScrollEnd', true);
    expect(scrollToTopWrapper.html()).not.toEqual('');

    await emitXEvent('UserChangedScrollDirection', 'UP');
    expect(scrollToTopWrapper.find('.x-scroll-to-top').exists()).toEqual(false);
  });

  it('hides when the scroll gets lesser than the threshold', async () => {
    const { scrollToTopWrapper, emitXEvent } = renderScrollToTop({ thresholdPx: 1000 });

    await emitXEvent('UserScrolled', 1100);
    await emitXEvent('UserChangedScrollDirection', 'UP');
    expect(scrollToTopWrapper.html()).not.toEqual('');

    await emitXEvent('UserScrolled', 900);
    expect(scrollToTopWrapper.find('.x-scroll-to-top').exists()).toEqual(false);
  });
});
