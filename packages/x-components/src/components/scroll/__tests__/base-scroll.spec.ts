import { mount, Wrapper } from '@vue/test-utils';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import { XEvent } from '../../../wiring/events.types';
import BaseScroll from '../base-scroll.vue';

/**
 * {@link HTMLElement} `scrollTo` is not implemented in JSDOM. This function sets the `scrollTop`
 * of the element to 0.
 *
 * @param options - {@link ScrollToOptions} (not undefined nor number).
 */
HTMLElement.prototype.scrollTo = function (options?: ScrollToOptions | number) {
  this.scrollTop = (options as ScrollToOptions)?.top ?? 0;
};

async function renderBaseScroll({
  template = '<BaseScroll v-bind="$attrs" />',
  throttleMs = 200,
  scrollHeight = 800,
  clientHeight = 200,
  distanceToBottom = 100,
  resetOnChange,
  resetOn
}: RenderBaseScrollOptions = {}): Promise<RenderBaseScrollAPI> {
  const [, localVue] = installNewXPlugin();

  const wrapperContainer = mount(
    {
      components: {
        BaseScroll
      },
      template,
      inheritAttrs: false
    },
    {
      propsData: {
        throttleMs,
        distanceToBottom,
        resetOnChange,
        resetOn
      },
      localVue
    }
  );

  const wrapper = wrapperContainer.findComponent(BaseScroll);
  const scrollElement: HTMLElement = wrapperContainer.find(
    getDataTestSelector('base-scroll')
  ).element;
  jest.spyOn(scrollElement, 'clientHeight', 'get').mockImplementation(() => clientHeight);
  jest.spyOn(scrollElement, 'scrollHeight', 'get').mockImplementation(() => scrollHeight);

  await localVue.nextTick();

  return {
    wrapper,
    async scroll({ to, durationMs }) {
      scrollElement.scrollTop = to;
      wrapper.trigger('scroll');
      jest.advanceTimersByTime(durationMs);
      await localVue.nextTick();
    }
  };
}

describe('testing Base Scroll Component', () => {
  beforeAll(jest.useFakeTimers);
  afterEach(jest.clearAllTimers);

  it('renders default slot contents', async () => {
    const { wrapper } = await renderBaseScroll({
      template: `
        <BaseScroll>
          <div data-test="content-scroll">
            <p>scroll content</p>
          </div>
        </BaseScroll>`
    });

    const contents = wrapper.find(getDataTestSelector('content-scroll'));
    expect(contents.exists()).toBe(true);
  });

  it('throttles the scroll event', async () => {
    const { wrapper, scroll } = await renderBaseScroll({
      throttleMs: 200
    });

    await scroll({
      to: 50,
      durationMs: 100
    });
    await scroll({
      to: 100,
      durationMs: 99
    });
    expect(wrapper.emitted('scroll')).toBeUndefined();

    await scroll({
      to: 150,
      durationMs: 1
    });

    expect(wrapper.emitted('scroll')).toEqual([[150]]);
  });

  // eslint-disable-next-line max-len
  it('emits the `scroll:direction-change` event when the user changes scrolling direction', async () => {
    const { wrapper, scroll } = await renderBaseScroll({
      throttleMs: 200
    });
    expect(wrapper.emitted('scroll:direction-change')).toBeUndefined();

    await scroll({
      to: 300,
      durationMs: 200
    });
    expect(wrapper.emitted('scroll:direction-change')).toEqual([['DOWN']]);

    await scroll({
      to: 500,
      durationMs: 200
    });
    expect(wrapper.emitted('scroll:direction-change')).toEqual([['DOWN']]);

    await scroll({
      to: 200,
      durationMs: 200
    });
    expect(wrapper.emitted('scroll:direction-change')).toEqual([['DOWN'], ['UP']]);

    await scroll({
      to: 100,
      durationMs: 200
    });
    expect(wrapper.emitted('scroll:direction-change')).toEqual([['DOWN'], ['UP']]);

    expect(wrapper.emitted('scroll')).toEqual([[300], [500], [200], [100]]);
    expect(wrapper.emitted('scroll:at-start')).toEqual([[false]]);
    expect(wrapper.emitted('scroll:at-end')).toEqual([[false]]);
  });

  it('emits the `scroll:at-start` event when the user scrolls back to the top', async () => {
    const { wrapper, scroll } = await renderBaseScroll({
      throttleMs: 200
    });
    expect(wrapper.emitted('scroll:at-start')).toBeUndefined();

    await scroll({
      to: 300,
      durationMs: 200
    });
    expect(wrapper.emitted('scroll:at-start')).toEqual([[false]]);

    await scroll({
      to: 0,
      durationMs: 200
    });
    expect(wrapper.emitted('scroll:at-start')).toEqual([[false], [true]]);

    expect(wrapper.emitted('scroll:direction-change')).toEqual([['DOWN'], ['UP']]);
  });

  // eslint-disable-next-line max-len
  it('emits `scroll:almost-at-end` and `scroll:at-end` when the user scrolls to the bottom', async () => {
    const { wrapper, scroll } = await renderBaseScroll({
      throttleMs: 200,
      scrollHeight: 800,
      clientHeight: 200,
      distanceToBottom: 300
    });
    expect(wrapper.emitted('scroll:almost-at-end')).toBeUndefined();

    await scroll({
      to: 550,
      durationMs: 200
    });
    expect(wrapper.emitted('scroll:almost-at-end')).toEqual([[true]]);

    await scroll({
      to: 501,
      durationMs: 200
    });
    expect(wrapper.emitted('scroll:almost-at-end')).toEqual([[true]]);

    await scroll({
      to: 0,
      durationMs: 200
    });
    expect(wrapper.emitted('scroll:almost-at-end')).toEqual([[true], [false]]);

    await scroll({
      to: 600,
      durationMs: 200
    });
    expect(wrapper.emitted('scroll:almost-at-end')).toEqual([[true], [false], [true]]);
  });

  it('resets the scroll when the given events are emitted', async () => {
    const { wrapper, scroll } = await renderBaseScroll({
      resetOn: ['UserAcceptedAQuery']
    });

    await scroll({
      to: 300,
      durationMs: 200
    });
    expect(wrapper.element.scrollTop).toEqual(300);

    wrapper.vm.$x.emit('UserAcceptedAQuery', 'milk');
    await wrapper.vm.$nextTick();
    expect(wrapper.element.scrollTop).toEqual(0);
  });

  it('allows disabling resetting the scroll when certain events are emitted', async () => {
    const { wrapper, scroll } = await renderBaseScroll({
      resetOn: ['UserAcceptedAQuery'],
      resetOnChange: false
    });

    await scroll({
      to: 300,
      durationMs: 200
    });
    expect(wrapper.element.scrollTop).toEqual(300);

    wrapper.vm.$x.emit('UserAcceptedAQuery', 'milk');
    await wrapper.vm.$nextTick();
    expect(wrapper.element.scrollTop).toEqual(300);
  });
});

interface RenderBaseScrollOptions {
  /** The template to be rendered. */
  template?: string;
  /** Number for throttle of scroll. */
  throttleMs?: number;
  /** Number of scroll height of scroll. */
  scrollHeight?: number;
  /** Number of client height of scroll. */
  clientHeight?: number;
  /** Distance to the end of the scroll. */
  distanceToBottom?: number;
  /** Flag to enable or disable resetting the scroll when the events at {@link BaseScroll.resetOn}
   * are emitted. */
  resetOnChange?: boolean;
  /** List of events to reset the scroll when they are emitted. */
  resetOn?: XEvent[];
}

interface RenderBaseScrollAPI {
  /** The wrapper for the base scroll component. */
  wrapper: Wrapper<Vue>;
  /** Function that launch the trigger scroll. */
  scroll: (options: { to: number; durationMs: number }) => Promise<void>;
}
