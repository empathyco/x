import type { WindowWithInjector } from '../css-injector/css-injector.types'
import { CssInjector } from '../css-injector/css-injector'

const getInstance = () => (window as WindowWithInjector).xCSSInjector as CssInjector

// NOTE: this test is expected to run secuentialy
describe('test custom css injector', () => {
  it('reuses the same instance between initializations', () => {
    const injector1 = new CssInjector()
    const injector2 = new CssInjector()

    expect(injector1 === injector2).toBe(true)
  })

  it('is appended to the window under xCSSInjector', () => {
    expect((window as WindowWithInjector).xCSSInjector).toBeInstanceOf(CssInjector)
  })

  it('can set the host element that will receive the styles', () => {
    const injector = getInstance()

    // @ts-expect-error Property host is protected.
    expect(injector.hosts.size).toBe(0)

    injector.setHost(document.head)

    // @ts-expect-error Property host is protected.
    expect(injector.hosts.has(document)).toBe(true)
  })

  it('can remove host', () => {
    const injector = getInstance()

    // TODO: after remove the deprecated method: injector.addHost(document)
    // @ts-expect-error Property host is protected.
    expect(injector.hosts.size).toBe(1)

    injector.removeHost(document)

    // @ts-expect-error Property host is protected.
    expect(injector.hosts.size).toBe(0)
  })

  it('can add host', () => {
    const injector = getInstance()
    const domElement = document.createElement('div')
    const shadowRoot = domElement.attachShadow({ mode: 'open' })

    // @ts-expect-error Property host is protected.
    expect(injector.hosts.size).toBe(0)

    injector.addHost(document)
    injector.addHost(shadowRoot)

    // @ts-expect-error Property host is protected.
    expect(injector.hosts.size).toBe(2)
    // @ts-expect-error Property host is protected.
    expect(injector.hosts.has(document)).toBeTruthy()
    // @ts-expect-error Property host is protected.
    expect(injector.hosts.has(shadowRoot)).toBeTruthy()
  })

  // adoptedStyleSheets.replaceSync is not implemented in jsdom
  it.skip('adds styles string to all the hosts', () => {
    const injector = getInstance()

    const styles = {
      source: "* { background: 'red' }",
    }

    injector.addStyle(styles)

    // @ts-expect-error Property host is protected.
    expect(document.adoptedStyleSheets).toEqual(injector.stylesToAdopt)
  })
})
