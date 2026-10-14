import type { TabItem } from '../index'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { getDataTestSelector } from '../../../__tests__/utils'
import Tabs from '../tabs.vue'

function render({ items = [] }: { items?: TabItem[] } = {}) {
  const wrapper = mount({
    components: { Tabs },
    data: () => ({ items }),
    template: '<Tabs :items="items"/>',
  })

  return {
    wrapper,
    getTabsEl: () => wrapper.find(getDataTestSelector('tabs')),
    getTabButtons: () => wrapper.findAll(getDataTestSelector('tab')),
    getSelectedTabButtons: () => wrapper.findAll('.x-tab--is-selected'),
  }
}

describe('testing Tabs component', () => {
  it('renders one tab per item, each showing its label', () => {
    const { getTabsEl, getTabButtons } = render({
      items: [
        { id: '1', label: 'First', click: vi.fn() },
        { id: '2', label: 'Second', click: vi.fn() },
      ],
    })

    expect(getTabsEl().exists()).toBe(true)
    expect(getTabButtons()).toHaveLength(2)
    expect(getTabButtons()[0].text()).toBe('First')
    expect(getTabButtons()[1].text()).toBe('Second')
  })

  it('renders no tab selected initially', () => {
    const { getSelectedTabButtons } = render({
      items: [
        { id: '1', label: 'First', click: vi.fn() },
        { id: '2', label: 'Second', click: vi.fn() },
      ],
    })

    expect(getSelectedTabButtons()).toHaveLength(0)
  })

  it("invokes the clicked tab's click callback", async () => {
    const firstClick = vi.fn()
    const secondClick = vi.fn()
    const { getTabButtons } = render({
      items: [
        { id: '1', label: 'First', click: firstClick },
        { id: '2', label: 'Second', click: secondClick },
      ],
    })

    await getTabButtons()[1].trigger('click')

    expect(secondClick).toHaveBeenCalledTimes(1)
    expect(firstClick).not.toHaveBeenCalled()
  })

  it('marks the clicked tab as selected', async () => {
    const { getTabButtons, getSelectedTabButtons } = render({
      items: [
        { id: '1', label: 'First', click: vi.fn() },
        { id: '2', label: 'Second', click: vi.fn() },
      ],
    })

    await getTabButtons()[0].trigger('click')

    expect(getSelectedTabButtons()).toHaveLength(1)
    expect(getSelectedTabButtons()[0].classes()).toContain('x-tab--is-selected')
  })

  it('moves the selection when a different tab is clicked', async () => {
    const { getTabButtons, getSelectedTabButtons } = render({
      items: [
        { id: '1', label: 'First', click: vi.fn() },
        { id: '2', label: 'Second', click: vi.fn() },
      ],
    })

    await getTabButtons()[0].trigger('click')

    expect(getSelectedTabButtons()).toHaveLength(1)

    await getTabButtons()[1].trigger('click')

    expect(getSelectedTabButtons()).toHaveLength(1)
    expect(getTabButtons()[1].classes()).toContain('x-tab--is-selected')
    expect(getTabButtons()[0].classes()).not.toContain('x-tab--is-selected')
  })
})
