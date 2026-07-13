import type { DeepPartial } from '@empathyco/x-utils'
import type { RootXStoreState } from '../../store/store.types'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { Store } from 'vuex'
import { XDummyBus } from '../../__tests__/bus.dummy'
import { getDataTestSelector, installNewXPlugin } from '../../__tests__/utils'
import { XPlugin } from '../../plugins/x-plugin'
import { searchXModule } from '../../x-modules/search/x-module'
import SortDropdown from '../sort-dropdown.vue'

const bus = new XDummyBus()
function renderSortDropdown({
  template = `
   <SortDropdown :items="items" :selectedSort="selectedSort">
      <template #toggle="{ item }">
        {{ item }}
      </template>
      <template #item="{ item }">
        {{ item }}
      </template>
    </SortDropdown>`,
  items = ['default', 'Price low to high', 'Price high to low'],
  selectedSort = items[0],
}: Partial<{ template?: string; items?: any[]; selectedSort?: any }> = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({})

  const parentWrapper = mount(
    {
      template,
      components: { SortDropdown },
      props: ['items', 'selectedSort'],
    },
    {
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [searchXModule] }, bus)],
      },
      store,
      props: { items, selectedSort },
    },
  )

  const onSelectedSortProvided = vi.fn()
  XPlugin.bus.on('SelectedSortProvided', true).subscribe(onSelectedSortProvided)
  const onUserClickedASort = vi.fn()
  XPlugin.bus.on('UserClickedASort', true).subscribe(onUserClickedASort)

  const sortDropdown = parentWrapper.findComponent(SortDropdown)
  return {
    wrapper: sortDropdown,
    onSelectedSortProvided,
    onUserClickedASort,
    getSelectedItem: () => sortDropdown.find('.x-dropdown__item--is-selected'),
    getToggleButton: () => sortDropdown.find(getDataTestSelector('dropdown-toggle')),
    clickToggleButton: async () =>
      sortDropdown.find(getDataTestSelector('dropdown-toggle')).trigger('click'),
    clickNthItem: async (index: number) => {
      await sortDropdown.findAll(getDataTestSelector('dropdown-item')).at(index)?.trigger('click')
      await parentWrapper.setProps({ selectedSort: items[index] })
      await nextTick()
    },
  } as const
}

describe('testing SortDropdown component', () => {
  it('allows selecting one of the options of the dropdown', async () => {
    const {
      wrapper,
      clickNthItem,
      clickToggleButton,
      getToggleButton,
      getSelectedItem,
      onUserClickedASort,
    } = renderSortDropdown({
      items: ['price', 'relevance', 'offer'],
    })

    await clickToggleButton()
    await clickNthItem(2)
    await clickToggleButton()
    await nextTick()

    expect(onUserClickedASort).toHaveBeenCalledTimes(1)
    expect(onUserClickedASort).toHaveBeenCalledWith({
      eventPayload: 'offer',
      metadata: {
        moduleName: null,
        target: wrapper.vm.$el as HTMLElement,
        location: 'none',
        replaceable: true,
      },
    })
    expect(getToggleButton().text()).toEqual('offer')
    expect(getSelectedItem().text()).toEqual('offer')
  })

  it('returns the first item as default', async () => {
    const { onSelectedSortProvided } = renderSortDropdown()

    expect(onSelectedSortProvided).toHaveBeenCalledTimes(1)
    await nextTick()
    // This event gets emitted immediately, before the component has been mounted
    expect(onSelectedSortProvided).toHaveBeenCalledWith({
      eventPayload: 'default',
      metadata: { moduleName: null, location: 'none', replaceable: true },
    })
  })

  describe('slots', () => {
    it('allows to customize each item using the slots', async () => {
      const { getSelectedItem, clickToggleButton } = renderSortDropdown({
        template: `
          <SortDropdown :items="items" :selectedSort="selectedSort">
            <template #item="{ item, isSelected, isHighlighted }">
              <span v-if="isSelected">✅</span>
              <span v-if="isHighlighted">🟢</span>
              <span>{{ item }}</span>
            </template>
          </SortDropdown>`,
      })

      await clickToggleButton()
      expect(getSelectedItem().text()).toEqual(`✅🟢default`)
    })

    it('allows to customize the toggle button', async () => {
      const { getToggleButton, clickToggleButton } = renderSortDropdown({
        template: `
          <SortDropdown :items="items" :selectedSort="selectedSort">
            <template #toggle="{ item, isOpen }">
              {{ item }} {{ isOpen ? '🔽' : '🔼'}}
            </template>
          </SortDropdown>`,
      })

      expect(getToggleButton().text()).toEqual('default 🔼')
      await clickToggleButton()
      expect(getToggleButton().text()).toEqual('default 🔽')
    })
  })
})
