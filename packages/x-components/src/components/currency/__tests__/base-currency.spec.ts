import type { VueWrapper } from '@vue/test-utils'
import type { SnippetConfig } from '@x/x-installer'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, provide } from 'vue'
import BaseCurrency from '../base-currency.vue'

function renderBaseCurrency({
  value,
  currency,
  snippetConfig,
  format,
}: RenderBaseCurrencyOptions): VueWrapper {
  const Provider = defineComponent({
    setup() {
      if (snippetConfig) {
        provide('snippetConfig', snippetConfig)
      }
    },
    template: '<div><slot/></div>',
  })

  return mount(
    {
      template: `
        <Provider>
          <BaseCurrency :value="value" :currency="currency" :format="format"/>
        </Provider>
      `,
      components: {
        Provider,
        BaseCurrency,
      },
    },
    {
      data() {
        return {
          value,
          currency,
          format,
        }
      },
    },
  )
}

function renderInjectedBaseCurrency({
  value,
  currency,
  snippetConfig,
}: RenderBaseCurrencyOptions): VueWrapper {
  const Provider = defineComponent({
    setup() {
      provide('snippetConfig', snippetConfig ?? { currency: 'USD', uiLang: 'en-US' })
    },
    template: '<div><slot/></div>',
  })

  return mount(
    {
      template: `
          <Provider>
          <BaseCurrency v-bind="{ value, currency }" />
          </Provider>
        `,
      components: {
        Provider,
        BaseCurrency,
      },
    },
    {
      data() {
        return {
          value,
          currency,
        }
      },
    },
  )
}

describe('testing BaseCurrency component', () => {
  it('renders the default EUR currency with default locale', () => {
    const wrapper = renderBaseCurrency({
      value: 12345678,
      snippetConfig: { currency: 'EUR', uiLang: undefined },
    })
    expect(wrapper.text()).toContain('12')
    expect(wrapper.text()).toContain('345')
    expect(wrapper.text()).toContain('678')
  })

  it('renders EUR currency with Spanish locale (es-ES)', () => {
    const wrapper = renderBaseCurrency({
      value: 12345678.87,
      currency: 'EUR',
      snippetConfig: { currency: 'EUR', uiLang: 'es-ES' },
    })
    expect(wrapper.text()).toEqual('12.345.678,87\u00A0€')
  })

  it('renders USD currency with US locale (en-US)', () => {
    const wrapper = renderBaseCurrency({
      value: 12345678.87,
      currency: 'USD',
      snippetConfig: { currency: 'USD', uiLang: 'en-US' },
    })
    expect(wrapper.text()).toEqual('$12,345,678.87')
  })

  it('renders GBP currency with UK locale (en-GB)', () => {
    const wrapper = renderBaseCurrency({
      value: 12345678.87,
      currency: 'GBP',
      snippetConfig: { currency: 'GBP', uiLang: 'en-GB' },
    })
    expect(wrapper.text()).toEqual('£12,345,678.87')
  })

  it('renders JPY currency (no decimals) with Japanese locale', () => {
    const wrapper = renderBaseCurrency({
      value: 12345678,
      currency: 'JPY',
      snippetConfig: { currency: 'JPY', uiLang: 'ja-JP' },
    })
    expect(wrapper.text()).toEqual('￥12,345,678')
  })

  it('renders EUR currency with French locale (fr-FR)', () => {
    const wrapper = renderBaseCurrency({
      value: 12345678.87,
      currency: 'EUR',
      snippetConfig: { currency: 'EUR', uiLang: 'fr-FR' },
    })
    // French locale uses spaces as thousands separator and comma for decimals
    expect(wrapper.text()).toContain('12')
    expect(wrapper.text()).toContain('345')
    expect(wrapper.text()).toContain('678')
    expect(wrapper.text()).toContain('87')
    expect(wrapper.text()).toContain('€')
  })

  it('renders with prop currency over snippetConfig currency', () => {
    const wrapper = renderBaseCurrency({
      value: 1234.56,
      currency: 'USD',
      snippetConfig: { currency: 'EUR', uiLang: 'en-US' },
    })
    expect(wrapper.text()).toEqual('$1,234.56')
  })

  it('renders with snippetConfig currency when no prop currency is provided', () => {
    const wrapper = renderInjectedBaseCurrency({
      value: 1234.56,
      snippetConfig: { currency: 'USD', uiLang: 'en-US' },
    })
    expect(wrapper.text()).toEqual('$1,234.56')
  })

  it('renders the passed prop currency over injected snippetConfig currency', () => {
    const wrapper = renderInjectedBaseCurrency({
      value: 1234.56,
      currency: 'EUR',
      snippetConfig: { currency: 'USD', uiLang: 'es-ES' },
    })
    expect(wrapper.text()).toEqual('1234,56\u00A0€')
  })

  it('renders integer values correctly', () => {
    const wrapper = renderBaseCurrency({
      value: 12345678,
      currency: 'USD',
      snippetConfig: { currency: 'USD', uiLang: 'en-US' },
    })
    expect(wrapper.text()).toEqual('$12,345,678.00')
  })

  it('uses fallback EUR currency when no currency is provided', () => {
    const wrapper = renderBaseCurrency({
      value: 100,
      snippetConfig: { uiLang: 'en-US' },
    })
    expect(wrapper.text()).toContain('100')
    expect(wrapper.text()).toContain('€')
  })

  it('renders with custom format: minimumFractionDigits and maximumFractionDigits', () => {
    const wrapper = renderBaseCurrency({
      value: 1234.5,
      currency: 'USD',
      snippetConfig: { currency: 'USD', uiLang: 'en-US' },
      format: { minimumFractionDigits: 3, maximumFractionDigits: 3 },
    })
    expect(wrapper.text()).toEqual('$1,234.500')
  })

  it('renders with custom format: no decimal places', () => {
    const wrapper = renderBaseCurrency({
      value: 1234.89,
      currency: 'EUR',
      snippetConfig: { currency: 'EUR', uiLang: 'es-ES' },
      format: { minimumFractionDigits: 0, maximumFractionDigits: 0 },
    })
    expect(wrapper.text()).toEqual('1235\u00A0€') // rounds up
  })

  it('renders with custom format: many decimal places', () => {
    const wrapper = renderBaseCurrency({
      value: 1234.56789,
      currency: 'USD',
      snippetConfig: { currency: 'USD', uiLang: 'en-US' },
      format: { minimumFractionDigits: 5, maximumFractionDigits: 5 },
    })
    expect(wrapper.text()).toEqual('$1,234.56789')
  })

  it('renders with custom format: useGrouping false', () => {
    const wrapper = renderBaseCurrency({
      value: 1234567.89,
      currency: 'USD',
      snippetConfig: { currency: 'USD', uiLang: 'en-US' },
      format: { useGrouping: false },
    })
    expect(wrapper.text()).toEqual('$1234567.89')
  })
})

interface RenderBaseCurrencyOptions {
  /** Number to be passed to the component. */
  value: number
  /** ISO 4217 currency code (e.g., 'USD', 'EUR', 'GBP'). */
  currency?: string
  /** Snippet configuration including currency and locale. */
  snippetConfig?: Partial<SnippetConfig>
  /** Format options from Intl.NumberFormatOptions. */
  format?: Omit<Intl.NumberFormatOptions, 'currency' | 'style'>
}
