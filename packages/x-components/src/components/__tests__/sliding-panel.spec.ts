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
  const slidingPanelWrapper = mount(
    {
      template,
      components: {
        SlidingPanel
      }
    },
    { attachTo: div }
  );

  const scrollElement = slidingPanelWrapper.find(getDataTestSelector('sliding-panel-scroll'))
    .element;

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
    await Vue.nextTick();
  }

  const scrollBySpy = jest.fn();
  Object.defineProperty(scrollElement, 'scrollBy', { value: scrollBySpy });

  function doScroll(scrollInPx: number): void {
    scrollElement.scrollLeft = scrollInPx;
  }

  function getLeftButton(): Wrapper<Vue> {
    return slidingPanelWrapper.find(getDataTestSelector('sliding-panel-left-button'));
  }

  function getRightButton(): Wrapper<Vue> {
    return slidingPanelWrapper.find(getDataTestSelector('sliding-panel-right-button'));
  }

  return {
    wrapper: slidingPanelWrapper,
    resizeElementScroll,
    doScroll,
    scrollBySpy,
    getLeftButton,
    getRightButton
  };
}

describe('testing sliding panel component', () => {
  it('renders a list of elements inside the sliding panel', () => {
    const { wrapper } = renderSlidingPanel();
    wrapper.findAll('li').wrappers.forEach((item, index) => {
      expect(item.element.innerHTML).toEqual(`Element ${index + 1}`);
    });
  });

  it(`doesn't show the buttons if the scroll is not needed`, async () => {
    const { resizeElementScroll, getLeftButton, getRightButton } = renderSlidingPanel();
    await resizeElementScroll(300, 300);

    expect(getLeftButton().element).not.toBeVisible();
    expect(getRightButton().element).not.toBeVisible();
  });

  it(`shows the buttons when the window resizes and they're needed`, async () => {
    const { resizeElementScroll, getLeftButton, getRightButton } = renderSlidingPanel();
    await resizeElementScroll(300, 300);

    expect(getLeftButton().element).not.toBeVisible();
    expect(getRightButton().element).not.toBeVisible();

    await resizeElementScroll(300, 200);

    expect(getLeftButton().element).not.toBeVisible();
    expect(getRightButton().element).toBeVisible();
  });

  it(`shows the 'go right' button when the scroll is needed and it is at the start`, async () => {
    const { resizeElementScroll, getLeftButton, getRightButton } = renderSlidingPanel();
    await resizeElementScroll(300, 200);

    expect(getLeftButton().element).not.toBeVisible();
    expect(getRightButton().element).toBeVisible();
  });

  it(`shows the 'go left' and 'go right' buttons when the scroll is needed and it is not at start
    nor end`, async () => {
    const { resizeElementScroll, doScroll, getLeftButton, getRightButton } = renderSlidingPanel();
    doScroll(50);
    await resizeElementScroll(300, 200);

    expect(getLeftButton().element).toBeVisible();
    expect(getRightButton().element).toBeVisible();
  });

  it(`shows the 'go left' button when the scroll is needed and it's at the end`, async () => {
    const mockedScrollWidth = 350;
    const mockedClientWidth = 300;
    const { resizeElementScroll, doScroll, getLeftButton, getRightButton } = renderSlidingPanel();
    doScroll(mockedScrollWidth - mockedClientWidth);
    await resizeElementScroll(mockedScrollWidth, mockedClientWidth);

    expect(getLeftButton().element).toBeVisible();
    expect(getRightButton().element).not.toBeVisible();
  });

  it('scrolls the sliding panel when clicking buttons', async () => {
    const clientWidth = 200;

    const {
      resizeElementScroll,
      doScroll,
      scrollBySpy,
      getLeftButton,
      getRightButton
    } = renderSlidingPanel();
    await resizeElementScroll(1024, clientWidth);
    getRightButton().trigger('click');

    expect(scrollBySpy).toHaveBeenCalled();

    doScroll(50);
    await Vue.nextTick();
    getLeftButton().trigger('click');

    expect(scrollBySpy).toHaveBeenCalledTimes(2);
  });

  it(`allows customization of the buttons' content`, () => {
    const { getLeftButton, getRightButton } = renderSlidingPanel(
      `<SlidingPanel>
                 <template #sliding-panel-left-button>Patras</template>
                   <ul>
                     <li>Element 1</li>
                     <li>Element 2</li>
                     <li>Element 3</li>
                   </ul>
                 <template #sliding-panel-right-button>Palante</template>
               </SlidingPanel>`
    );

    expect(getLeftButton().text()).toEqual('Patras');
    expect(getRightButton().text()).toEqual('Palante');
  });

  it('allows to configure if to show or not the buttons', async () => {
    const { resizeElementScroll, doScroll, getLeftButton, getRightButton } = renderSlidingPanel(
      ` <SlidingPanel :showButtons="false">
                   <ul>
                     <li>Element 1</li>
                     <li>Element 2</li>
                     <li>Element 3</li>
                   </ul>
                 </SlidingPanel>`
    );

    // Resize to make both buttons visible
    doScroll(50);
    await resizeElementScroll(300, 200);

    expect(getLeftButton().element).not.toBeVisible();
    expect(getRightButton().element).not.toBeVisible();
  });

  it('scroll amount when clicking a button is configurable', async () => {
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
