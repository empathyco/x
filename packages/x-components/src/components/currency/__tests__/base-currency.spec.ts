import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { defineComponent, provide, ref } from 'vue'
import BaseCurrency from '../base-currency.vue'

function renderBaseCurrency({ value, format }: RenderBaseCurrencyOptions): VueWrapper {
  return mount(
    {
      components: { BaseCurrency },
      template: `<BaseCurrency :value="value" :format="format"/>`,
      props: ['value', 'format'],
    },
    {
      props: {
        value,
        format,
      },
    },
  )
}

function renderInjectedBaseCurrency({ value, format }: RenderBaseCurrencyOptions): VueWrapper {
  const Provider = defineComponent({
    setup() {
      const providedFormat = ref('$i,iii.ddd')
      provide('currencyFormat', providedFormat.value)
    },
    template: '<div><slot/></div>',
  })

  return mount(
    {
      template: `
          <Provider>
          <BaseCurrency v-bind="{ value, format }" />
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
          format,
        }
      },
    },
  )
}

describe('testing BaseCurrency component', () => {
  it('renders the default format', () => {
    const wrapper = renderBaseCurrency({
      value: 12345678,
    })
    expect(wrapper.text()).toEqual('12.345.678,00')
  })

  it('renders the provided format correctly with "?" after the decimal separator', () => {
    const wrapper = renderBaseCurrency({
      value: 12345678,
      format: 'i.iii,ddd? €',
    })
    expect(wrapper.text()).toEqual('12.345.678 €')
  })

  it('renders the provided currency at the start of the format', () => {
    const wrapper = renderBaseCurrency({
      value: 12345678.87654321,
      format: '$ i.iii,dd',
    })
    expect(wrapper.text()).toEqual('$ 12.345.678,87')
  })

  it('renders the provided currency at the start of the format without space', () => {
    const wrapper = renderBaseCurrency({
      value: 12345678.87654321,
      format: '$i.iii,dd',
    })
    expect(wrapper.text()).toEqual('$12.345.678,87')
  })

  it('renders the provided currency at the end of the format', () => {
    const wrapper = renderBaseCurrency({
      value: 12345678.87654321,
      format: 'i.iii,dd €',
    })
    expect(wrapper.text()).toEqual('12.345.678,87 €')
  })

  it('renders the provided currency at the end of the format without space', () => {
    const wrapper = renderBaseCurrency({
      value: 12345678.87654321,
      format: 'i.iii,dd€',
    })
    expect(wrapper.text()).toEqual('12.345.678,87€')
  })

  it('renders the provided format with comma for thousands and dot for decimals', () => {
    const wrapper = renderBaseCurrency({
      value: 12345678.87654321,
      format: 'i,iii.dd €',
    })
    expect(wrapper.text()).toEqual('12,345,678.87 €')
  })

  it('renders the provided format with spaces for thousands separators', () => {
    const wrapper = renderBaseCurrency({
      value: 12345678.87654321,
      format: 'i iii.dd €',
    })
    expect(wrapper.text()).toEqual('12 345 678.87 €')
  })

  it(
    'renders the provided format with spaces for thousands separators and custom string (more' +
      ' than one character for decimals',
    () => {
      const wrapper = renderBaseCurrency({
        value: 12345678.87654321,
        format: 'i iii - dd €',
      })
      expect(wrapper.text()).toEqual('12 345 678 - 87 €')
    },
  )

  it('renders the provided format correctly with a larger number of decimals', () => {
    const wrapper = renderBaseCurrency({
      value: 12345678.87654321,
      format: 'i.iii,dddddd €',
    })
    expect(wrapper.text()).toEqual('12.345.678,876543 €')
  })

  it('renders the provided format correctly filling decimals with non-significant zeros', () => {
    const wrapper = renderBaseCurrency({
      value: 12345678.87,
      format: 'i.iii,dddddd €',
    })
    expect(wrapper.text()).toEqual('12.345.678,870000 €')
  })

  it(
    'renders the provided format correctly filling decimals with non-significant zeros for an' +
      'integer',
    () => {
      const wrapper = renderBaseCurrency({
        value: 12345678,
        format: 'i.iii,dddddd €',
      })
      expect(wrapper.text()).toEqual('12.345.678,000000 €')
    },
  )

  it('renders the provided format correctly which only contains integer part', () => {
    const wrapper = renderBaseCurrency({
      value: 12345678.87654321,
      format: 'i.iii €',
    })
    expect(wrapper.text()).toEqual('12.345.678 €')
  })

  it('renders the injected format over default format', () => {
    const wrapper = renderInjectedBaseCurrency({ value: 12345678.87654321 })

    expect(wrapper.text()).toBe('$12,345,678.876')
  })

  it('renders the passed prop format over injected format', () => {
    const wrapper = renderInjectedBaseCurrency({ value: 12345678.87654321, format: 'i.iii,dd €' })

    expect(wrapper.text()).toBe('12.345.678,87 €')
  })
})

interface RenderBaseCurrencyOptions {
  /** Number to be passed to the component. */
  value: number
  /** Format for rendering the currency. */
  format?: string
}
