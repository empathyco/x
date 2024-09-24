import { computed, h, ref } from 'vue';
import SlidingPanel from '../../src/components/sliding-panel.vue';
import { loadCss } from './css.utils';

function render({
  scrollFactor = 0.7,
  showButtons = true,
  resetOnContentChange = true,
  buttonClass = '',
  itemsCount = ref(10),
  slidingPanelWidthPx = 400,
  itemWidthPx = 100
} = {}) {
  loadCss(`
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
    }`);

  const items = computed(() =>
    Array.from({ length: itemsCount.value }, (_, index) => ({ id: `item-${index}` }))
  );

  cy.mount(() =>
    h('div', { class: 'wrapper' }, [
      h('input', {
        'data-test': 'items-count',
        value: itemsCount.value,
        onInput: event => (itemsCount.value = +(event.target as HTMLInputElement).value)
      }),
      h(
        SlidingPanel,
        { scrollFactor, showButtons, resetOnContentChange, buttonClass },
        h(
          'ul',
          { class: 'container' },
          items.value.map(item => h('li', { class: 'item', key: item.id }, item.id))
        )
      )
    ])
  );

  return {
    getSlidingPanel: () => cy.getByDataTest('sliding-panel'),
    getLeftButton: () => cy.getByDataTest('sliding-panel-left-button'),
    getRightButton: () => cy.getByDataTest('sliding-panel-right-button'),
    getScrollPosition: () => cy.getByDataTest('sliding-panel-scroll').invoke('scrollLeft'),
    scrollTo: (position: number) =>
      cy.getByDataTest('sliding-panel-scroll').scrollTo(position, 0, {
        easing: 'linear',
        duration: 500
      }),
    setScrollWidth: (widthPx: number) =>
      cy.getByDataTest('sliding-panel-scroll').then($scroll => {
        $scroll.css('width', `${widthPx}px`);
      }),
    setItemsCount: (itemsCountCount: number) =>
      cy.getByDataTest('items-count').type(`${itemsCountCount}`)
  };
}

describe('Testing sliding panel', () => {
  it('shows the scroll buttons only when needed', () => {
    const { getLeftButton, getRightButton, getScrollPosition, scrollTo } = render({
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
    const { getLeftButton, getRightButton, scrollTo } = render({
      showButtons: false
    });

    scrollTo(1);
    getLeftButton().should('not.exist');
    getRightButton().should('not.exist');
  });

  it('adds scroll position classes properly', () => {
    const { scrollTo, getSlidingPanel } = render({
      slidingPanelWidthPx: 500
    });

    getSlidingPanel()
      .should('have.class', 'x-sliding-panel-at-start')
      .should('not.have.class', 'x-sliding-panel-at-end');

    scrollTo(200);
    getSlidingPanel()
      .should('not.have.class', 'x-sliding-panel-at-start')
      .should('not.have.class', 'x-sliding-panel-at-end');

    scrollTo(500);
    getSlidingPanel()
      .should('not.have.class', 'x-sliding-panel-at-start')
      .should('have.class', 'x-sliding-panel-at-end');
  });

  it('allows to configure the scroll amount for each button', () => {
    const { getLeftButton, getRightButton, getScrollPosition } = render({
      scrollFactor: 0.5,
      slidingPanelWidthPx: 500
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
    cy.mount(() =>
      h(SlidingPanel, null, {
        default: () => 'Sample content',
        'sliding-panel-left-button': () => 'Left',
        'sliding-panel-right-button': () => 'Right'
      })
    );

    cy.getByDataTest('sliding-panel-left-button').should('have.text', 'Left');
    cy.getByDataTest('sliding-panel-right-button').should('have.text', 'Right');
  });

  it('updates scroll buttons visibility when resized', () => {
    const { getLeftButton, getRightButton, scrollTo, setScrollWidth } = render();

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
    const { getLeftButton, getRightButton, scrollTo, getScrollPosition, setItemsCount } = render();

    scrollTo(100);
    getRightButton().should('be.visible');
    getLeftButton().should('be.visible');

    setItemsCount(42);
    getScrollPosition().should('be.equal', 0);
    getLeftButton().should('not.be.visible');
    getRightButton().should('be.visible');
  });

  it('allows disabling resetting the scroll when content changes', () => {
    const { getLeftButton, getRightButton, getScrollPosition, setItemsCount, scrollTo } = render({
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
    const { getLeftButton, getRightButton, scrollTo } = render({
      buttonClass: 'test-x-button--round'
    });

    scrollTo(100);
    getRightButton().should('be.visible').should('have.class', 'test-x-button--round');
    getLeftButton().should('be.visible').should('have.class', 'test-x-button--round');
  });
});
