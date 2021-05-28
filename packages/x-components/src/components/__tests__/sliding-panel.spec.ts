import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getDataTestSelector } from '../../__tests__/utils';
import { default as SlidingPanel } from '../sliding-panel.vue';

jest.useFakeTimers();

function renderSlidingPanel(
  template = `
    <SlidingPanel>
      <ul>
        <li>Element 1</li>
        <li>Element 2</li>
        <li>Element 3</li>
      </ul>
    </SlidingPanel>`
): RenderSlidingPanelAPI {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const wrapper = mount(
    {
      template,
      components: {
        SlidingPanel
      }
    },
    { attachTo: div }
  );

  const scrollElement = wrapper.find(getDataTestSelector('sliding-panel-scroll')).element;

  async function resizeElementScroll(scrollWidth: number, clientWidth: number): Promise<void> {
    Object.defineProperty(scrollElement, 'scrollWidth', {
      writable: true,
      configurable: true,
      value: scrollWidth
    });
    Object.defineProperty(scrollElement, 'clientWidth', {
      writable: true,
      configurable: true,
      value: clientWidth
    });

    window.dispatchEvent(new Event('resize'));
    jest.runAllTimers();
    await wrapper.vm.$nextTick();
  }

  const scrollBySpy = jest.fn();
  Object.defineProperty(scrollElement, 'scrollBy', { value: scrollBySpy });

  function doScroll(scrollInPx: number): void {
    scrollElement.scrollLeft = scrollInPx;
  }

  function getLeftButton(): Wrapper<Vue> {
    return wrapper.find(getDataTestSelector('sliding-panel-left-button'));
  }

  function getRightButton(): Wrapper<Vue> {
    return wrapper.find(getDataTestSelector('sliding-panel-right-button'));
  }

  return {
    wrapper,
    resizeElementScroll,
    doScroll,
    scrollBySpy,
    getLeftButton,
    getRightButton
  };
}

describe('testing sliding panel component', () => {
  it('renders the content passed to the default slot', () => {
    const { wrapper } = renderSlidingPanel();
    wrapper.findAll('li').wrappers.forEach((item, index) => {
      expect(item.element.innerHTML).toEqual(`Element ${index + 1}`);
    });
  });

  it('applies CSS class x-sliding-panel--at-start properly', async () => {
    const { wrapper, doScroll, resizeElementScroll } = renderSlidingPanel();

    await resizeElementScroll(300, 200);
    expect(wrapper.classes()).toEqual(['x-sliding-panel', 'x-sliding-panel--at-start']);

    doScroll(50);
    await resizeElementScroll(300, 200);
    expect(wrapper.classes()).toEqual(['x-sliding-panel']);
  });

  it('applies CSS class x-sliding-panel--at-end properly', async () => {
    const { wrapper, doScroll, resizeElementScroll } = renderSlidingPanel();

    await resizeElementScroll(300, 300);
    expect(wrapper.classes()).toEqual([
      'x-sliding-panel',
      'x-sliding-panel--at-start',
      'x-sliding-panel--at-end'
    ]);

    await resizeElementScroll(300, 200);
    expect(wrapper.classes()).toEqual(['x-sliding-panel', 'x-sliding-panel--at-start']);

    doScroll(50);
    await resizeElementScroll(300, 200);
    expect(wrapper.classes()).toEqual(['x-sliding-panel']);

    doScroll(100);
    await resizeElementScroll(300, 200);
    expect(wrapper.classes()).toEqual(['x-sliding-panel', 'x-sliding-panel--at-end']);
  });

  it('scrolls when clicking the scrolling buttons', async () => {
    const {
      resizeElementScroll,
      doScroll,
      scrollBySpy,
      getLeftButton,
      getRightButton
    } = renderSlidingPanel();
    await resizeElementScroll(1024, 200);
    getRightButton().trigger('click');

    expect(scrollBySpy).toHaveBeenCalled();

    doScroll(50);
    await Vue.nextTick();
    getLeftButton().trigger('click');

    expect(scrollBySpy).toHaveBeenCalledTimes(2);
  });

  it(`allows to customize buttons' content`, () => {
    const { getLeftButton, getRightButton } = renderSlidingPanel(
      `<SlidingPanel>
           <template #sliding-panel-left-button>Left</template>
             <ul>
               <li>Element 1</li>
               <li>Element 2</li>
               <li>Element 3</li>
             </ul>
           <template #sliding-panel-right-button>Right</template>
         </SlidingPanel>`
    );

    expect(getLeftButton().text()).toEqual('Left');
    expect(getRightButton().text()).toEqual('Right');
  });

  it('allows to permanently hide scrolling buttons', async () => {
    const { resizeElementScroll, doScroll, getLeftButton, getRightButton } = renderSlidingPanel(
      `<SlidingPanel :showButtons="false">
             <ul>
               <li>Element 1</li>
               <li>Element 2</li>
               <li>Element 3</li>
             </ul>
           </SlidingPanel>`
    );

    doScroll(50);
    await resizeElementScroll(300, 200);

    expect(getLeftButton().exists()).toBe(false);
    expect(getRightButton().exists()).toBe(false);
  });

  it('allows to configure the scrolling amount when clicking a button', async () => {
    const clientWidth = 200;
    const scrollFactor = 1.2;

    const { resizeElementScroll, scrollBySpy, getRightButton } = renderSlidingPanel(
      `<SlidingPanel :scrollFactor="${scrollFactor}">
           <ul>
             <li>Element 1</li>
             <li>Element 2</li>
             <li>Element 3</li>
           </ul>
         </SlidingPanel>`
    );
    await resizeElementScroll(1024, clientWidth);
    getRightButton().trigger('click');

    expect(scrollBySpy).toHaveBeenCalledWith({
      left: clientWidth * scrollFactor,
      behavior: 'smooth'
    });
  });
});

interface RenderSlidingPanelAPI {
  /** SlidingPanel test wrapper. */
  wrapper: Wrapper<Vue>;
  /** Simulates resize the element for testing. */
  resizeElementScroll: (scrollWidth: number, clientWidth: number) => Promise<void>;
  /** Simulates scroll for testing. */
  doScroll: (scrollInPx: number) => void;
  /** The spy on `scrollBy` method of the scroll. */
  scrollBySpy: () => void;
  /** Retrieves the left button of the sliding panel. */
  getLeftButton: () => Wrapper<Vue>;
  /** Retrieves the right button of the sliding panel. */
  getRightButton: () => Wrapper<Vue>;
}
