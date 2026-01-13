import type { DeepPartial } from '@empathyco/x-utils'
import type { RootXStoreState } from '../../../../store/store.types'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { Store } from 'vuex'
import { XDummyBus } from '../../../../__tests__/bus.dummy'
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils'
import { XPlugin } from '../../../../plugins/x-plugin'
import { searchXModule } from '../../x-module'
import SortPickerList from '../sort-picker-list.vue'
import { resetXSearchStateWith } from './utils'

const bus = new XDummyBus()
function renderSortPickerList({
  template = `
   <SortPickerList :items="items" :buttonClass="buttonClass">
      <template #default="{ item }">
        {{ item }}
      </template>
   </SortPickerList>`,
  items = ['default', 'Price low to high', 'Price high to low'],
  selectedSort = items[0],
  buttonClass,
}: Partial<{ template?: string; items?: any[]; selectedSort?: any; buttonClass?: string }> = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({})

  const wrapper = mount(
    {
      template,
      components: { SortPickerList },
      props: ['items', 'buttonClass'],
    },
    {
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [searchXModule] }, bus)],
      },
      store,
      props: {
        items,
        buttonClass,
      },
    },
  )
  resetXSearchStateWith(store, { sort: selectedSort })

  const onSelectedSortProvided = jest.fn()
  XPlugin.bus.on('SelectedSortProvided', true).subscribe(onSelectedSortProvided)
  const onUserClickedASort = jest.fn()
  XPlugin.bus.on('UserClickedASort', true).subscribe(onUserClickedASort)

  const sortPickerList = wrapper.findComponent(SortPickerList)

  return {
    wrapper: sortPickerList,
    onUserClickedASort,
    onSelectedSortProvided,
    getButton: (index: number) => wrapper.vm.$el.children[index] as HTMLElement,
    getSelectedItem: () => sortPickerList.get('.xds:selected'),
    clickNthItem: async (index: number) => {
      await sortPickerList
        .findAll(getDataTestSelector('sort-picker-button'))
        .at(index)
        ?.trigger('click')
      await nextTick()
    },
  }
}

describe('testing SortPickerList component', () => {
  it('is an XComponent', () => {
    const { wrapper } = renderSortPickerList()
    expect(isXComponent(wrapper.vm)).toBeTruthy()
  })

  it('is an XComponent that belongs to the search module', () => {
    const { wrapper } = renderSortPickerList()
    expect(getXComponentXModuleName(wrapper.vm)).toBe('search')
  })

  it('allows selecting one of the options of the list', async () => {
    const { getButton, clickNthItem, getSelectedItem, onUserClickedASort } = renderSortPickerList({
      items: ['price', 'relevance', 'offer'],
    })

    await clickNthItem(2)

    expect(onUserClickedASort).toHaveBeenCalledTimes(1)
    expect(onUserClickedASort).toHaveBeenCalledWith({
      eventPayload: 'offer',
      metadata: {
        moduleName: 'search',
        target: getButton(2),
        location: 'none',
        replaceable: true,
      },
    })
    expect(getSelectedItem().text()).toEqual('offer')
  })

  it('emits the first element of the `items` prop as the provided sort', async () => {
    const { onSelectedSortProvided } = renderSortPickerList()

    expect(onSelectedSortProvided).toHaveBeenCalledTimes(1)
    await nextTick()
    expect(onSelectedSortProvided).toHaveBeenCalledWith({
      eventPayload: 'default',
      // This event gets emitted immediately, before the component has been mounted
      metadata: { moduleName: 'search', location: 'none', replaceable: true },
    })
  })

  it('allows adding classes to the button', () => {
    const { wrapper } = renderSortPickerList({ buttonClass: 'custom-class' })
    const buttons = wrapper.findAll(getDataTestSelector('sort-picker-button'))

    expect(buttons.length).toBeTruthy()
    buttons.forEach(button => {
      expect(button.classes('custom-class')).toBeTruthy()
    })
  })

  it('adds the aria pressed attribute to the selected item', async () => {
    const { wrapper, clickNthItem } = renderSortPickerList()

    await clickNthItem(1)

    const buttons = wrapper.findAll(getDataTestSelector('sort-picker-button'))
    expect(buttons[0].element).not.toHaveAttribute('aria-pressed')
    expect(buttons[1].element).toHaveAttribute('aria-pressed', 'true')
  })

  it('adds corresponding classes to the selected element', async () => {
    const { wrapper, clickNthItem } = renderSortPickerList({ items: ['name', 'price'] })

    await clickNthItem(1)

    const buttons = wrapper.findAll(getDataTestSelector('sort-picker-button'))
    expect(buttons[0].classes('xds:selected')).toBeFalsy()
    expect(buttons[1].classes('xds:selected')).toBeTruthy()
  })

  describe('slots', () => {
    it('allows to customize each item using the default slot', async () => {
      const { getSelectedItem } = renderSortPickerList({
        items: ['', 'Price low to high', 'Price high to low'],
        template: `
          <SortPickerList :items="items">
            <template #default="{ item, isSelected }">
              <span>{{ isSelected }}</span>
            </template>
          </SortPickerList>`,
      })

      await nextTick()
      expect(getSelectedItem().text()).toContain('true')
    })
  })
})
