import type { DeepPartial } from '@empathyco/x-utils'
import type { RootXStoreState } from '../../../store/store.types'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { Store } from 'vuex'
import { XDummyBus } from '../../../__tests__/bus.dummy'
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils'
import { XPlugin } from '../../../plugins/x-plugin'
import { searchXModule } from '../../../x-modules/search/x-module'
import SortList from '../sort-list.vue'

const bus = new XDummyBus()

function renderSortList({
  template = `
   <SortList :items="items" :selectedSort="selectedSort">
      <template #default="{ item }">
        {{ item }}
      </template>
    </SortList>`,
  items = ['default', 'Price low to high', 'Price high to low'],
  selectedSort = items[0],
}: Partial<{ template?: string; items?: any[]; selectedSort?: any }> = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({})

  const parentWrapper = mount(
    {
      template,
      components: { SortList },
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

  const sortList = parentWrapper.findComponent(SortList)

  return {
    wrapper: sortList,
    onUserClickedASort,
    onSelectedSortProvided,
    getButton: (index: number) => parentWrapper.vm.$el.children[index].children[0] as HTMLElement,
    getSelectedItem: () => sortList.get('.x-sort-list__item--is-selected'),
    clickNthItem: async (index: number) => {
      await sortList.findAll(getDataTestSelector('x-sort-button')).at(index)?.trigger('click')
      await parentWrapper.setProps({ selectedSort: items[index] })
      await nextTick()
    },
  }
}

describe('testing SortList component', () => {
  it('allows selecting one of the options of the list', async () => {
    const { getButton, clickNthItem, getSelectedItem, onUserClickedASort } = renderSortList({
      items: ['price', 'relevance', 'offer'],
    })

    await clickNthItem(2)

    expect(onUserClickedASort).toHaveBeenCalledTimes(1)
    expect(onUserClickedASort).toHaveBeenCalledWith({
      eventPayload: 'offer',
      metadata: {
        moduleName: null,
        target: getButton(2),
        location: 'none',
        replaceable: true,
      },
    })
    expect(getSelectedItem().text()).toEqual('offer')
  })

  it('emits the first element of the `items` prop as the provided sort', async () => {
    const { onSelectedSortProvided } = renderSortList()

    expect(onSelectedSortProvided).toHaveBeenCalledTimes(1)
    await nextTick()
    expect(onSelectedSortProvided).toHaveBeenCalledWith({
      eventPayload: 'default',
      // This event gets emitted immediately, before the component has been mounted
      metadata: { moduleName: null, location: 'none', replaceable: true },
    })
  })

  describe('slots', () => {
    it('allows to customize each item using the default slot', () => {
      const { getSelectedItem } = renderSortList({
        template: `
          <SortList :items="items" :selectedSort="selectedSort">
            <template #default="{ item, isSelected }">
              <span>{{ isSelected }}</span>
            </template>
          </SortList>`,
      })

      expect(getSelectedItem().text()).toContain('true')
    })
  })
})
