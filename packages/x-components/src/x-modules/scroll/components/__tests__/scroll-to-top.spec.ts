import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { XEvent, XEventPayload } from '../../../../wiring/events.types';
import { scrollXModule } from '../../x-module';
import ScrollToTop from '../scroll-to-top.vue';

/**
 * Renders the {@link ScrollToTop} with the provided options.
 *
 * @param options - The options to render the component with.
 * @returns An small API to test the component.
 */
function renderScrollToTop({
  defaultSlot = '<span>Top</span>',
  scrollId = 'scrollId',
  thresholdPx
}: RenderScrollToTopOptions = {}): RenderScrollToTopAPI {
  const [, localVue] = installNewXPlugin({ initialXModules: [scrollXModule] });
  const wrapper = mount(ScrollToTop, {
    propsData: { scrollId, thresholdPx },
    localVue,
    scopedSlots: {
      default: defaultSlot
    }
  });

  const scrollToTopWrapper = wrapper.findComponent(ScrollToTop);

  return {
    scrollToTopWrapper,
    async click() {
      await scrollToTopWrapper.trigger('click');
    },
    emitXEvent(event, payload) {
      scrollToTopWrapper.vm.$x.emit(event, payload, { id: 'scrollId' });
      return localVue.nextTick();
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
    expect(scrollToTopWrapper.html()).toBe('');
    await emitXEvent('UserAlmostReachedScrollEnd', true);
    await emitXEvent('UserChangedScrollDirection', 'DOWN');
    expect(scrollToTopWrapper.html()).not.toBe('');
  });

  it('shows if the scroll is over the threshold and user scrolls up', async () => {
    const { scrollToTopWrapper, emitXEvent } = renderScrollToTop({ thresholdPx: 200 });
    expect(scrollToTopWrapper.html()).toBe('');

    await emitXEvent('UserScrolled', 250);
    await emitXEvent('UserChangedScrollDirection', 'UP');

    expect(scrollToTopWrapper.html()).not.toBe('');
  });

  it("emits event with the component's id as payload when clicked", async () => {
    const { scrollToTopWrapper, emitXEvent, click } = renderScrollToTop();
    const listener = jest.fn();
    scrollToTopWrapper.vm.$x.on('UserClickedScrollToTop').subscribe(listener);

    await emitXEvent('UserAlmostReachedScrollEnd', true);
    await emitXEvent('UserChangedScrollDirection', 'DOWN');
    await click();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('scrollId');
  });

  // eslint-disable-next-line max-len
  it('hides when the scroll direction is up once the scroll has almost reached the end', async () => {
    const { scrollToTopWrapper, emitXEvent } = renderScrollToTop();

    await emitXEvent('UserChangedScrollDirection', 'DOWN');
    await emitXEvent('UserAlmostReachedScrollEnd', true);
    expect(scrollToTopWrapper.html()).not.toBe('');

    await emitXEvent('UserChangedScrollDirection', 'UP');
    expect(scrollToTopWrapper.html()).toBe('');
  });

  it('hides when the scroll gets lesser than the threshold', async () => {
    const { scrollToTopWrapper, emitXEvent } = renderScrollToTop({ thresholdPx: 1000 });

    await emitXEvent('UserScrolled', 1100);
    await emitXEvent('UserChangedScrollDirection', 'UP');
    expect(scrollToTopWrapper.html()).not.toBe('');

    await emitXEvent('UserScrolled', 900);
    expect(scrollToTopWrapper.html()).toBe('');
  });
});

interface RenderScrollToTopOptions {
  /** The default slot for the component. */
  defaultSlot?: string;
  /** The id of the scroll referring the scroll to top. */
  scrollId?: string;
  /** The number of pixels of threshold from the top to show the component. */
  thresholdPx?: number;
}

interface RenderScrollToTopAPI {
  /** The wrapper for the base scroll to top component. */
  scrollToTopWrapper: Wrapper<Vue>;
  /** Clicks the button. */
  click: () => Promise<void>;
  /** Emits an XEvent with the id in metadata. */
  emitXEvent: <Event extends XEvent>(event: Event, payload: XEventPayload<Event>) => Promise<void>;
}
