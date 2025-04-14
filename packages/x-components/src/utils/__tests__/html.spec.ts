import { getActiveElement, isElementEqualOrContained } from '../html'

describe(`testing ${isElementEqualOrContained.name} utility method`, () => {
  it('returns `true` the two elements are the same', () => {
    const element = document.createElement('div')

    expect(isElementEqualOrContained(element, element)).toBe(true)
  })

  it('returns `true` the first element contains the second one', () => {
    const a = document.createElement('div')
    const b = document.createElement('div')
    const c = document.createElement('div')
    a.appendChild(b)
    b.appendChild(c)

    expect(isElementEqualOrContained(a, c)).toBe(true)
  })

  it('returns `false` when the two elements have no relation', () => {
    const a = document.createElement('div')
    const b = document.createElement('div')

    expect(isElementEqualOrContained(a, b)).toBe(false)
  })
})

describe('getActiveElement', () => {
  it('returns body when there is no active element', () => {
    document.body.innerHTML = '' // Clear the body to ensure no active element
    expect(getActiveElement()).toBe(document.body)
  })

  it('returns the active element when it is directly on the document', () => {
    document.body.innerHTML = '<input id="testInput" />'
    const testInput = document.getElementById('testInput')!
    testInput.focus()
    expect(getActiveElement()).toBe(testInput)
  })

  it('returns the deepest active element within a shadow DOM', () => {
    document.body.innerHTML = '<div id="shadowHost"></div>'
    const shadowHost = document.getElementById('shadowHost')!
    const shadowRoot = shadowHost.attachShadow({ mode: 'open' })
    shadowRoot.innerHTML = '<input id="shadowInput">'
    const shadowInput = shadowRoot.getElementById('shadowInput')!
    shadowInput.focus()
    expect(getActiveElement(shadowRoot)).toBe(shadowInput)
  })

  it('returns the active element when nested in multiple shadow DOMs', () => {
    document.body.innerHTML = '<div id="outerShadowHost"></div>'
    const outerShadowHost = document.getElementById('outerShadowHost')!
    const outerShadowRoot = outerShadowHost.attachShadow({ mode: 'open' })
    outerShadowRoot.innerHTML = '<div id="innerShadowHost"></div>'
    const innerShadowHost = outerShadowRoot.getElementById('innerShadowHost')!
    const innerShadowRoot = innerShadowHost.attachShadow({ mode: 'open' })
    innerShadowRoot.innerHTML = '<input id="deepShadowInput">'
    const deepShadowInput = innerShadowRoot.getElementById('deepShadowInput')!
    deepShadowInput.focus()
    expect(getActiveElement(outerShadowRoot)).toBe(deepShadowInput)
  })
})
