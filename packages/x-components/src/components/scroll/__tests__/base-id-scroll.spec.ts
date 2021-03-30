import { mount, Wrapper } from '@vue/test-utils';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import BaseIdScroll from '../base-id-scroll.vue';

function renderBaseIdScroll({
  template = '<BaseIdScroll :throttleMs="throttleMs" :id="id"/>',
  throttleMs = 200,
  id = 'scrollResults',
  scrollHeight = 800,
  clientHeight = 200,
  distanceToBottom = 100
}: RenderBaseIdScrollOptions = {}): RenderBaseIdScrollAPI {
  const [, localVue] = installNewXPlugin();
  const wrapperContainer = mount(
    {
      components: {
        BaseIdScroll
      },
      props: ['throttleMs', 'id', 'distanceToBottom'],
      template
    },
    {
      propsData: {
        throttleMs,
        id,
        distanceToBottom
      },
      localVue
    }
  );

  const wrapper = wrapperContainer.findComponent(BaseIdScroll);
  const scrollElement: HTMLElement = wrapperContainer.find(getDataTestSelector('base-scroll'))
    .element;
  jest.spyOn(scrollElement, 'clientHeight', 'get').mockImplementation(() => clientHeight);
  jest.spyOn(scrollElement, 'scrollHeight', 'get').mockImplementation(() => scrollHeight);

  return {
    wrapper,
    scrollElement,
    async scroll(options: { to: number; durationMs: number }) {
      scrollElement.scrollTop = options.to;
      wrapper.trigger('scroll');
      jest.advanceTimersByTime(options.durationMs);
      await wrapper.vm.$nextTick();
    }
  };
}

describe('testing Base Scroll Component', () => {
  beforeAll(jest.useFakeTimers);
  afterEach(jest.clearAllTimers);

  it('renders default slot contents', () => {
    const { wrapper } = renderBaseIdScroll({
      template: `
        <BaseIdScroll :id="id">
          <div data-test="content-scroll">
            <p>scroll content</p>
          </div>
        </BaseIdScroll>`,
      id: 'scrollResults'
    });

    const contents = wrapper.find(getDataTestSelector('content-scroll'));
    expect(contents.exists()).toBe(true);
  });

  it('throttles the scroll event', async () => {
    const { wrapper, scroll, scrollElement } = renderBaseIdScroll({
      throttleMs: 200,
      id: 'scrollResults'
    });

    const listenerScrolled = jest.fn();
    wrapper.vm.$x.on('UserScrolled', true).subscribe(listenerScrolled);
    expect(listenerScrolled).toHaveBeenCalledTimes(0);

    await scroll({
      to: 50,
      durationMs: 100
    });
    await scroll({
      to: 100,
      durationMs: 99
    });

    expect(listenerScrolled).not.toHaveBeenCalled();

    await scroll({
      to: 150,
      durationMs: 1
    });

    expect(listenerScrolled).toHaveBeenCalledTimes(1);
    expect(listenerScrolled).toHaveBeenNthCalledWith(1, {
      eventPayload: 150,
      metadata: {
        moduleName: null, // no module registered for this base component
        target: scrollElement,
        id: 'scrollResults'
      }
    });
  });

  // eslint-disable-next-line max-len
  it('emits the `UserChangedScrollDirection` event when the user changes scrolling direction', async () => {
    const { wrapper, scroll, scrollElement } = renderBaseIdScroll({
      throttleMs: 200,
      id: 'scrollResults'
    });

    const listenerChangeDirection = jest.fn();
    wrapper.vm.$x.on('UserChangedScrollDirection', true).subscribe(listenerChangeDirection);
    expect(listenerChangeDirection).toHaveBeenCalledTimes(0);

    await scroll({
      to: 300,
      durationMs: 200
    });

    await scroll({
      to: 500,
      durationMs: 200
    });

    await scroll({
      to: 200,
      durationMs: 200
    });

    await scroll({
      to: 100,
      durationMs: 200
    });

    expect(listenerChangeDirection).toHaveBeenCalledTimes(2);
    expect(listenerChangeDirection).toHaveBeenNthCalledWith(1, {
      eventPayload: 'DOWN',
      metadata: {
        moduleName: null, // no module registered for this base component
        target: scrollElement,
        id: 'scrollResults'
      }
    });
    expect(listenerChangeDirection).toHaveBeenNthCalledWith(2, {
      eventPayload: 'UP',
      metadata: {
        moduleName: null, // no module registered for this base component
        target: scrollElement,
        id: 'scrollResults'
      }
    });
  });

  it('emits the `UserReachedScrollStart` event when the user scrolls back to the top', async () => {
    const { wrapper, scroll, scrollElement } = renderBaseIdScroll({
      throttleMs: 200,
      id: 'scrollResults'
    });

    const listenerScrollStart = jest.fn();
    wrapper.vm.$x.on('UserReachedScrollStart', true).subscribe(listenerScrollStart);
    expect(listenerScrollStart).toHaveBeenCalledTimes(0);

    await scroll({
      to: 300,
      durationMs: 200
    });

    await scroll({
      to: 0,
      durationMs: 200
    });

    expect(listenerScrollStart).toHaveBeenCalledTimes(1);
    expect(listenerScrollStart).toHaveBeenNthCalledWith(1, {
      eventPayload: undefined,
      metadata: {
        moduleName: null, // no module registered for this base component
        target: scrollElement,
        id: 'scrollResults'
      }
    });
  });

  // eslint-disable-next-line max-len
  it('emits `UserAlmostReachedScrollEnd` and`UserReachedScrollEnd` when the user scrolls to the bottom', async () => {
    const { wrapper, scroll, scrollElement } = renderBaseIdScroll({
      throttleMs: 200,
      id: 'scrollResults',
      scrollHeight: 800,
      clientHeight: 200,
      distanceToBottom: 200
    });

    const listenerAlmostReachedScrollEnd = jest.fn();
    wrapper.vm.$x.on('UserAlmostReachedScrollEnd', true).subscribe(listenerAlmostReachedScrollEnd);
    const listenerReachedScrollEnd = jest.fn();
    wrapper.vm.$x.on('UserReachedScrollEnd', true).subscribe(listenerReachedScrollEnd);

    await scroll({
      to: 520,
      durationMs: 200
    });

    expect(listenerAlmostReachedScrollEnd).toHaveBeenNthCalledWith(1, {
      eventPayload: 80,
      metadata: {
        moduleName: null, // no module registered for this base component
        target: scrollElement,
        id: 'scrollResults'
      }
    });

    await scroll({
      to: 600,
      durationMs: 200
    });

    expect(listenerReachedScrollEnd).toHaveBeenNthCalledWith(1, {
      eventPayload: undefined,
      metadata: {
        moduleName: null, // no module registered for this base component
        target: scrollElement,
        id: 'scrollResults'
      }
    });

    await scroll({
      to: 0,
      durationMs: 200
    });

    await scroll({
      to: 600,
      durationMs: 200
    });

    expect(listenerAlmostReachedScrollEnd).toHaveBeenNthCalledWith(2, {
      eventPayload: 0,
      metadata: {
        moduleName: null, // no module registered for this base component
        target: scrollElement,
        id: 'scrollResults'
      }
    });
    expect(listenerReachedScrollEnd).toHaveBeenNthCalledWith(2, {
      eventPayload: undefined,
      metadata: {
        moduleName: null, // no module registered for this base component
        target: scrollElement,
        id: 'scrollResults'
      }
    });
  });
});

interface RenderBaseIdScrollOptions {
  /** The template to be rendered. */
  template?: string;
  /** Number for throttle of scroll. */
  throttleMs?: number;
  /** Scroll id of component. */
  id?: string;
  /** Number of scroll height of scroll. */
  scrollHeight?: number;
  /** Number of client height of scroll. */
  clientHeight?: number;
  /** Distance to the end of the scroll. */
  distanceToBottom?: number;
}

interface RenderBaseIdScrollAPI {
  /** The wrapper for the base scroll component. */
  wrapper: Wrapper<Vue>;
  /** The scroll element. */
  scrollElement: HTMLElement;
  /** Function that launch the trigger scroll. */
  scroll: (options: { to: number; durationMs: number }) => Promise<void>;
}
