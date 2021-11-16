import { mount } from '@cypress/vue';
import 'reflect-metadata';
import Vue from 'vue';
import { mockedAdapter } from '../../src/adapter/mocked-adapter';
import { XPlugin, xPlugin } from '../../src/plugins/x-plugin';
import { UrlParams } from '../../src/types/url-params';
import MainScrollItem from '../../src/x-modules/scroll/components/main-scroll-item.vue';
import MainScroll from '../../src/x-modules/scroll/components/main-scroll.vue';
import Scroll from '../../src/x-modules/scroll/components/scroll.vue';

/**
 * Renders a {@link MainScroll} component with the provided options.
 *
 * @param options - The options to render this component with.
 * @returns An API to test the {@link MainScroll} component.
 */
function renderMainScroll({
  itemsCount = 10,
  threshold,
  margin
}: RenderMainScrollOptions = {}): RenderMainScrollAPI {
  const userScrolledToElementSpy = cy.spy();
  XPlugin.bus.on('UserScrolledToElement').subscribe(userScrolledToElementSpy);

  mount({
    components: {
      Scroll,
      MainScroll,
      MainScrollItem
    },
    template: `
      <MainScroll style="height:200px" v-bind="{ threshold, margin }">
      <Scroll>
        <MainScrollItem
          v-for="item in items"
          tag="article"
          :item="item"
          :data-test="item.id"
          style="height:50px">
          {{ item.id }}
        </MainScrollItem>
      </Scroll>
      </MainScroll>
    `,
    data() {
      return {
        items: Array.from({ length: itemsCount }, (_, index) => ({ id: `item-${index}` })),
        threshold,
        margin
      };
    }
  });
  return {
    scrollToItem(index) {
      cy.getByDataTest(`item-${index}`).scrollIntoView({ easing: 'linear', duration: 50 });
    },
    restoreScroll(index) {
      XPlugin.bus.emit('ParamsLoadedFromUrl', <UrlParams>{ scroll: `item-${index}` });
    },
    getItem(index) {
      return cy.getByDataTest(`item-${index}`);
    },
    userScrolledToElementSpy: () => cy.wrap(userScrolledToElementSpy)
  };
}

before(() => {
  Vue.use(xPlugin, { adapter: mockedAdapter });
});

describe('testing MainScroll component', () => {
  it('emits the first visible element', () => {
    const { scrollToItem, userScrolledToElementSpy } = renderMainScroll();
    userScrolledToElementSpy()
      .should('have.been.calledOnce')
      .should('have.been.calledWith', 'item-0');

    scrollToItem(5);
    userScrolledToElementSpy().should('have.been.calledWith', 'item-5');
  });

  it('restores the scroll', () => {
    const { restoreScroll, getItem } = renderMainScroll();

    restoreScroll(5);
    cy.getByDataTest('base-scroll').then($scroll => {
      cy.log('Item 5 should be the first one.');
      getItem(5).should($item5 => {
        expect($item5.position().top).to.be.gte($scroll.position().top);
      });
      cy.log("Item 4 shouldn' be visible");
      getItem(4).should($item4 => {
        const item4Bottom = $item4.position().top + $item4.outerHeight()!;
        expect(item4Bottom).to.be.lte($scroll.position().top);
      });
    });
  });

  it('allows configuring when to consider an element visible', () => {
    const { scrollToItem, userScrolledToElementSpy } = renderMainScroll({ threshold: 1 });

    scrollToItem(5);
    userScrolledToElementSpy().should('have.been.calledWith', 'item-5');
    userScrolledToElementSpy().should('not.have.been.calledWith', 'item-6');
    cy.getByDataTest('base-scroll').then($scroll => {
      $scroll.scrollTop($scroll.scrollTop()! + 1);
    });
    userScrolledToElementSpy().should('have.been.calledWith', 'item-6');
  });

  it('allows configuring the bounds of the intersection', () => {
    const { scrollToItem, userScrolledToElementSpy } = renderMainScroll({ margin: '-25px' });

    scrollToItem(5);
    userScrolledToElementSpy().should('have.been.calledWith', 'item-5');
    userScrolledToElementSpy().should('not.have.been.calledWith', 'item-6');
    cy.getByDataTest('base-scroll').then($scroll => {
      $scroll.scrollTop($scroll.scrollTop()! + 25);
    });
    userScrolledToElementSpy().should('have.been.calledWith', 'item-6');
  });
});

/**
 * Options to render the {@link MainScroll} component with.
 */
interface RenderMainScrollOptions {
  /** Number of elements to render. */
  itemsCount?: number;
  /** Bounds to adjust the size of the rect that the items should intersect with to be considered
   * visible. */
  margin?: string;
  /** The percentage of an element that should be visible to consider it the first one. */
  threshold?: number;
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
  restoreScroll: (index: number) => void;
  /**
   * Scrolls the nth element in the view.
   *
   * @param index - The index of the element to scroll in the view.
   */
  scrollToItem: (index: number) => void;
  /** Spy of {@link ScrollXEvents.UserScrolledToElement}. */
  userScrolledToElementSpy: () => Cypress.Chainable<Cypress.SinonSpyAgent<any>>;
}
