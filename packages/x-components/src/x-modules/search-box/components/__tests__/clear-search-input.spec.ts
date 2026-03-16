import { mount } from '@vue/test-utils'
import { vi } from 'vitest'
import { installNewXPlugin } from '../../../../__tests__/utils'
import { useState } from '../../../../composables/use-state'
import { XPlugin } from '../../../../plugins'
import ClearSearchInput from '../clear-search-input.vue'

vi.mock('../../../../composables/use-state', () => ({
  useState: vi.fn(),
}))

describe('testing ClearSearchInput component', () => {
  beforeEach(() => {
    // Use state mock to return an empty query value
    ;(useState as any).mockReturnValue({ query: { value: '' } })
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
    const emitSpy = vi.spyOn(XPlugin.bus, 'emit')

    await clearSearchInput.trigger('click')

    expect(emitSpy).toHaveBeenCalledTimes(1)
    expect(emitSpy).toHaveBeenCalledWith('UserPressedClearSearchBoxButton', undefined, target)
  })

  it('has a default slot to customize its contents', () => {
    const slotTemplate = '<span class="x:clear-search-input__text">Clear</span>'
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
