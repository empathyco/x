import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue, mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Vuex, { Store } from 'vuex';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import SortList from '../sort-list.vue';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { RootXStoreState } from '../../../../store/store.types';
import { XPlugin } from '../../../../plugins/x-plugin';
import { searchXModule } from '../../x-module';
import { resetXSearchStateWith } from './utils';

function renderSortList({
  template = `
   <SortList :items="items">
      <template #default="{ item }">
        {{ item }}
      </template>
   </SortList>`,
  items = ['default', 'Price low to high', 'Price high to low'],
  selectedSort = items[0]
}: Partial<{ template?: string; items?: any[]; selectedSort?: any }> = {}) {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});

  installNewXPlugin({ store }, localVue);
  XPlugin.registerXModule(searchXModule);
  resetXSearchStateWith(store, { sort: selectedSort });

  const onSelectedSortProvided = jest.fn();
  XPlugin.bus.on('SelectedSortProvided', true).subscribe(onSelectedSortProvided);
  const onUserClickedASort = jest.fn();
  XPlugin.bus.on('UserClickedASort', true).subscribe(onUserClickedASort);

  const wrapper = mount(
    {
      template,
      components: { SortList },
      props: ['items']
    },
    {
      localVue,
      store,
      propsData: { items }
    }
  );

  const sortList = wrapper.findComponent(SortList);

  return {
    wrapper: sortList,
    onUserClickedASort,
    onSelectedSortProvided,
    getButton: (index: number) => wrapper.vm.$el.children[index].children[0] as HTMLElement,
    getSelectedItem: () => sortList.get('.x-sort-list__item--is-selected'),
    clickNthItem: async (index: number) => {
      await sortList.findAll(getDataTestSelector('x-sort-button')).at(index).trigger('click');
      await nextTick();
    }
  };
}

describe('testing SortList component', () => {
  it('is an XComponent', () => {
    const { wrapper } = renderSortList();
    expect(isXComponent(wrapper.vm)).toBeTruthy();
  });

  it('is an XComponent that belongs to the search module', () => {
    const { wrapper } = renderSortList();
    expect(getXComponentXModuleName(wrapper.vm)).toBe('search');
  });

  it('allows selecting one of the options of the list', async () => {
    const { getButton, clickNthItem, getSelectedItem, onUserClickedASort } = renderSortList({
      items: ['price', 'relevance', 'offer']
    });

    await clickNthItem(2);

    expect(onUserClickedASort).toHaveBeenCalledTimes(1);
    expect(onUserClickedASort).toHaveBeenCalledWith({
      eventPayload: 'offer',
      metadata: {
        moduleName: 'search',
        target: getButton(2),
        location: undefined, // TODO - Emission by BaseEventButton in the old way. `none` when use$x
        replaceable: true
      }
    });
    expect(getSelectedItem().text()).toEqual('offer');
  });

  it('emits the first element of the `items` prop as the provided sort', () => {
    const { onSelectedSortProvided } = renderSortList();

    expect(onSelectedSortProvided).toHaveBeenCalledTimes(1);
    expect(onSelectedSortProvided).toHaveBeenCalledWith({
      eventPayload: 'default',
      // This event gets emitted immediately, before the component has been mounted
      metadata: { moduleName: 'search', location: 'none', replaceable: true }
    });
  });

  describe('slots', () => {
    it('allows to customize each item using the default slot', () => {
      const { getSelectedItem } = renderSortList({
        template: `
          <SortList :items="items">
            <template #default="{ item, isSelected }">
              <span>{{ isSelected }}</span>
            </template>
          </SortList>`
      });

      expect(getSelectedItem().text()).toContain('true');
    });
  });
});
