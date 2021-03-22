import { mount, Wrapper } from '@vue/test-utils';
import { getDataTestSelector } from '../../__tests__/utils';
import BaseScroll from '../base-scroll.vue';

function renderBaseScroll({
  template = '<BaseScroll :throttleMs="throttleMs"/>',
  throttleMs = 200,
  scrollHeight = 800,
  clientHeight = 200,
  bottomAlertDistance = 100
}: RenderBaseScrollOptions = {}): RenderBaseScrollAPI {
  const wrapperContainer = mount(
    {
      props: ['throttleMs', 'bottomAlertDistance'],
      components: {
        BaseScroll
      },
      template
    },
    {
      propsData: {
        throttleMs,
        bottomAlertDistance
      }
    }
  );

  const wrapper = wrapperContainer.findComponent(BaseScroll);
  const scrollElement: HTMLElement = wrapperContainer.find(getDataTestSelector('base-scroll'))
    .element;
  jest.spyOn(scrollElement, 'clientHeight', 'get').mockImplementation(() => clientHeight);
  jest.spyOn(scrollElement, 'scrollHeight', 'get').mockImplementation(() => scrollHeight);

  return {
    wrapper,
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
    const { wrapper } = renderBaseScroll({
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
    const { wrapper, scroll } = renderBaseScroll({
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
    const { wrapper, scroll } = renderBaseScroll({
      throttleMs: 200
    });

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

    expect(wrapper.emitted('scroll')).toEqual([[300], [500], [200], [100]]);
    expect(wrapper.emitted('scroll:direction-change')).toEqual([['DOWN'], ['UP']]);
    expect(wrapper.emitted('scroll:at-start')).toBeUndefined();
    expect(wrapper.emitted('scroll:at-end')).toBeUndefined();
  });

  it('emits the `scroll:at-start` event when the user scrolls back to the top', async () => {
    const { wrapper, scroll } = renderBaseScroll({
      throttleMs: 200
    });

    await scroll({
      to: 300,
      durationMs: 200
    });

    await scroll({
      to: 0,
      durationMs: 200
    });

    expect(wrapper.emitted('scroll:direction-change')).toEqual([['DOWN'], ['UP']]);
    expect(wrapper.emitted('scroll:at-start')).toHaveLength(1);
  });

  // eslint-disable-next-line max-len
  it('emits `scroll:almost-at-end` and `scroll:at-end` when the user scrolls to the bottom', async () => {
    const { wrapper, scroll } = renderBaseScroll({
      throttleMs: 200,
      scrollHeight: 800,
      clientHeight: 200,
      bottomAlertDistance: 200
    });

    await scroll({
      to: 520,
      durationMs: 200
    });

    await scroll({
      to: 600,
      durationMs: 200
    });

    await scroll({
      to: 0,
      durationMs: 200
    });

    await scroll({
      to: 600,
      durationMs: 200
    });

    expect(wrapper.emitted('scroll:almost-at-end')).toEqual([[80], [0]]);
    expect(wrapper.emitted('scroll:at-end')).toHaveLength(2);
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
  bottomAlertDistance?: number;
}

interface RenderBaseScrollAPI {
  /** The wrapper for the base scroll component. */
  wrapper: Wrapper<Vue>;
  /** Function that launch the trigger scroll. */
  scroll: (options: { to: number; durationMs: number }) => Promise<void>;
}
