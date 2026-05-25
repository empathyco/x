import type { Result } from '@empathyco/x-types'
import type { VueWrapper } from '@vue/test-utils'
import type { SnippetConfig } from '@x/x-installer'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, provide } from 'vue'
import { getDataTestSelector } from '../../../__tests__/utils'
import BaseCurrency from '../../currency/base-currency.vue'
import BaseResultCurrentPrice from '../base-result-current-price.vue'

const mockedResult: Pick<Result, 'price'> = {
  price: {
    hasDiscount: true,
    originalValue: 29.99,
    value: 19.99,
  },
}

function renderBaseCurrentPrice({
  currency,
  format,
  template = `<BaseResultCurrentPrice :result="result" :currency="currency" :format="format" />`,
  result = mockedResult,
  snippetConfig,
}: RenderBaseCurrentPriceOptions = {}): RenderBaseCurrentPriceAPI {
  const Provider = defineComponent({
    setup() {
      if (snippetConfig) {
        provide('snippetConfig', snippetConfig)
      }
    },
    template: '<div><slot/></div>',
  })

  const wrapperComponent = {
    template: `
      <Provider>
        ${template}
      </Provider>
    `,
    components: {
      Provider,
      BaseResultCurrentPrice,
    },
    props: ['currency', 'result', 'format'],
  }

  const wrapper = mount(wrapperComponent, {
    propsData: {
      currency,
      result,
      format,
    },
  })

  return {
    wrapper,
  }
}

describe('testing BaseCurrentPrice component', () => {
  it('renders a BaseCurrency component', () => {
    const { wrapper } = renderBaseCurrentPrice({
      snippetConfig: { currency: 'USD', uiLang: 'en-US' },
    })
    expect(wrapper.findComponent(BaseCurrency)).toBeDefined()
  })

  it('renders the current price with USD currency', () => {
    const { wrapper } = renderBaseCurrentPrice({
      currency: 'USD',
      snippetConfig: { currency: 'USD', uiLang: 'en-US' },
    })

    expect(wrapper.text()).toBe('$19.99')
  })

  it('renders the current price with EUR currency', () => {
    const { wrapper } = renderBaseCurrentPrice({
      currency: 'EUR',
      snippetConfig: { currency: 'EUR', uiLang: 'es-ES' },
    })

    expect(wrapper.text()).toBe('19,99\u00A0€')
  })

  it('renders the current price with GBP currency', () => {
    const { wrapper } = renderBaseCurrentPrice({
      currency: 'GBP',
      snippetConfig: { currency: 'GBP', uiLang: 'en-GB' },
    })

    expect(wrapper.text()).toBe('£19.99')
  })

  it('adds "x-result-current-price--on-sale" css class because the price is discounted', () => {
    const { wrapper } = renderBaseCurrentPrice({
      snippetConfig: { currency: 'USD', uiLang: 'en-US' },
    })

    const currentPriceElement = wrapper.find('.x-result-current-price')
    expect(currentPriceElement.classes()).toContain('x-result-current-price--on-sale')
  })

  it('does not add "x-result-current-price--on-sale" css class because the price is not discounted', () => {
    const { wrapper } = renderBaseCurrentPrice({
      result: {
        price: {
          hasDiscount: false,
          originalValue: 29.99,
          value: 29.99,
        },
      },
      snippetConfig: { currency: 'USD', uiLang: 'en-US' },
    })

    expect(wrapper.classes()).not.toContain('x-result-current-price--on-sale')
  })

  it('renders custom content when overriding the default slot', () => {
    const { wrapper } = renderBaseCurrentPrice({
      template: `
        <BaseResultCurrentPrice :result="result">
          <span data-test="override-default-slot">{{ result.price.value }}</span>
        </BaseResultCurrentPrice>`,
      snippetConfig: { currency: 'USD', uiLang: 'en-US' },
    })

    expect(wrapper.find(getDataTestSelector('override-default-slot')).exists()).toBe(true)
    expect(wrapper.text()).toBe(mockedResult.price?.value?.toString())
  })

  it('renders with custom format: no decimal places', () => {
    const { wrapper } = renderBaseCurrentPrice({
      currency: 'USD',
      format: { minimumFractionDigits: 0, maximumFractionDigits: 0 },
      snippetConfig: { currency: 'USD', uiLang: 'en-US' },
    })

    expect(wrapper.text()).toBe('$20') // rounds up
  })

  it('renders with custom format: three decimal places', () => {
    const { wrapper } = renderBaseCurrentPrice({
      currency: 'EUR',
      format: { minimumFractionDigits: 3, maximumFractionDigits: 3 },
      snippetConfig: { currency: 'EUR', uiLang: 'es-ES' },
    })

    expect(wrapper.text()).toBe('19,990\u00A0€')
  })
})

interface RenderBaseCurrentPriceOptions {
  /** ISO 4217 currency code to apply to the value. */
  currency?: string
  /** Format options from Intl.NumberFormatOptions. */
  format?: Omit<Intl.NumberFormatOptions, 'currency' | 'style'>
  /** The result with the price to display. */
  result?: Pick<Result, 'price'>
  /**
   * The template to render. Receives the 'result', 'currency', 'format' props and
   * has registered a {@link BaseCurrency | BaseCurrency component}.
   */
  template?: string
  /** Snippet configuration including currency and locale. */
  snippetConfig?: Partial<SnippetConfig>
}

interface RenderBaseCurrentPriceAPI {
  /** The Vue testing utils wrapper for the {@link BaseResultCurrentPrice}. */
  wrapper: VueWrapper
}
