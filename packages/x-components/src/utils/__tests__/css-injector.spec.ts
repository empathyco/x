import type { WindowWithInjector } from '../css-injector/css-injector.types'
import { cssInjector as injector } from '../css-injector/css-injector'

// NOTE: this test is expected to run secuentialy
describe('test custom css injector', () => {
  it('is appended to the window under xCSSInjector', () => {
    expect((window as WindowWithInjector).xCSSInjector).toBe(injector)
  })

  it('can remove host', () => {
    // TODO: after remove the deprecated method: injector.addHost(document)
    expect(injector.hosts.size).toBe(1)

    injector.removeHost(document)

    expect(injector.hosts.size).toBe(0)
  })

  it('can add host', () => {
    const domElement = document.createElement('div')
    const shadowRoot = domElement.attachShadow({ mode: 'open' })

    expect(injector.hosts.size).toBe(0)

    injector.addHost(document)
    injector.addHost(shadowRoot)

    expect(injector.hosts.size).toBe(2)
    expect(injector.hosts.has(document)).toBeTruthy()
    expect(injector.hosts.has(shadowRoot)).toBeTruthy()
  })

  // adoptedStyleSheets.replaceSync is not implemented in jsdom
  it.skip('adds styles string to all the hosts', () => {
    const styles = {
      source: "* { background: 'red' }",
    }

    injector.addStyle(styles)

    expect(document.adoptedStyleSheets).toEqual(injector.stylesToAdopt)
  })
})
