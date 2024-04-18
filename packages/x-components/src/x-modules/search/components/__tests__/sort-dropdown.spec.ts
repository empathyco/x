import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue, mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Vuex, { Store } from 'vuex';
import { dummyCreateEmitter } from '../../../../__tests__/bus.dummy';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { bus } from '../../../../plugins';
import { searchXModule } from '../../x-module';
import SortDropdown from '../sort-dropdown.vue';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { RootXStoreState } from '../../../../store/store.types';
import { XPlugin } from '../../../../plugins/x-plugin';
import { resetXSearchStateWith } from './utils';

function renderSortDropdown({
  template = `
   <SortDropdown :items="items">
      <template #toggle="{ item }">
        {{ item }}
      </template>
      <template #item="{ item }">
        {{ item }}
      </template>
   </SortDropdown>`,
  items = ['default', 'Price low to high', 'Price high to low'],
  selectedSort = items[0]
}: Partial<{ template?: string; items?: any[]; selectedSort?: any }> = {}) {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});

  installNewXPlugin({ store }, localVue, bus);
  XPlugin.registerXModule(searchXModule);
  resetXSearchStateWith(store, { sort: selectedSort });

  const onSelectedSortProvided = jest.fn();
  bus.on('SelectedSortProvided', true).subscribe(onSelectedSortProvided);
  const onUserClickedASort = jest.fn();
  bus.on('UserClickedASort', true).subscribe(onUserClickedASort);

  const wrapper = mount(
    {
      template,
      components: { SortDropdown },
      props: ['items']
    },
    {
      localVue,
      store,
      propsData: { items }
    }
  );
  jest.runAllTimers(); // For `SelectedSortProvided` immediate emission

  const sortDropdown = wrapper.findComponent(SortDropdown);
  return {
    wrapper: sortDropdown,
    onSelectedSortProvided,
    onUserClickedASort,
    getSelectedItem: () => sortDropdown.find('.x-dropdown__item--is-selected'),
    getToggleButton: () => sortDropdown.find(getDataTestSelector('dropdown-toggle')),
    clickToggleButton: async () =>
      await sortDropdown.find(getDataTestSelector('dropdown-toggle')).trigger('click'),
    clickNthItem: async (index: number) => {
      await sortDropdown.findAll(getDataTestSelector('dropdown-item')).at(index).trigger('click');
    }
  } as const;
}

describe('testing SortDropdown component', () => {
  // Making bus not repeat subjects
  jest.spyOn(bus, 'createEmitter' as any).mockImplementation(dummyCreateEmitter.bind(bus) as any);
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('is an XComponent', () => {
    const { wrapper } = renderSortDropdown();
    expect(isXComponent(wrapper.vm)).toBe(true);
  });

  it('is an XComponent that belongs to the search module', () => {
    const { wrapper } = renderSortDropdown();
    expect(getXComponentXModuleName(wrapper.vm)).toBe('search');
  });

  it('allows selecting one of the options of the dropdown', async () => {
    const {
      wrapper,
      clickNthItem,
      clickToggleButton,
      getToggleButton,
      getSelectedItem,
      onUserClickedASort
    } = renderSortDropdown({
      items: ['price', 'relevance', 'offer']
    });

    await clickToggleButton();
    await clickNthItem(2);
    await clickToggleButton();
    jest.runAllTimers();
    await nextTick();

    expect(onUserClickedASort).toHaveBeenCalledTimes(1);
    expect(onUserClickedASort).toHaveBeenCalledWith({
      eventPayload: 'offer',
      metadata: {
        moduleName: 'search',
        target: wrapper.vm.$el as HTMLElement,
        location: 'none',
        replaceable: true
      }
    });
    expect(getToggleButton().text()).toEqual('offer');
    expect(getSelectedItem().text()).toEqual('offer');
  });

  it('returns the first item as default', () => {
    const { onSelectedSortProvided } = renderSortDropdown();

    expect(onSelectedSortProvided).toHaveBeenCalledTimes(1);
    // This event gets emitted immediately, before the component has been mounted
    expect(onSelectedSortProvided).toHaveBeenCalledWith({
      eventPayload: 'default',
      metadata: { moduleName: 'search', location: 'none', replaceable: true }
    });
  });

  describe('slots', () => {
    it('allows to customize each item using the slots', async () => {
      const { getSelectedItem, clickToggleButton } = renderSortDropdown({
        template: `
          <SortDropdown :items="items">
            <template #item="{ item, isSelected, isHighlighted }">
              <span v-if="isSelected">✅</span>
              <span v-if="isHighlighted">🟢</span>
              <span>{{ item }}</span>
            </template>
          </SortDropdown>`
      });

      await clickToggleButton();
      expect(getSelectedItem().text()).toEqual(`✅ 🟢 default`);
    });

    it('allows to customize the toggle button', async () => {
      const { getToggleButton, clickToggleButton } = renderSortDropdown({
        template: `
          <SortDropdown :items="items">
            <template #toggle="{ item, isOpen }">
              {{ item }} {{ isOpen ? '🔽' : '🔼'}}
            </template>
          </SortDropdown>`
      });

      expect(getToggleButton().text()).toEqual('default 🔼');
      await clickToggleButton();
      expect(getToggleButton().text()).toEqual('default 🔽');
    });
  });
});
