import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { RootXStoreState } from '../../store/store.types';
import { DeepPartial } from '../../utils/types';
import RelatedTags from '../../x-modules/related-tags/components/related-tags.vue';
// eslint-disable-next-line max-len
import { resetStoreRelatedTagsState } from '../../x-modules/related-tags/components/__tests__/utils';
import { getRelatedTagsStub } from '../../__stubs__/related-tags-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../__tests__/utils';
import { default as SlidingPanel } from '../sliding-panel.vue';

jest.useFakeTimers();

describe('testing sliding panel component', () => {
  let slidingPanelWrapper: Wrapper<Vue>;

  beforeEach(() => {
    const wrapperComponent = {
      template: `
          <SlidingPanel>
            <ul>
              <li>Element 1</li>
              <li>Element 2</li>
              <li>Element 3</li>
            </ul>
          </SlidingPanel>`,
      components: {
        SlidingPanel
      }
    };

    slidingPanelWrapper = mount(wrapperComponent);
  });

  it('renders a list of elements inside the sliding panel', () => {
    slidingPanelWrapper.findAll('li').wrappers.forEach((item, index) => {
      expect(item.element.innerHTML).toEqual(`Element ${index + 1}`);
    });
  });

  it('allows a component as slot content', () => {
    const relatedTags = getRelatedTagsStub();
    const localVue = createLocalVue();
    localVue.use(Vuex);

    const store = new Store<DeepPartial<RootXStoreState>>({});
    installNewXPlugin({ store }, localVue);

    resetStoreRelatedTagsState(store, { relatedTags });
    const wrapperComponentRelated = {
      template: `
          <SlidingPanel>
            <RelatedTags />
          </SlidingPanel>`,
      components: {
        SlidingPanel,
        RelatedTags
      }
    };

    slidingPanelWrapper = mount(wrapperComponentRelated, { localVue, store });
    const eventButtonsList = slidingPanelWrapper.findAll(getDataTestSelector('related-tag'));
    relatedTags.forEach((relatedTag, index) => {
      expect(eventButtonsList.at(index).element.innerHTML).toEqual(relatedTag.tag);
    });
  });

  it("doesn't show the buttons if the scroll is not needed", async () => {
    const slidingPanelElement = getSlidingPanelScrollElement(slidingPanelWrapper);
    await resizeElementScroll(slidingPanelElement, 300, 300);

    expect(getNavigationButtonElement(slidingPanelWrapper, 'left')).not.toBeVisible();
    expect(getNavigationButtonElement(slidingPanelWrapper, 'right')).not.toBeVisible();
  });

  it("shows the buttons when the window resizes and they're needed", async () => {
    const slidingPanelElement = getSlidingPanelScrollElement(slidingPanelWrapper);
    await resizeElementScroll(slidingPanelElement, 300, 300);

    expect(getNavigationButtonElement(slidingPanelWrapper, 'left')).not.toBeVisible();
    expect(getNavigationButtonElement(slidingPanelWrapper, 'right')).not.toBeVisible();

    await resizeElementScroll(slidingPanelElement, 300, 200);

    expect(getNavigationButtonElement(slidingPanelWrapper, 'right')).toBeVisible();
  });

  it("shows the 'go right' button when the scroll is needed and it is at the start", async () => {
    const slidingPanelElement = getSlidingPanelScrollElement(slidingPanelWrapper);
    await resizeElementScroll(slidingPanelElement, 300, 200);

    expect(getNavigationButtonElement(slidingPanelWrapper, 'left')).not.toBeVisible();
    expect(getNavigationButtonElement(slidingPanelWrapper, 'right')).toBeVisible();
  });

  it(
    "shows the 'go left' and 'go right' buttons when the scroll is needed and it is" +
      ' not at start nor end',
    async () => {
      const slidingPanelElement = getSlidingPanelScrollElement(slidingPanelWrapper);
      slidingPanelElement.scrollLeft = 50;
      await resizeElementScroll(slidingPanelElement, 300, 200);

      expect(getNavigationButtonElement(slidingPanelWrapper, 'left')).toBeVisible();
      expect(getNavigationButtonElement(slidingPanelWrapper, 'right')).toBeVisible();
    }
  );

  it("shows the 'go left' button when the scroll is needed and it's at the end", async () => {
    const mockedScrollWidth = 350;
    const mockedClientWidth = 300;
    const slidingPanelElement = getSlidingPanelScrollElement(slidingPanelWrapper);
    slidingPanelElement.scrollLeft = mockedScrollWidth - mockedClientWidth;
    await resizeElementScroll(slidingPanelElement, mockedScrollWidth, mockedClientWidth);

    expect(getNavigationButtonElement(slidingPanelWrapper, 'left')).toBeVisible();
    expect(getNavigationButtonElement(slidingPanelWrapper, 'right')).not.toBeVisible();
  });

  it('clicking the buttons scrolls the sliding panel', async () => {
    const mockedScrollBy = jest.fn();
    const clientWidth = 200;

    const slidingPanelElement = getSlidingPanelScrollElement(slidingPanelWrapper);
    Object.defineProperty(slidingPanelElement, 'scrollBy', { value: mockedScrollBy });
    await resizeElementScroll(slidingPanelElement, 1024, clientWidth);
    slidingPanelWrapper.find(getDataTestSelector('sliding-panel-right-button')).trigger('click');

    expect(mockedScrollBy).toHaveBeenCalled();

    slidingPanelElement.scrollLeft = 50;
    await Vue.nextTick();
    slidingPanelWrapper.find(getDataTestSelector('sliding-panel-left-button')).trigger('click');

    expect(mockedScrollBy).toHaveBeenCalledTimes(2);
  });

  it("allows customization of the buttons' content", () => {
    const wrapperComponent = {
      template: `
          <SlidingPanel>
          <template #sliding-panel-left-button>Patras</template>
            <ul>
              <li>Element 1</li>
              <li>Element 2</li>
              <li>Element 3</li>
            </ul>
          <template #sliding-panel-right-button>Palante</template>
          </SlidingPanel>`,
      components: {
        SlidingPanel
      }
    };
    slidingPanelWrapper = mount(wrapperComponent);

    expect(getNavigationButtonElement(slidingPanelWrapper, 'left').innerHTML).toEqual('Patras');
    expect(getNavigationButtonElement(slidingPanelWrapper, 'right').innerHTML).toEqual('Palante');
  });

  it('buttons appearing is configurable', async () => {
    const wrapperComponent = {
      template: `
          <SlidingPanel :showButtons="false">
            <ul>
              <li>Element 1</li>
              <li>Element 2</li>
              <li>Element 3</li>
            </ul>
          </SlidingPanel>`,
      components: {
        SlidingPanel
      }
    };

    slidingPanelWrapper = mount(wrapperComponent);

    // Resize to make both buttons visible
    const slidingPanelElement = getSlidingPanelScrollElement(slidingPanelWrapper);
    slidingPanelElement.scrollLeft = 50;
    await resizeElementScroll(slidingPanelElement, 300, 200);

    expect(getNavigationButtonElement(slidingPanelWrapper, 'left')).not.toBeVisible();
    expect(getNavigationButtonElement(slidingPanelWrapper, 'right')).not.toBeVisible();
  });

  it('scroll amount when clicking a button is configurable', async () => {
    const spyScrollBy = jest.fn();
    const clientWidth = 200;
    const scrollFactor = 1.2;
    const wrapperComponent = {
      template: `
          <SlidingPanel :scrollFactor="${scrollFactor}">
            <ul>
              <li>Element 1</li>
              <li>Element 2</li>
              <li>Element 3</li>
            </ul>
          </SlidingPanel>`,
      components: {
        SlidingPanel
      }
    };

    slidingPanelWrapper = mount(wrapperComponent);

    const slidingPanelElement = getSlidingPanelScrollElement(slidingPanelWrapper);
    Object.defineProperty(slidingPanelElement, 'scrollBy', { value: spyScrollBy });
    await resizeElementScroll(slidingPanelElement, 1024, clientWidth);
    slidingPanelWrapper.find(getDataTestSelector('sliding-panel-right-button')).trigger('click');

    expect(spyScrollBy).toHaveBeenCalledWith({
      left: clientWidth * scrollFactor,
      behavior: 'smooth'
    });
  });

  function getSlidingPanelScrollElement(slidingPanelWrapper: Wrapper<Vue>): Element {
    return slidingPanelWrapper.find(getDataTestSelector('sliding-panel-scroll')).element;
  }

  function getNavigationButtonElement(wrapper: Wrapper<Vue>, buttonDirection: string): Element {
    return wrapper.find(getDataTestSelector(`sliding-panel-${buttonDirection}-button`)).element;
  }

  async function resizeElementScroll(
    element: Element,
    scrollWidth: number,
    clientWidth: number
  ): Promise<void> {
    Object.defineProperty(element, 'scrollWidth', {
      writable: true,
      configurable: true,
      value: scrollWidth
    });
    Object.defineProperty(element, 'clientWidth', {
      writable: true,
      configurable: true,
      value: clientWidth
    });

    window.dispatchEvent(new Event('resize'));
    jest.runAllTimers();
    await Vue.nextTick();
  }
});
