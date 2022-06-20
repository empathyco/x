import { mount } from '@cypress/vue';
import Vue from 'vue';
import SlidingPanel from '../../src/components/sliding-panel.vue';
import { BaseXBus } from '../../src/plugins/x-bus';
import { XPlugin } from '../../src/plugins/x-plugin';
import { e2eAdapter } from '../../src/adapter/e2e-adapter';

/**
 * Renders an {@link SlidingPanel} component with the provided options.
 *
 * @param  options - Options to render {@link SlidingPanel} with.
 * @returns Helper methods for the rendered {@link SlidingPanel}.
 */
function renderSlidingPanel({
  items = 8,
  scrollFactor,
  resetOnContentChange,
  showButtons,
  buttonClass,
  slidingPanelWidthPx = 400,
  itemWidthPx = 100,
  template = `
      <div class="wrapper">
        <div><input v-model.number="items" data-test="items-count" /></div>
        <SlidingPanel v-bind="$attrs">
          <ul class="container">
            <li class="item" v-for="item in items" :key="item">Item {{ item }}</li>
          </ul>
        </SlidingPanel>
      </div>
  `
}: RenderSlidingPanelOptions = {}): RenderSlidingPanelAPI {
  XPlugin.resetInstance();

  mount(
    {
      components: {
        SlidingPanel
      },
      inheritAttrs: false,
      template,
      data() {
        return {
          items
        };
      }
    },
    {
      vue: Vue.extend({}),
      plugins: [[new XPlugin(new BaseXBus()), { adapter: e2eAdapter }]],
      propsData: {
        scrollFactor,
        resetOnContentChange,
        showButtons,
        buttonClass
      },
      style: `
        .wrapper {
          display: inline-flex;
          flex-flow: column nowrap;
        }
        .x-sliding-panel__scroll {
          flex: 0 0 auto !important;
          width: ${slidingPanelWidthPx}px;
        }

        .container {
          display: flex;
          flex-flow: row nowrap;
          padding: 0;
          list-style: none;
        }

        .item {
          flex: 0 0 auto;
          width: ${itemWidthPx}px;
        }`
    }
  );

  return {
    getSlidingPanel() {
      return cy.getByDataTest('sliding-panel');
    },
    getLeftButton() {
      return cy.getByDataTest('sliding-panel-left-button');
    },
    getRightButton() {
      return cy.getByDataTest('sliding-panel-right-button');
    },
    getScrollPosition() {
      return cy.getByDataTest('sliding-panel-scroll').invoke('scrollLeft');
    },
    scrollTo(position) {
      cy.getByDataTest('sliding-panel-scroll').scrollTo(position, 0, {
        easing: 'linear',
        duration: 500
      });
    },
    setScrollWidth(widthPx) {
      cy.getByDataTest('sliding-panel-scroll').then($scroll => {
        $scroll.css('width', `${widthPx}px`);
      });
    },
    setItemsCount(itemsCountCount) {
      cy.getByDataTest('items-count').type(`${itemsCountCount}`);
    }
  };
}

describe('Testing sliding panel', () => {
  it('shows the scroll buttons only when needed', () => {
    const { getLeftButton, getRightButton, getScrollPosition, scrollTo } = renderSlidingPanel({
      items: 10,
      itemWidthPx: 100,
      slidingPanelWidthPx: 400,
      scrollFactor: 1
    });

    getLeftButton().should('not.be.visible');
    getRightButton().should('be.visible').click();
    getScrollPosition().should('be.equal', 400);
    getLeftButton().should('be.visible');

    getRightButton().should('be.visible').click();
    getScrollPosition().should('be.equal', 600);
    getRightButton().should('not.be.visible');
    getLeftButton().should('be.visible');

    scrollTo(200);
    getLeftButton().should('be.visible');
    getRightButton().should('be.visible');

    scrollTo(0);
    getLeftButton().should('not.be.visible');
    getRightButton().should('be.visible');

    scrollTo(600);
    getLeftButton().should('be.visible');
    getRightButton().should('not.be.visible');
  });

  it('allows hiding the scroll buttons', () => {
    const { getLeftButton, getRightButton, scrollTo } = renderSlidingPanel({ showButtons: false });

    scrollTo(1);
    getLeftButton().should('not.exist');
    getRightButton().should('not.exist');
  });

  it('adds scroll position classes properly', () => {
    const { scrollTo, getSlidingPanel } = renderSlidingPanel({
      slidingPanelWidthPx: 500,
      items: 10,
      itemWidthPx: 100
    });

    getSlidingPanel()
      .should('have.class', 'x-sliding-panel--at-start')
      .should('not.have.class', 'x-sliding-panel--at-end');

    scrollTo(200);
    getSlidingPanel()
      .should('not.have.class', 'x-sliding-panel--at-start')
      .should('not.have.class', 'x-sliding-panel--at-end');

    scrollTo(500);
    getSlidingPanel()
      .should('not.have.class', 'x-sliding-panel--at-start')
      .should('have.class', 'x-sliding-panel--at-end');
  });

  it('allows to configure the scroll amount for each button', () => {
    const { getLeftButton, getRightButton, getScrollPosition } = renderSlidingPanel({
      items: 10,
      scrollFactor: 0.5,
      slidingPanelWidthPx: 500,
      itemWidthPx: 100
    });

    getRightButton().click();
    getScrollPosition().should('be.equal', 250);

    getRightButton().click();
    getScrollPosition().should('be.equal', 500);

    getLeftButton().click();
    getScrollPosition().should('be.equal', 250);

    getLeftButton().click();
    getScrollPosition().should('be.equal', 0);
  });

  it('allows to configure scroll buttons content', () => {
    const { getLeftButton, getRightButton } = renderSlidingPanel({
      template: `
        <SlidingPanel>
          <template #sliding-panel-left-button>Left</template>
          <div class="width: 1000px;">Sample Content</div>
          <template #sliding-panel-right-button>Right</template>
        </SlidingPanel>`
    });

    getLeftButton().should('have.text', 'Left');
    getRightButton().should('have.text', 'Right');
  });

  it('updates scroll buttons visibility when resized', () => {
    const { getLeftButton, getRightButton, scrollTo, setScrollWidth } = renderSlidingPanel({
      items: 10,
      itemWidthPx: 100,
      slidingPanelWidthPx: 400
    });

    getLeftButton().should('not.be.visible');
    getRightButton().should('be.visible');

    scrollTo(200);
    getLeftButton().should('be.visible');
    getRightButton().should('be.visible');

    setScrollWidth(800);
    getLeftButton().should('be.visible');
    getRightButton().should('not.be.visible');

    setScrollWidth(1000);
    getLeftButton().should('not.be.visible');
    getRightButton().should('not.be.visible');
  });

  it('resets the scroll when content changes', () => {
    const { getLeftButton, getRightButton, scrollTo, getScrollPosition, setItemsCount } =
      renderSlidingPanel();

    scrollTo(100);
    getRightButton().should('be.visible');
    getLeftButton().should('be.visible');

    setItemsCount(42);
    getScrollPosition().should('be.equal', 0);
    getLeftButton().should('not.be.visible');
    getRightButton().should('be.visible');
  });

  it('allows disabling resetting the scroll when content changes', () => {
    const { getLeftButton, getRightButton, getScrollPosition, setItemsCount, scrollTo } =
      renderSlidingPanel({
        resetOnContentChange: false
      });

    scrollTo(100);
    getRightButton().should('be.visible');
    getLeftButton().should('be.visible');

    setItemsCount(42);
    getScrollPosition().should('be.equal', 100);
    getLeftButton().should('be.visible');
    getRightButton().should('be.visible');
  });

  it('allows adding CSS classes to the buttons', () => {
    const { getLeftButton, getRightButton, scrollTo } = renderSlidingPanel({
      buttonClass: 'test-x-button--round'
    });

    scrollTo(100);
    getRightButton().should('be.visible').should('have.class', 'test-x-button--round');
    getLeftButton().should('be.visible').should('have.class', 'test-x-button--round');
  });
});

interface RenderSlidingPanelOptions {
  /** The amount of items to render. */
  items?: number;
  /** The width of each item. */
  itemWidthPx?: number;
  /** The width of the scroll of the sliding panel. */
  slidingPanelWidthPx?: number;
  /** The template to render. */
  template?: string;
  /** The {@link SlidingPanel.scrollFactor} prop. */
  scrollFactor?: number;
  /** The {@link SlidingPanel.resetOnContentChange} prop. */
  resetOnContentChange?: boolean;
  /** The {@link SlidingPanel.showButtons} prop. */
  showButtons?: boolean;
  /** The {@link SlidingPanel.buttonClass} prop. */
  buttonClass?: string;
}

interface RenderSlidingPanelAPI {
  /** Retrieves the sliding panel. */
  getSlidingPanel: () => Cypress.Chainable<JQuery>;
  /** Retrieves the left button of the sliding panel. */
  getLeftButton: () => Cypress.Chainable<JQuery>;
  /** Retrieves the right button of the sliding panel. */
  getRightButton: () => Cypress.Chainable<JQuery>;
  /** Retrieves the scrolled distance of the sliding panel. */
  getScrollPosition: () => Cypress.Chainable<number>;
  /**
   * Manually scrolls to the desired position.
   *
   * @param position - The distance that should be scrolled.
   */
  scrollTo: (position: number) => void;
  /**
   * Updates the sliding panel scroll container width.
   *
   * @param widthPx - The width in pixels for the scrollable container.
   */
  setScrollWidth: (widthPx: number) => void;
  /**
   * Updates the amount of items rendered in the sliding panel.
   *
   * @param itemsCount - The amount of items render.
   */
  setItemsCount: (itemsCount: number) => void;
}
