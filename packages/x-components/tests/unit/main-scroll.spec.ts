import { mount } from '@cypress/vue';
import Vue from 'vue';
import StaggeredFadeAndSlide from '../../src/components/animations/staggered-fade-and-slide.vue';
import { BaseXBus } from '../../src/plugins/x-bus';
import { XPlugin } from '../../src/plugins/x-plugin';
import { UrlParams } from '../../src/types/url-params';
import MainScrollItem from '../../src/x-modules/scroll/components/main-scroll-item.vue';
import MainScroll from '../../src/x-modules/scroll/components/main-scroll.vue';
import { scrollXModule } from '../../src/x-modules/scroll/x-module';
import { e2eAdapter } from '../../src/adapter/e2e-adapter';

/**
 * Renders a {@link MainScroll} component with the provided options.
 *
 * @param options - The options to render this component with.
 * @returns An API to test the {@link MainScroll} component.
 */
function renderMainScroll({
  itemsCount = 10,
  itemHeight = '50px',
  threshold,
  margin,
  useWindow,
  windowScrollingElement,
  template = `
      <MainScroll v-bind="{ threshold, margin, useWindow }">
        <div class="container" ${!useWindow ? `data-test="scroll"` : ''}>
          <MainScrollItem
            v-for="item in items"
            class="item"
            tag="article"
            :item="item"
            :data-test="item.id">
            {{ item.id }}
          </MainScrollItem>
        </div>
      </MainScroll>
  `
}: RenderMainScrollOptions = {}): RenderMainScrollAPI {
  const userScrolledToElementSpy = cy.spy();
  XPlugin.resetInstance();

  document.body.dataset.test = document.documentElement.dataset.test = '';
  if (windowScrollingElement === 'body') {
    document.body.dataset.test = 'scroll';
  } else if (windowScrollingElement === 'html') {
    document.documentElement.dataset.test = 'scroll';
  }

  let pendingScroll: number;

  cy.viewport(1920, 200);
  mount(
    {
      components: {
        MainScroll,
        MainScrollItem,
        StaggeredFadeAndSlide
      },
      template,
      data() {
        return {
          items: Array.from({ length: itemsCount }, (_, index) => ({ id: `item-${index}` })),
          threshold,
          margin,
          useWindow
        };
      },
      beforeCreate() {
        XPlugin.bus.on('UserScrolledToElement').subscribe(userScrolledToElementSpy);
        if (pendingScroll) {
          XPlugin.bus.emit('ParamsLoadedFromUrl', <UrlParams>{ scroll: `item-${pendingScroll}` });
        }
      }
    },
    {
      vue: Vue.extend({}),
      plugins: [
        [new XPlugin(new BaseXBus()), { adapter: e2eAdapter, initialXModules: [scrollXModule] }]
      ],
      style: `
        ${windowScrollingElement === 'body' ? 'html { overflow: hidden; }' : ''}

        html,
        body,
        #__cy_root {
          margin: 0;
          height: 100%;
          max-height: 100%;
        }

        [data-test='scroll'] {
          overflow: auto;
          height: 100%;
        }

        .item {
          height: ${itemHeight};
        }`
    }
  );

  return {
    scrollToItem(index) {
      cy.getByDataTest(`item-${index}`).then($0 => $0.get(0).scrollIntoView());
    },
    scrollBy(y) {
      return cy.getByDataTest('scroll').then($0 => {
        $0.get(0).scrollBy(0, y);
      });
    },
    restoreScrollToItem(index) {
      pendingScroll = index;
    },
    getItem(index) {
      return cy.getByDataTest(`item-${index}`);
    },
    getScrollingElement() {
      return cy.getByDataTest('scroll');
    },
    userScrolledToElementSpy: () => cy.wrap(userScrolledToElementSpy)
  };
}

describe('testing MainScroll component', () => {
  const cases: Array<Partial<RenderMainScrollOptions> & { description: string }> = [
    { description: 'when using the html element', useWindow: true, windowScrollingElement: 'html' },
    { description: 'when using the body element', useWindow: true, windowScrollingElement: 'body' },
    { description: 'when using a custom scrolling element' }
  ];

  cases.forEach(({ description, ...defaultParameters }) => {
    describe(description, () => {
      it('emits the first visible element', () => {
        const { scrollToItem, userScrolledToElementSpy } = renderMainScroll(defaultParameters);
        userScrolledToElementSpy()
          .should('have.been.calledOnce')
          .should('have.been.calledWith', '');

        scrollToItem(5);
        userScrolledToElementSpy().should('have.been.calledWith', 'item-5');
      });

      it('ignores the first element of scroll', () => {
        const { scrollToItem, userScrolledToElementSpy } = renderMainScroll(defaultParameters);
        scrollToItem(1);
        userScrolledToElementSpy().should('have.been.calledWith', 'item-1');
        userScrolledToElementSpy().should('not.have.been.calledWith', 'item-0');

        scrollToItem(0);
        userScrolledToElementSpy().should('not.have.been.calledWith', 'item-0');
      });

      it('restores the scroll', () => {
        const { restoreScrollToItem, getItem } = renderMainScroll(defaultParameters);

        restoreScrollToItem(5);

        cy.log('Item 5 should be the first one.');
        getItem(5).should($item5 => {
          expect($item5.get(0).getBoundingClientRect().top).to.be.eq(0);
        });
        cy.log("Item 4 shouldn't be visible");
        getItem(4).should($item4 => {
          const item4Bounds = $item4.get(0).getBoundingClientRect();
          const item4Bottom = item4Bounds.top + item4Bounds.height;
          expect(item4Bottom).to.be.eq(0);
        });
      });

      it('restores the scroll with transitions enabled', () => {
        const { restoreScrollToItem, getItem } = renderMainScroll({
          ...defaultParameters,
          template: `
            <MainScroll v-bind="{ threshold, margin, useWindow }">
              <div data-test="main-scroll">
                <StaggeredFadeAndSlide>
                  <MainScrollItem
                    v-for="item in items"
                    class="item"
                    tag="article"
                    :item="item"
                    :data-test="item.id"
                    :key="item.id">
                    {{ item.id }}
                  </MainScrollItem>
                </StaggeredFadeAndSlide>
              </div>
            </MainScroll>
          `
        });

        restoreScrollToItem(5);

        cy.log('Item 5 should be the first one.');
        getItem(5)
          .should('be.visible')
          .should($item5 => {
            expect($item5.get(0).getBoundingClientRect().top).to.be.eq(0);
          });
        cy.log("Item 4 shouldn't be visible");
        getItem(4).should($item4 => {
          const item4Bounds = $item4.get(0).getBoundingClientRect();
          const item4Bottom = item4Bounds.top + item4Bounds.height;
          expect(item4Bottom).to.be.eq(0);
        });
      });

      it('allows configuring when to consider an element visible', () => {
        const { scrollToItem, userScrolledToElementSpy, scrollBy } = renderMainScroll({
          ...defaultParameters,
          threshold: 1
        });

        scrollToItem(5);
        /* The 5th element should be top aligned now. Because of the threshold=1, it still is the
         first visible element.  */
        userScrolledToElementSpy().should('have.been.calledWith', 'item-5');
        userScrolledToElementSpy().should('not.have.been.calledWith', 'item-6');
        /* By just scrolling 1 px down, as we require the 100% of the element to intersect to be
         considered visible, the 5th element does no longer meet this condition. Therefore the 6th
         element is considered the first one.  */
        scrollBy(1);
        userScrolledToElementSpy().should('have.been.calledWith', 'item-6');
      });

      it('allows configuring the bounds of the intersection', () => {
        const { scrollToItem, userScrolledToElementSpy, scrollBy } = renderMainScroll({
          ...defaultParameters,
          margin: '-25px 0px 0px 0px',
          threshold: 0.5,
          itemHeight: '50px'
        });

        scrollToItem(5);
        /* The 5th element should be top aligned now. Because of the 25px negative margin, the
         threshold set at 0.5, and its 50px height, it should still be considered the first visible
         element.  */
        userScrolledToElementSpy().should('have.been.calledWith', 'item-5');
        userScrolledToElementSpy().should('not.have.been.calledWith', 'item-6');
        /* With this configuration, by just scrolling 1 pixel down, the first visible item should
         be considered the 6th element. */
        scrollBy(1);
        userScrolledToElementSpy().should('have.been.calledWith', 'item-6');
      });
    });
  });
});

/**
 * Options to render the {@link MainScroll} component with.
 */
interface RenderMainScrollOptions {
  /** Number of elements to render. */
  itemsCount?: number;
  /**
   * Bounds to adjust the size of the rect that the items should intersect with to be considered
   * visible.
   */
  margin?: string;
  /** The percentage of an element that should be visible to consider it the first one. */
  threshold?: number;
  /** The height of each one of the items. */
  itemHeight?: string;
  /** The template to render.*/
  template?: string;
  /** Enables listening to the global scroll instead of the wrapping element scroll. */
  useWindow?: boolean;
  /** When `useWindow=true`, the element that should be scrollable. */
  windowScrollingElement?: 'body' | 'html';
}

/**
 * Test API for the {@link MainScroll} component.
 */
interface RenderMainScrollAPI {
  /**
   * Retrieves the element with the given index.
   *
   * @param index - The index of the element to retrieve.
   * @returns A Cypress object containing the target element.
   */
  getItem: (index: number) => Cypress.Chainable<JQuery>;
  /**
   * Restores the scroll to the element with the given index.
   *
   * @param index - The index of the element to restore the scroll to.
   */
  restoreScrollToItem: (index: number) => void;
  /**
   * Scrolls the nth element in the view.
   *
   * @param index - The index of the element to scroll in the view.
   */
  scrollToItem: (index: number) => void;
  /**
   * Scrolls the container by the given amount of pixels.
   *
   * @param y - The amount of pixels to scroll in the y axis.
   * @returns The scrolling container.
   */
  scrollBy: (y: number) => Cypress.Chainable<JQuery>;
  /**
   * Retrieves the scrolling item.
   *
   * @returns A cypress wrapped scrolling item.
   */
  getScrollingElement: () => Cypress.Chainable<JQuery>;
  /** Spy of {@link ScrollXEvents.UserScrolledToElement}. */
  userScrolledToElementSpy: () => Cypress.Chainable<Cypress.SinonSpyAgent<any>>;
}
