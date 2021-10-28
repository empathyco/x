import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { Sort } from '@empathyco/x-types';
import Vuex, { Store } from 'vuex';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import SortDropdown from '../sort-dropdown.vue';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { DeepPartial } from '../../../../utils/types';
import { RootXStoreState } from '../../../../store/store.types';
import { XPlugin } from '../../../../plugins/x-plugin';
import { searchXModule } from '../../x-module';
import { WirePayload } from '../../../../wiring/wiring.types';
import { resetXSearchStateWith } from './utils';

function renderSortDropdown({
  template = `
   <SortDropdown v-bind="$attrs">
      <template #toggle="{ item }">
        {{ item }}
      </template>
      <template #item="{ item }">
        {{ item }}
      </template>
   </SortDropdown>`,
  items = ['Relevance', 'Price low to high', 'Price high to low'],
  selectedSort = items[0]
}: RenderSortDropdownOptions = {}): RenderSortDropdownAPI {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});

  XPlugin.resetInstance();
  XPlugin.registerXModule(searchXModule);
  resetXSearchStateWith(store, {
    sort: selectedSort
  });

  installNewXPlugin({ store }, localVue);

  const onSelectedSortProvided = jest.fn();
  XPlugin.bus.on('SelectedSortProvided', true).subscribe(onSelectedSortProvided);
  const onUserClickedASort = jest.fn();
  XPlugin.bus.on('UserClickedASort', true).subscribe(onUserClickedASort);

  const wrapper = mount(
    {
      components: { SortDropdown },
      template
    },
    {
      localVue,
      store,
      propsData: {
        items
      }
    }
  );

  const sortDropdownWrapper = wrapper.findComponent(SortDropdown);

  return {
    wrapper: sortDropdownWrapper,
    onSelectedSortProvided,
    onUserClickedASort,
    async clickToggleButton() {
      await sortDropdownWrapper.get(getDataTestSelector('dropdown-toggle')).trigger('click');
    },
    async clickNthItem(index) {
      await sortDropdownWrapper
        .findAll(getDataTestSelector('dropdown-item'))
        .at(index)
        .trigger('click');
    },
    getSelectedItem() {
      return sortDropdownWrapper.get('[aria-selected=true]');
    },
    getToggleButton() {
      return sortDropdownWrapper.get(getDataTestSelector('dropdown-toggle'));
    },
    getHighlightedItem() {
      return sortDropdownWrapper.get('[aria-current=true]');
    },
    async setItems(items) {
      await wrapper.setProps({
        items
      });
    }
  };
}

describe('testing SortDropdown component', () => {
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
      getHighlightedItem,
      onUserClickedASort
    } = renderSortDropdown({ items: ['price', 'relevance', 'offer'] });

    await clickToggleButton();
    await clickNthItem(2);
    await clickToggleButton();

    expect(getToggleButton().text()).toEqual('offer');
    expect(getSelectedItem().text()).toEqual('offer');
    expect(getHighlightedItem().text()).toEqual('offer');
    expect(onUserClickedASort).toHaveBeenCalledTimes(1);
    expect(onUserClickedASort).toHaveBeenCalledWith<[WirePayload<Sort>]>({
      eventPayload: 'offer',
      metadata: { moduleName: 'search', target: wrapper.vm.$el as HTMLElement }
    });
  });
  // eslint-disable-next-line max-len
  it('emits the first element of the `items` prop as the provided sort if no `value` is provided', () => {
    const { onSelectedSortProvided } = renderSortDropdown({
      items: ['price desc', 'price asc', '']
    });

    expect(onSelectedSortProvided).toHaveBeenCalledTimes(1);
    expect(onSelectedSortProvided).toHaveBeenCalledWith<[WirePayload<Sort>]>({
      eventPayload: '',
      // This event gets emitted immediately, before the component has been mounted
      metadata: { moduleName: 'search', target: undefined }
    });
  });

  describe('slots', () => {
    it('allows to customize each item using the slots', async () => {
      const { getSelectedItem, getHighlightedItem, clickToggleButton } = renderSortDropdown({
        items: ['', 'Price low to high', 'Price high to low'],
        template: `
          <SortDropdown v-bind="$attrs">
            <template #item="{ item, isSelected, isHighlighted }">
              <span v-if="isSelected">✅</span>
              <span v-if="isHighlighted">🟢</span>
              <span>{{ item }}</span>
            </template>
          </SortDropdown>`
      });

      await clickToggleButton();

      expect(getSelectedItem().text()).toBe(`✅ 🟢`);
      expect(getHighlightedItem().text()).toBe(`✅ 🟢`);
    });

    it('allows to customize the toggle button', async () => {
      const { getToggleButton, clickToggleButton } = renderSortDropdown({
        items: ['Relevance', 'Price low to high', 'Price high to low'],
        template: `
          <SortDropdown v-bind="$attrs">
            <template #toggle="{ item, isOpen }">
              {{ item }} {{ isOpen ? '🔽' : '🔼'}}
            </template>
          </SortDropdown>`
      });

      expect(getToggleButton().text()).toBe('🔼');

      await clickToggleButton();

      expect(getToggleButton().text()).toBe('🔽');
    });
  });
});

interface RenderSortDropdownOptions {
  /** The template to render in the test, including the `SortDropdown` component. */
  template?: string;
  /** The possible values of the sort dropdown. Passed as prop to the `SortDropdown`. */
  items?: Sort[];
  /** The store selected sort value. The store state is reset with this sort in each test. */
  selectedSort?: Sort;
}

interface RenderSortDropdownAPI {
  /** The test wrapper of the {@link SortDropdown} component. */
  wrapper: Wrapper<Vue>;
  /** Jest mock listener for the {@link SearchXEvents.SelectedSortProvided} event. */
  onSelectedSortProvided: jest.Mock;
  /** Jest mock listener for the {@link SearchXEvents.UserClickedASort} event. */
  onUserClickedASort: jest.Mock;
  /** Retrieves the wrapper for the button that opens and closes the dropdown. */
  getToggleButton: () => Wrapper<Vue>;
  /**
   * Retrieves the highlighted item wrapper.
   * The dropdown must be open before this function is called.
   *
   * @returns A test wrapper for the highlighted item.
   */
  getHighlightedItem: () => Wrapper<Vue>;
  /**
   * Retrieves the selected item wrapper.
   * The dropdown must be open before this function is called.
   *
   * @returns A test wrapper for the selected item.
   */
  getSelectedItem: () => Wrapper<Vue>;
  /**
   * Clicks the button to open or close the dropdown.
   *
   * @returns A promise that resolves after the view has been updated.
   */
  clickToggleButton: () => Promise<void>;
  /**
   * Clicks the item with the provided index.
   * The dropdown must be open before this function is called.
   *
   * @returns A promise that resolves after the view has been updated.
   */
  clickNthItem: (index: number) => Promise<void>;
  /**
   * Updates the `items` prop of the {@link SortDropdown} component.
   *
   * @returns A promise that resolves after the view has been updated.
   */
  setItems: (items: Sort[]) => Promise<void>;
}
