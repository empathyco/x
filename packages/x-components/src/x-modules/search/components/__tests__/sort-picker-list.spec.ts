import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { Sort } from '@empathyco/x-types';
import Vuex, { Store } from 'vuex';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { WirePayload } from '../../../../wiring';
import SortPickerList from '../sort-picker-list.vue';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { RootXStoreState } from '../../../../store/store.types';
import { XPlugin } from '../../../../plugins/x-plugin';
import { searchXModule } from '../../x-module';
import { resetXSearchStateWith } from './utils';

function renderSortPickerList({
  template = `
   <SortPickerList v-bind="$attrs">
      <template #default="{ item }">
        {{ item }}
      </template>
   </SortPickerList>`,
  items = ['', 'Price low to high', 'Price high to low'],
  selectedSort = items[0],
  buttonClass
}: RenderSortPickerListOptions = {}): RenderSortPickerListAPI {
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
      components: { SortPickerList },
      template
    },
    {
      localVue,
      store,
      propsData: {
        items,
        buttonClass
      }
    }
  );

  const sortPickerListWrapper = wrapper.findComponent(SortPickerList);

  return {
    wrapper: sortPickerListWrapper,
    onUserClickedASort,
    onSelectedSortProvided,
    async clickNthItem(index) {
      await sortPickerListWrapper
        .findAll(getDataTestSelector('sort-picker-button'))
        .at(index)
        .trigger('click');
    },
    getButton(index) {
      return wrapper.vm.$el.children[index] as HTMLElement;
    },
    getSelectedItem() {
      return sortPickerListWrapper.get('.x-selected');
    },
    async setItems(items) {
      await wrapper.setProps({
        items
      });
    }
  };
}

describe('testing SortPickerList component', () => {
  it('is an XComponent', () => {
    const { wrapper } = renderSortPickerList();
    expect(isXComponent(wrapper.vm)).toBe(true);
  });

  it('is an XComponent that belongs to the search module', () => {
    const { wrapper } = renderSortPickerList();
    expect(getXComponentXModuleName(wrapper.vm)).toBe('search');
  });

  it('allows selecting one of the options of the list', async () => {
    const { getButton, clickNthItem, getSelectedItem, onUserClickedASort } = renderSortPickerList({
      items: ['price', 'relevance', 'offer']
    });

    const buttonWrapper = getButton(2);
    await clickNthItem(2);

    expect(getSelectedItem().text()).toEqual('offer');
    expect(onUserClickedASort).toHaveBeenCalledTimes(1);
    expect(onUserClickedASort).toHaveBeenCalledWith<[WirePayload<Sort>]>({
      eventPayload: 'offer',
      metadata: {
        moduleName: 'search',
        target: buttonWrapper,
        location: undefined,
        replaceable: true
      }
    });
  });

  // eslint-disable-next-line max-len
  it('emits the first element of the `items` prop as the provided sort', () => {
    const { onSelectedSortProvided } = renderSortPickerList({
      items: ['price desc', 'price asc', '']
    });

    expect(onSelectedSortProvided).toHaveBeenCalledTimes(1);
    expect(onSelectedSortProvided).toHaveBeenCalledWith<[WirePayload<Sort>]>({
      eventPayload: '',
      // This event gets emitted immediately, before the component has been mounted
      metadata: { moduleName: 'search', location: undefined, replaceable: true }
    });
  });

  it('allows adding classes to the button', () => {
    const { wrapper } = renderSortPickerList({ buttonClass: 'custom-class' });
    const buttons = wrapper.findAll(getDataTestSelector('sort-picker-button'));
    expect(buttons.length).toBeTruthy();
    buttons.wrappers.forEach(button => {
      expect(button.classes('custom-class')).toBe(true);
    });
  });

  it('adds the aria pressed attribute to the selected item', async () => {
    const { wrapper, getButton } = renderSortPickerList({ items: ['name', 'price'] });
    const button = getButton(1);

    button.click();
    await wrapper.vm.$nextTick();

    const buttons = wrapper.findAll(getDataTestSelector('sort-picker-button')).wrappers;
    expect(buttons[0].element).not.toHaveAttribute('aria-pressed');
    expect(buttons[1].element).toHaveAttribute('aria-pressed', 'true');
  });

  it('adds corresponding classes to the selected element', async () => {
    const { wrapper, getButton } = renderSortPickerList({ items: ['name', 'price'] });
    getButton(1).click();
    await wrapper.vm.$nextTick();

    const buttons = wrapper.findAll(getDataTestSelector('sort-picker-button')).wrappers;
    expect(buttons[0].classes('x-selected')).toBe(false);

    expect(buttons[1].classes('x-selected')).toBe(true);
  });

  describe('slots', () => {
    it('allows to customize each item using the default slot', () => {
      const { getSelectedItem } = renderSortPickerList({
        items: ['', 'Price low to high', 'Price high to low'],
        template: `
          <SortPickerList v-bind="$attrs">
            <template #default="{ item, isSelected }">
              <span>{{isSelected}}</span>
            </template>
          </SortPickerList>`
      });

      expect(getSelectedItem().text()).toContain('true');
    });
  });
});

interface RenderSortPickerListOptions {
  /** The template to render in the test, including the `SortPickerList` component. */
  template?: string;
  /** The possible values of the sort dropdown. Passed as prop to the `SortPickerList`. */
  items?: Sort[];
  /** The store selected sort value. The store state is reset with this sort in each test. */
  selectedSort?: Sort;
  /** Class to customize the button element. */
  buttonClass?: string;
}

interface RenderSortPickerListAPI {
  /**
   * Clicks the item with the provided index.
   *
   * @returns A promise that resolves after the view has been updated.
   */
  clickNthItem: (index: number) => Promise<void>;
  /** Jest mock listener for the {@link SearchXEvents.UserClickedASort} event. */
  onUserClickedASort: jest.Mock;
  /** Jest mock listener for the {@link SearchXEvents.SelectedSortProvided} event. */
  onSelectedSortProvided: jest.Mock;
  /**
   * Retrieves the selected button as HTMLElement.
   *
   * @returns A test button for the selected item.
   */
  getButton: (index: number) => HTMLElement;
  /**
   * Retrieves the selected item wrapper.
   *
   * @returns A test wrapper for the selected item.
   */
  getSelectedItem: () => Wrapper<Vue>;
  /**
   * Updates the `items` prop of the {@link SortDropdown} component.
   *
   * @returns A promise that resolves after the view has been updated.
   */
  setItems: (items: Sort[]) => Promise<void>;
  /** The test wrapper of the {@link SortPickerList} component. */
  wrapper: Wrapper<Vue>;
}
