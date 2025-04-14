import type { NormalisedSnippetConfig, SnippetConfig } from '../api.types'
import { computed, defineComponent, inject, nextTick } from 'vue'
import { XComponentsAdapterDummy } from '../../../__tests__/adapter.dummy'
import { XDummyBus } from '../../../__tests__/bus.dummy'
import { XInstaller } from '../../x-installer'
import { BaseXAPI } from '../base-api'

describe('testing default X API', () => {
  const defaultXAPI = new BaseXAPI()
  const bus = new XDummyBus()
  defaultXAPI.setBus(bus)
  const query = 'maserati'

  it('should allow asynchronous initialization', async () => {
    const listener = jest.fn()
    const someXAPI = new BaseXAPI()
    const someOtherBus = new XDummyBus()
    someXAPI.setInitCallback(async () => {
      return new Promise(resolve => {
        setTimeout(() => {
          someXAPI.setBus(someOtherBus)
          resolve(true)
        })
      })
    })

    someOtherBus.on('UserClickedOpenX').subscribe(listener)
    await someXAPI.init({
      instance: 'test',
      scope: 'test',
      lang: 'es',
    })
    someXAPI.search()

    expect(listener).toHaveBeenCalled()
  })

  it('should emit `UserAcceptedAQuery` through the `search` function', () => {
    const listener = jest.fn()
    bus.on('UserAcceptedAQuery').subscribe(listener)
    defaultXAPI.search(query)

    expect(listener).toHaveBeenCalledWith(query)
  })

  it('should emit `UserClickedCloseX` through the `close` function', () => {
    const listener = jest.fn()
    bus.on('UserClickedCloseX').subscribe(listener)

    defaultXAPI.close()

    expect(listener).toHaveBeenCalled()
  })

  it('should emit `UserClickedPDPAddToCart` through the `addProductToCart` function', () => {
    const listener = jest.fn()
    bus.on('UserClickedPDPAddToCart').subscribe(listener)

    defaultXAPI.addProductToCart()

    expect(listener).toHaveBeenCalledTimes(1)

    const productId = '123abc'
    defaultXAPI.addProductToCart(productId)
    expect(listener).toHaveBeenCalledWith(productId)
  })

  it('changes the `SnippetConfig` when calling the `setSnippetConfig` function', async () => {
    const snippetConfig: SnippetConfig = {
      instance: 'test',
      scope: 'test',
      lang: 'es',
    }
    const rootComponent = defineComponent({
      setup: () => {
        const snippetConfig = inject<SnippetConfig>('snippetConfig')
        const lang = computed(() => snippetConfig?.lang ?? '')
        const store = computed(() => snippetConfig?.store ?? '')
        return { lang, store }
      },
      template: `<div>
        <h1 class="lang-test">{{ lang }}</h1>
        <h1 class="store-test">{{ store }}</h1>
      </div>`,
    })

    const { api } = await new XInstaller({
      rootComponent,
      adapter: XComponentsAdapterDummy,
      api: defaultXAPI,
    }).init(snippetConfig)

    const langElement = document.querySelector('.lang-test')
    const storeElement = document.querySelector('.store-test')

    expect(langElement?.textContent).toEqual(snippetConfig.lang)
    api?.setSnippetConfig({ lang: 'en' })
    await nextTick()
    expect(langElement?.textContent).toEqual('en')

    expect(storeElement?.textContent).toEqual('')
    api?.setSnippetConfig({ store: 'Portugal' })
    await nextTick()
    expect(storeElement?.textContent).toEqual('Portugal')
  })

  it('should allow set the snippetConfig getter', () => {
    const snippetConfig: NormalisedSnippetConfig = {
      instance: 'test',
      scope: 'test',
      lang: 'es',
      uiLang: 'es',
    }
    defaultXAPI?.setSnippetConfigGetter(() => snippetConfig)

    const snippet = defaultXAPI?.getSnippetConfig()

    expect(snippet).toEqual(snippetConfig)
  })
})
