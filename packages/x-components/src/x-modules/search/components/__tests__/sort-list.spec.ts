import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { Sort } from '@empathyco/x-types';
import Vuex, { Store } from 'vuex';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { WirePayload } from '../../../../wiring';
import SortList from '../sort-list.vue';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { DeepPartial } from '../../../../utils/types';
import { RootXStoreState } from '../../../../store/store.types';
import { XPlugin } from '../../../../plugins/x-plugin';
import { searchXModule } from '../../x-module';
import { resetXSearchStateWith } from './utils';

function renderSortList({
  template = `
   <SortList v-bind="$attrs">
      <template #default="{ item }">
        {{ item }}
      </template>
   </SortList>`,
  items = ['Relevance', 'Price low to high', 'Price high to low'],
  value,
  selectedSort = items[0]
}: RenderSortListOptions = {}): RenderSortListAPI {
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
      components: { SortList },
      template
    },
    {
      localVue,
      store,
      propsData: {
        items,
        value
      }
    }
  );

  const sortListWrapper = wrapper.findComponent(SortList);

  return {
    wrapper: sortListWrapper,
    onUserClickedASort,
    onSelectedSortProvided,
    async clickNthItem(index) {
      await sortListWrapper
        .findAll(getDataTestSelector('x-sort-button'))
        .at(index)
        .trigger('click');
    },
    getButton(index) {
      return wrapper.vm.$el.children[index].children[0] as HTMLElement;
    },
    getSelectedItem() {
      return sortListWrapper.get('.x-sort-list__item--is-selected');
    },
    async setItems(items) {
      await wrapper.setProps({
        items
      });
    },
    async setValue(sort) {
      await wrapper.setProps({
        value: sort
      });
    }
  };
}

describe('testing SortList component', () => {
  it('is an XComponent', () => {
    const { wrapper } = renderSortList();
    expect(isXComponent(wrapper.vm)).toBe(true);
  });

  it('is an XComponent that belongs to the search module', () => {
    const { wrapper } = renderSortList();
    expect(getXComponentXModuleName(wrapper.vm)).toBe('search');
  });

  it('allows selecting one of the options of the list', async () => {
    const { getButton, clickNthItem, getSelectedItem, onUserClickedASort } = renderSortList({
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
        target: buttonWrapper
      }
    });
  });

  it('allows providing a selected sort value using props', async () => {
    const { onSelectedSortProvided, setValue } = renderSortList({
      items: ['price desc', 'price asc', 'default'],
      value: 'default'
    });

    expect(onSelectedSortProvided).toHaveBeenCalledTimes(1);
    expect(onSelectedSortProvided).toHaveBeenCalledWith<[WirePayload<Sort>]>({
      eventPayload: 'default',
      // This event gets emitted immediately, before the component has been mounted
      metadata: { moduleName: 'search' }
    });

    await setValue('price asc');

    expect(onSelectedSortProvided).toHaveBeenCalledTimes(2);
    expect(onSelectedSortProvided).toHaveBeenCalledWith<[WirePayload<Sort>]>({
      eventPayload: 'price asc',
      metadata: { moduleName: 'search' }
    });
  });

  // eslint-disable-next-line max-len
  it('emits the first element of the `items` prop as the provided sort if no `value` is provided', () => {
    const { onSelectedSortProvided } = renderSortList({
      items: ['price desc', 'price asc', 'default']
    });

    expect(onSelectedSortProvided).toHaveBeenCalledTimes(1);
    expect(onSelectedSortProvided).toHaveBeenCalledWith<[WirePayload<Sort>]>({
      eventPayload: 'price desc',
      // This event gets emitted immediately, before the component has been mounted
      metadata: { moduleName: 'search' }
    });
  });

  // eslint-disable-next-line max-len
  it('selects the first value of the items if they changed and there is not a provided value', async () => {
    const { setItems, getSelectedItem } = renderSortList({
      items: ['price desc', 'price asc', 'default']
    });

    await setItems(['relevance', 'offers first']);
    expect(getSelectedItem().text()).toEqual('relevance');
  });

  // eslint-disable-next-line max-len
  it('does not change the sort value if the items change and there is a provided value', async () => {
    const { setItems, getSelectedItem } = renderSortList({
      items: ['price desc', 'price asc', 'default'],
      value: 'price asc'
    });

    await setItems(['popularity', 'price desc', 'price asc']);
    expect(getSelectedItem().text()).toEqual('price asc');
  });

  describe('slots', () => {
    it('allows to customize each item using the default slot', () => {
      const { getSelectedItem } = renderSortList({
        items: ['Relevance', 'Price low to high', 'Price high to low'],
        value: 'Relevance',
        template: `
          <SortList v-bind="$attrs">
            <template #default="{ item, isSelected }">
              <span>{{isSelected}} - {{ item }}</span>
            </template>
          </SortList>`
      });

      expect(getSelectedItem().text()).toContain('true - Relevance');
    });
  });
});

interface RenderSortListOptions {
  /** The template to render in the test, including the `SortList` component. */
  template?: string;
  /** The possible values of the sort dropdown. Passed as prop to the `SortList`. */
  items?: Sort[];
  /** The selected sort value. Passed as prop to the `SortList`. */
  value?: Sort;
  /** The store selected sort value. The store state is reset with this sort in each test. */
  selectedSort?: Sort;
}

interface RenderSortListAPI {
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
  /**
   * Updates the `value` prop of the {@link SortDropdown} component.
   *
   * @returns A promise that resolves after the view has been updated.
   */
  setValue: (sort: Sort) => Promise<void>;
  /** The test wrapper of the {@link SortList} component. */
  wrapper: Wrapper<Vue>;
}
