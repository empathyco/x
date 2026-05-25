import type { NumberRangeFilter } from '@empathyco/x-types'
import type { VueWrapper } from '@vue/test-utils'
import type { SnippetConfig } from '@x/x-installer'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, provide } from 'vue'
import { getNumberRangeFilterStub } from '../../../../__stubs__/filters-stubs.factory'
import BasePriceFilterLabel from '../base-price-filter-label.vue'

function renderBasePriceLabel({
  filter,
  currency,
  lessThan = 'Less than {max}',
  from = 'More than {min}',
  fromTo = 'From {min} to {max}',
  snippetConfig,
}: RenderBasePriceLabelOptions): VueWrapper {
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
      components: { Provider, BasePriceFilterLabel },
      props: ['filter', 'lessThan', 'from', 'fromTo', 'currency'],
      template: `
        <Provider>
          <BasePriceFilterLabel :filter="filter" :currency="currency"
            :less-than="lessThan" :from="from" :from-to="fromTo" />
        </Provider>
      `,
    },
    {
      propsData: {
        filter,
        currency,
        lessThan,
        from,
        fromTo,
      },
    },
  )
}

describe('testing BasePriceLabel component', () => {
  it('renders component with filter without min value', () => {
    const filter = getNumberRangeFilterStub({ range: { min: null, max: 10 } })
    const wrapper = renderBasePriceLabel({
      filter,
      currency: 'USD',
      snippetConfig: { currency: 'USD', uiLang: 'en-US' },
    })
    expect(wrapper.text()).toEqual('Less than $10.00')
  })

  it('renders component with filter with min and max value', () => {
    const filter = getNumberRangeFilterStub({ range: { min: 0, max: 10 } })
    const wrapper = renderBasePriceLabel({
      filter,
      currency: 'EUR',
      snippetConfig: { currency: 'EUR', uiLang: 'es-ES' },
    })
    expect(wrapper.text()).toEqual('From 0,00\u00A0€ to 10,00\u00A0€')
  })

  it('renders component with filter without max value', () => {
    const filter = getNumberRangeFilterStub({ range: { min: 1000, max: null } })
    const wrapper = renderBasePriceLabel({
      filter,
      currency: 'EUR',
      snippetConfig: { currency: 'EUR', uiLang: 'es-ES' },
    })
    expect(wrapper.text()).toEqual('More than 1000,00\u00A0€')
  })
})

/**
 * Options to configure how the base price component should be rendered.
 */
interface RenderBasePriceLabelOptions {
  filter: NumberRangeFilter
  currency?: string
  format?: Omit<Intl.NumberFormatOptions, 'currency' | 'style'>
  lessThan?: string
  fromTo?: string
  from?: string
  template?: string
  snippetConfig?: Partial<SnippetConfig>
}
