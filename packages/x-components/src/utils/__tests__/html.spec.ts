import { getTargetElement, isElementEqualOrContained } from '../html';

describe(`testing ${isElementEqualOrContained.name} utility method`, () => {
  it('returns `true` the two elements are the same', () => {
    const element = document.createElement('div');

    expect(isElementEqualOrContained(element, element)).toBe(true);
  });

  it('returns `true` the first element contains the second one', () => {
    const a = document.createElement('div');
    const b = document.createElement('div');
    const c = document.createElement('div');
    a.appendChild(b);
    b.appendChild(c);

    expect(isElementEqualOrContained(a, c)).toBe(true);
  });

  it('returns `false` when the two elements have no relation', () => {
    const a = document.createElement('div');
    const b = document.createElement('div');

    expect(isElementEqualOrContained(a, b)).toBe(false);
  });
});

describe(`testing ${getTargetElement.name} utility method`, () => {
  function createBasicDOMTree(): [HTMLDivElement, HTMLButtonElement] {
    const button = document.createElement('button');
    const container = document.createElement('div');
    container.appendChild(button);

    return [container, button];
  }

  function createShadowDOMTree(mode: 'open' | 'closed'): [HTMLDivElement, HTMLButtonElement] {
    const [container, button] = createBasicDOMTree();

    const shadowContainer = document.createElement('div');
    const shadowRoot = shadowContainer.attachShadow({ mode });
    shadowRoot.appendChild(container);

    return [shadowContainer, button];
  }

  it('returns the element that triggered the event', () => {
    expect.assertions(1);
    const [container, button] = createBasicDOMTree();

    container.addEventListener('click', ev => {
      expect(getTargetElement(ev)).toBe(button);
    });
    button.click();
  });

  it('uses the `event.target` fallback if `composedPath` method is empty', () => {
    expect.assertions(1);
    const [container, button] = createBasicDOMTree();

    container.addEventListener('click', ev => {
      ev.composedPath = () => [];
      expect(getTargetElement(ev)).toBe(button);
    });
    button.click();
  });

  it('returns the element that triggered the event in a opened shadow DOM context', () => {
    expect.assertions(1);
    const [shadowContainer, button] = createShadowDOMTree('open');

    shadowContainer.addEventListener('click', ev => {
      expect(getTargetElement(ev)).toBe(button);
    });
    button.click();
  });

  it(`doesn't return the element that triggered the event if \`composedPath\` method is empty
  in a opened shadow DOM context`, () => {
    expect.assertions(2);
    const [shadowContainer, button] = createShadowDOMTree('open');

    shadowContainer.addEventListener('click', ev => {
      ev.composedPath = () => [];
      expect(getTargetElement(ev)).not.toBe(button);
      expect(getTargetElement(ev)).toBe(shadowContainer);
    });
    button.click();
  });

  it("doesn't return the element that triggered the event in a closed shadow DOM context", () => {
    expect.assertions(2);
    const [shadowContainer, button] = createShadowDOMTree('closed');

    shadowContainer.addEventListener('click', ev => {
      expect(getTargetElement(ev)).not.toBe(button);
      expect(getTargetElement(ev)).toBe(shadowContainer);
    });
    button.click();
  });
});
