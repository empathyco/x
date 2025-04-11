import type { Dictionary } from '@empathyco/x-utils'
import type { WirePayload } from '../../../../wiring'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { installNewXPlugin } from '../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../components'
import { useState } from '../../../../composables'
import { XPlugin } from '../../../../plugins'
import ExtraParams from '../extra-params.vue'

jest.mock('../../../../composables/use-state', () => ({
  useState: jest.fn().mockReturnValue({
    params: ref({}),
  }),
}))

function renderExtraParams(values: Dictionary<unknown>) {
  const wrapper = mount(ExtraParams, {
    props: { values },
    global: { plugins: [installNewXPlugin()] },
  })

  return { wrapper }
}

describe('testing extra params component', () => {
  it('is an XComponent which has an XModule', () => {
    const { wrapper } = renderExtraParams({ warehouse: 1234 })

    expect(isXComponent(wrapper.vm)).toEqual(true)
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('extraParams')
  })

  it('emits the ExtraParamsProvided event on init with params state and props values', () => {
    // Set extra-params in the store to check values prop has more priority in the merge
    ;(useState as jest.Mock).mockReturnValueOnce({
      params: ref({ area: 'gijon', currency: 'EUR' }),
    })
    renderExtraParams({ area: 'uk', lang: 'en' })

    const extraParamsInitializedCallback = jest.fn()
    XPlugin.bus.on('ExtraParamsInitialized', true).subscribe(extraParamsInitializedCallback)
    expect(extraParamsInitializedCallback).toHaveBeenCalledTimes(1)
    expect(extraParamsInitializedCallback).toHaveBeenCalledWith<[WirePayload<Dictionary<unknown>>]>(
      {
        eventPayload: { area: 'uk', lang: 'en' },
        metadata: { moduleName: 'extraParams', location: 'none', replaceable: true },
      },
    )

    const extraParamsProvidedCallback = jest.fn()
    XPlugin.bus.on('ExtraParamsProvided', true).subscribe(extraParamsProvidedCallback)
    expect(extraParamsProvidedCallback).toHaveBeenCalledTimes(1)
    expect(extraParamsProvidedCallback).toHaveBeenCalledWith<[WirePayload<Dictionary<unknown>>]>({
      eventPayload: { area: 'uk', lang: 'en', currency: 'EUR' },
      metadata: { moduleName: 'extraParams', location: 'none', replaceable: true },
    })
  })

  it('emits the ExtraParamsProvided event when the values change', async () => {
    const { wrapper } = renderExtraParams({ warehouse: 1234 })
    const extraParamsProvidedCallback = jest.fn()

    XPlugin.bus.on('ExtraParamsProvided', true).subscribe(extraParamsProvidedCallback)

    expect(extraParamsProvidedCallback).toHaveBeenCalledWith<[WirePayload<Dictionary<unknown>>]>({
      eventPayload: { warehouse: 1234 },
      metadata: { moduleName: 'extraParams', location: 'none', replaceable: true },
    })
    expect(extraParamsProvidedCallback).toHaveBeenCalledTimes(1)

    await wrapper.setProps({ values: { warehouse: 5678 } })

    expect(extraParamsProvidedCallback).toHaveBeenCalledWith<[WirePayload<Dictionary<unknown>>]>({
      eventPayload: { warehouse: 5678 },
      metadata: { moduleName: 'extraParams', location: 'none', replaceable: true },
    })
    expect(extraParamsProvidedCallback).toHaveBeenCalledTimes(2)
  })
})
