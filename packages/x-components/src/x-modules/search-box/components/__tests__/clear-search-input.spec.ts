import { mount } from '@vue/test-utils'
import { installNewXPlugin } from '../../../../__tests__/utils'
import { useState } from '../../../../composables/use-state'
import { XPlugin } from '../../../../plugins'
import ClearSearchInput from '../clear-search-input.vue'

jest.mock('../../../../composables/use-state', () => ({
  useState: jest.fn(),
}))

describe('testing ClearSearchInput component', () => {
  beforeEach(() => {
    // Use state mock to return an empty query value
    ;(useState as jest.Mock).mockReturnValue({ query: { value: '' } })
  })

  it('emits UserPressedClearSearchBoxButton event when clicked', async () => {
    const clearSearchInput = mount(ClearSearchInput, {
      global: { plugins: [installNewXPlugin()] },
    })
    const target = {
      location: 'none',
      moduleName: 'searchBox',
      replaceable: true,
      target: clearSearchInput.element,
    }
    const emitSpy = jest.spyOn(XPlugin.bus, 'emit')

    await clearSearchInput.trigger('click')

    expect(emitSpy).toHaveBeenCalledTimes(1)
    expect(emitSpy).toHaveBeenCalledWith('UserPressedClearSearchBoxButton', undefined, target)
  })

  it('has a default slot to customize its contents', () => {
    const slotTemplate = '<span class="x-clear-search-input__text">Clear</span>'
    const clearSearchInput = mount(ClearSearchInput, {
      global: { plugins: [installNewXPlugin()] },
      slots: {
        default: {
          template: slotTemplate,
        },
      },
    })
    const renderedSlot = clearSearchInput.find('.x-clear-search-input__text')

    expect(renderedSlot).toBeDefined()
    expect(renderedSlot.text()).toEqual('Clear')
  })
})
