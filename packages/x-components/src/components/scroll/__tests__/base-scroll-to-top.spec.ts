import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { installNewXPlugin } from '../../../__tests__/utils';
import { XEvent, XEventPayload } from '../../../wiring/events.types';
import BaseScrollToTop from '../base-scroll-to-top.vue';

/**
 * Renders the {@link BaseScrollToTop} with the provided options.
 *
 * @param options - The options to render the component with.
 * @returns An small API to test the component.
 */
function renderBaseScrollToTop({
  defaultSlot = '<span>Top</span>',
  scrollId = 'scrollId',
  thresholdPx
}: RenderBaseScrollToTopOptions = {}): RenderBaseScrollToTopAPI {
  const [, localVue] = installNewXPlugin();
  const wrapper = mount(BaseScrollToTop, {
    propsData: { scrollId, thresholdPx },
    localVue,
    scopedSlots: {
      default: defaultSlot
    }
  });

  const scrollToTopWrapper = wrapper.findComponent(BaseScrollToTop);

  return {
    scrollToTopWrapper,
    async click() {
      scrollToTopWrapper.trigger('click');
      await localVue.nextTick();
    },
    async emitXEvent<Event extends XEvent>(event: Event, payload: XEventPayload<Event>) {
      scrollToTopWrapper.vm.$x.emit(event, payload, { id: 'scrollId' });
      await scrollToTopWrapper.vm.$nextTick();
    }
  };
}

describe('testing Base Scroll To Top component', () => {
  it('renders the content in the slot', async () => {
    const { scrollToTopWrapper, emitXEvent } = renderBaseScrollToTop();
    await emitXEvent('UserAlmostReachedScrollEnd', 100);
    expect(scrollToTopWrapper.text()).toEqual('Top');
  });

  it('shows if a scroll is almost reaching the end and there is no threshold', async () => {
    const { scrollToTopWrapper, emitXEvent } = renderBaseScrollToTop();
    expect(scrollToTopWrapper.html()).toBe('');
    await emitXEvent('UserAlmostReachedScrollEnd', 100);
    expect(scrollToTopWrapper.html()).not.toBe('');
  });

  it('shows if the scroll is over the threshold and user scrolls up', async () => {
    const { scrollToTopWrapper, emitXEvent } = renderBaseScrollToTop({ thresholdPx: 200 });
    expect(scrollToTopWrapper.html()).toBe('');

    await emitXEvent('UserScrolled', 250);
    await emitXEvent('UserChangedScrollDirection', 'UP');

    expect(scrollToTopWrapper.html()).not.toBe('');
  });

  it("emits event with the component's id as payload when clicked", async () => {
    const { scrollToTopWrapper, emitXEvent, click } = renderBaseScrollToTop();
    const listener = jest.fn();
    scrollToTopWrapper.vm.$x.on('UserClickedScrollToTop').subscribe(listener);

    await emitXEvent('UserAlmostReachedScrollEnd', 100);
    await click();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('scrollId');
  });

  // eslint-disable-next-line max-len
  it('hides when the scroll direction is up once the scroll has almost reached the end', async () => {
    const { scrollToTopWrapper, emitXEvent } = renderBaseScrollToTop();

    await emitXEvent('UserChangedScrollDirection', 'DOWN');
    await emitXEvent('UserAlmostReachedScrollEnd', 100);
    expect(scrollToTopWrapper.html()).not.toBe('');

    await emitXEvent('UserChangedScrollDirection', 'UP');
    expect(scrollToTopWrapper.html()).toBe('');
  });

  it('hides when the scroll gets lesser than the threshold', async () => {
    const { scrollToTopWrapper, emitXEvent } = renderBaseScrollToTop({ thresholdPx: 1000 });

    await emitXEvent('UserScrolled', 1100);
    await emitXEvent('UserChangedScrollDirection', 'UP');
    expect(scrollToTopWrapper.html()).not.toBe('');

    await emitXEvent('UserScrolled', 900);
    expect(scrollToTopWrapper.html()).toBe('');
  });
});

interface RenderBaseScrollToTopOptions {
  /** The default slot for the component. */
  defaultSlot?: string;
  /** The id of the scroll referring the scroll to top. */
  scrollId?: string;
  /** The number of pixels of threshold from the top to show the component. */
  thresholdPx?: number;
}

interface RenderBaseScrollToTopAPI {
  /** The wrapper for the base scroll to top component. */
  scrollToTopWrapper: Wrapper<Vue>;
  /** Clicks the button. */
  click: () => Promise<void>;
  /** Emits an XEvent with the id in metadata. */
  emitXEvent: <Event extends XEvent>(event: Event, payload: XEventPayload<Event>) => Promise<void>;
}
