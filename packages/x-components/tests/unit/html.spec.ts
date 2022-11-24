import { getTargetElement } from '../../src/utils/html';

describe(`testing ${getTargetElement.name} utility method`, () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  /**
   * Create a HTMLButtonElement inside a HTMLDivElement container.
   *
   * @returns Tuple with container as first item, and button as second.
   * @internal
   */
  function createBasicDOMTree(): [HTMLDivElement, HTMLButtonElement] {
    const container = document.createElement('div');
    const button = container.appendChild(document.createElement('button'));
    button.textContent = 'Click';

    return [container, button];
  }

  /**
   * Create a ShadowRoot inside a HTMLDivElement container. Basic DOM tree is appended to
   * shadowRoot.
   *
   * @param mode - Shadow encapsulation mode.
   * @returns Tuple with shadow container as first item, and button as second.
   */
  function createShadowDOMTree(mode: 'open' | 'closed'): [HTMLDivElement, HTMLButtonElement] {
    const [container, button] = createBasicDOMTree();

    const shadowContainer = document.createElement('div');
    const shadowRoot = shadowContainer.attachShadow({ mode });
    shadowRoot.appendChild(container);

    return [shadowContainer, button];
  }

  it('returns the element that triggered the event', () => {
    const [container, button] = createBasicDOMTree();
    document.body.appendChild(container);
    const spy = cy.spy(getTargetElement);
    container.addEventListener('click', spy);
    button.click();
    cy.wrap(spy).should('have.callCount', 1);
    cy.wrap(spy).should('have.returned', button);
  });

  it('returns the element that triggered the event in a opened shadow DOM context', () => {
    const [shadowContainer, button] = createShadowDOMTree('open');
    document.body.appendChild(shadowContainer);
    const spy = cy.spy(getTargetElement);
    shadowContainer.addEventListener('click', spy);
    button.click();
    cy.wrap(spy).should('have.callCount', 1);
    cy.wrap(spy).should('have.returned', button);
  });

  it("doesn't return the element that triggered the event in a closed shadow DOM context", () => {
    const [shadowContainer, button] = createShadowDOMTree('closed');
    document.body.appendChild(shadowContainer);
    const spy = cy.spy(getTargetElement);
    shadowContainer.addEventListener('click', spy);
    button.click();
    cy.wrap(spy).should('have.callCount', 1);
    cy.wrap(spy).should('have.returned', shadowContainer);
  });
});
