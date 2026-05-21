import type { Result } from '@empathyco/x-types'
import type { VueWrapper } from '@vue/test-utils'
import type { SnippetConfig } from '@x/x-installer'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, provide } from 'vue'
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils'
import BaseCurrency from '../../currency/base-currency.vue'
import BaseResultPreviousPrice from '../base-result-previous-price.vue'

const mockedResult: Pick<Result, 'price'> = {
  price: {
    hasDiscount: true,
    originalValue: 29.99,
    value: 19.99,
  },
}

function renderBasePreviousPrice({
  currency,
  format,
  template = `
    <BaseResultPreviousPrice :result="result"
      :currency="currency"
      :format="format" />`,
  result = mockedResult,
  snippetConfig,
}: RenderBasePreviousPriceOptions = {}): RenderBasePreviousPriceAPI {
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
      BaseResultPreviousPrice,
    },
    props: ['currency', 'result', 'format'],
    global: { plugins: [installNewXPlugin()] },
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

describe('testing BaseResultPreviousPrice component', () => {
  it('renders a BaseCurrency component', () => {
    const { wrapper } = renderBasePreviousPrice({
      snippetConfig: { currency: 'USD', uiLang: 'en-US' },
    })
    expect(wrapper.findComponent(BaseCurrency)).toBeDefined()
  })

  it('renders the previous price with USD currency', () => {
    const { wrapper } = renderBasePreviousPrice({
      currency: 'USD',
      snippetConfig: { currency: 'USD', uiLang: 'en-US' },
    })

    expect(wrapper.text()).toBe('$29.99')
  })

  it('renders the previous price with EUR currency', () => {
    const { wrapper } = renderBasePreviousPrice({
      currency: 'EUR',
      snippetConfig: { currency: 'EUR', uiLang: 'es-ES' },
    })

    expect(wrapper.text()).toBe('29,99\u00A0€')
  })

  it('renders the previous price with GBP currency', () => {
    const { wrapper } = renderBasePreviousPrice({
      currency: 'GBP',
      snippetConfig: { currency: 'GBP', uiLang: 'en-GB' },
    })

    expect(wrapper.text()).toBe('£29.99')
  })

  it('should not render the previous price if it has no discount', () => {
    const { wrapper } = renderBasePreviousPrice({
      result: {
        price: {
          hasDiscount: false,
          originalValue: 29.99,
          value: 29.99,
        },
      },
      snippetConfig: { currency: 'USD', uiLang: 'en-US' },
    })

    expect(wrapper.find('.x-result-previous-price').exists()).toBe(false)
  })

  it('renders custom content when overriding the default slot', () => {
    const { wrapper } = renderBasePreviousPrice({
      template: `
        <BaseResultPreviousPrice :result="result">
          <span data-test="override-default-slot">{{ result.price.originalValue }}</span>
        </BaseResultPreviousPrice>`,
      snippetConfig: { currency: 'USD', uiLang: 'en-US' },
    })

    expect(wrapper.find(getDataTestSelector('override-default-slot')).exists()).toBe(true)
    expect(wrapper.text()).toBe(mockedResult.price?.originalValue?.toString())
  })

  it('renders with custom format: no decimal places', () => {
    const { wrapper } = renderBasePreviousPrice({
      currency: 'USD',
      format: { minimumFractionDigits: 0, maximumFractionDigits: 0 },
      snippetConfig: { currency: 'USD', uiLang: 'en-US' },
    })

    expect(wrapper.text()).toBe('$30') // rounds up
  })

  it('renders with custom format: three decimal places', () => {
    const { wrapper } = renderBasePreviousPrice({
      currency: 'EUR',
      format: { minimumFractionDigits: 3, maximumFractionDigits: 3 },
      snippetConfig: { currency: 'EUR', uiLang: 'es-ES' },
    })

    expect(wrapper.text()).toBe('29,990\u00A0€')
  })
})

interface RenderBasePreviousPriceOptions {
  /** ISO 4217 currency code to apply to the value. */
  currency?: string
  /** Format options from Intl.NumberFormatOptions. */
  format?: Omit<Intl.NumberFormatOptions, 'currency' | 'style'>
  /** The result with the price to display. */
  result?: Pick<Result, 'price'>
  /**
   * The template to render. Receives the 'result', 'currency', 'format' props and has registered a
   * {@link BaseCurrency | BaseCurrency component}.
   */
  template?: string
  /** Snippet configuration including currency and locale. */
  snippetConfig?: Partial<SnippetConfig>
}

interface RenderBasePreviousPriceAPI {
  /** The Vue testing utils wrapper for the {@link BaseResultPreviousPrice}. */
  wrapper: VueWrapper
}
