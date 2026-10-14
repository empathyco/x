import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { getDataTestSelector } from '../../../__tests__/utils'
import Tab from '../tab.vue'

interface RenderTabOptions {
  label?: string
  click?: ReturnType<typeof vi.fn>
  selected?: boolean
  slots?: Record<string, string>
}

interface RenderTabAPI {
  wrapper: VueWrapper
  click: ReturnType<typeof vi.fn>
}

function renderTab({
  label = 'My tab',
  click = vi.fn(),
  selected = false,
  slots,
}: RenderTabOptions = {}): RenderTabAPI {
  const wrapper = mount(Tab, {
    props: { label, click: click as unknown as () => void, selected },
    slots,
  })

  return { wrapper, click }
}

describe('testing Tab component', () => {
  it('renders a button tab with the given label', () => {
    const { wrapper } = renderTab()

    const tab = wrapper.find(getDataTestSelector('tab'))

    expect(tab.exists()).toBe(true)
    expect(tab.element.tagName).toBe('BUTTON')
    expect(tab.text()).toBe('My tab')
  })

  it('invokes the click callback when the tab is clicked', async () => {
    const { wrapper, click } = renderTab()

    await wrapper.find(getDataTestSelector('tab')).trigger('click')

    expect(click).toHaveBeenCalledTimes(1)
  })

  it('does not throw when clicked without a click callback', async () => {
    const wrapper = mount(Tab, { props: { label: 'No callback' } })

    await wrapper.find(getDataTestSelector('tab')).trigger('click')

    expect(wrapper.find(getDataTestSelector('tab')).exists()).toBe(true)
  })

  it('does not apply the selected modifier class by default', () => {
    const { wrapper } = renderTab()

    expect(wrapper.find('.x-tab--is-selected').exists()).toBe(false)
  })

  it('applies the selected modifier class when selected is true', () => {
    const { wrapper } = renderTab({ selected: true })

    expect(wrapper.find('.x-tab--is-selected').exists()).toBe(true)
  })

  it('updates the selected modifier class when the selected prop changes', async () => {
    const { wrapper } = renderTab()

    await wrapper.setProps({ selected: true })

    expect(wrapper.find('.x-tab--is-selected').exists()).toBe(true)
  })

  it('renders default slot content instead of the label when provided', () => {
    const { wrapper } = renderTab({
      slots: { default: '<span data-test="slot-content">Custom</span>' },
    })

    expect(wrapper.find('[data-test="slot-content"]').exists()).toBe(true)
    expect(wrapper.find(getDataTestSelector('tab')).text()).toBe('Custom')
  })
})
