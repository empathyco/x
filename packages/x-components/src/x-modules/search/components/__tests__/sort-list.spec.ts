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
  items = ['', 'Price low to high', 'Price high to low'],
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
        items
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

  // eslint-disable-next-line max-len
  it('emits the first element of the `items` prop as the provided sort', () => {
    const { onSelectedSortProvided } = renderSortList({
      items: ['price desc', 'price asc', '']
    });

    expect(onSelectedSortProvided).toHaveBeenCalledTimes(1);
    expect(onSelectedSortProvided).toHaveBeenCalledWith<[WirePayload<Sort>]>({
      eventPayload: '',
      // This event gets emitted immediately, before the component has been mounted
      metadata: { moduleName: 'search' }
    });
  });

  describe('slots', () => {
    it('allows to customize each item using the default slot', () => {
      const { getSelectedItem } = renderSortList({
        items: ['', 'Price low to high', 'Price high to low'],
        template: `
          <SortList v-bind="$attrs">
            <template #default="{ item, isSelected }">
              <span>{{isSelected}}</span>
            </template>
          </SortList>`
      });

      expect(getSelectedItem().text()).toContain('true');
    });
  });
});

interface RenderSortListOptions {
  /** The template to render in the test, including the `SortList` component. */
  template?: string;
  /** The possible values of the sort dropdown. Passed as prop to the `SortList`. */
  items?: Sort[];
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
  /** The test wrapper of the {@link SortList} component. */
  wrapper: Wrapper<Vue>;
}
