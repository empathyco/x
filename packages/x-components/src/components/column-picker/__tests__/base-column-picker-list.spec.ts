import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import BaseColumnPickerList from '../base-column-picker-list.vue';
import { BaseEventButton } from '../../index';

function renderBaseColumnPickerListComponent({
  columns,
  selectedColumns,
  customItemSlot = `
    <template #default="{ column }">
      <p data-test="column-slot">{{ column }}</p>
    </template>`,
  template = `
   <BaseColumnPickerList :columns="columns" v-model="selectedColumns">
      ${customItemSlot ?? ''}
   </BaseColumnPickerList>`
}: BaseColumnPickerListRenderOptions = {}): BaseColumnPickerListComponentAPI {
  const [, localVue] = installNewXPlugin();
  function mountComponent(options: { selectedColumns?: number } = {}): Wrapper<Vue> {
    return mount(
      {
        components: {
          BaseColumnPickerList
        },
        props: ['columns'],
        template,
        data() {
          return { selectedColumns: options.selectedColumns ?? selectedColumns };
        }
      },
      {
        propsData: {
          columns
        },
        localVue
      }
    );
  }

  const columnPickerListWrapper = mountComponent();
  const wrapper = columnPickerListWrapper.findComponent(BaseColumnPickerList);

  return {
    wrapper,
    mountComponent,
    async clickNthItem(nth: number) {
      await wrapper.findAll(getDataTestSelector('column-picker-button')).at(nth).trigger('click');
    },
    async setWrapperSelectedColumns(column: number): Promise<void> {
      await wrapper.setData({ selectedColumns: column });
    },
    getSelectedItem() {
      return wrapper.find('[aria-selected=true]');
    }
  };
}

describe('testing Base Column Picker List', () => {
  it('emits ColumnsNumberProvided event with the column number on init', () => {
    const columns = [1, 3, 6];
    const index = 1;
    const value = columns[index];
    const { wrapper } = renderBaseColumnPickerListComponent({
      columns,
      template: `<BaseColumnPickerList :columns="columns" :value="${value}" />`
    });
    const listenerColumnPicker = jest.fn();
    wrapper.vm.$x.on('ColumnsNumberProvided', true).subscribe(listenerColumnPicker);
    expect(listenerColumnPicker).toHaveBeenCalledTimes(1);
    expect(listenerColumnPicker).toHaveBeenNthCalledWith(1, {
      eventPayload: 3,
      metadata: {
        moduleName: null
      }
    });
  });

  it('emits UserClickedColumnPicker event with the column number as payload', async () => {
    const columns = [1, 3, 6];
    const index = 1;
    const { wrapper, clickNthItem } = renderBaseColumnPickerListComponent({ columns });
    const listenerColumnPicker = jest.fn();
    wrapper.vm.$x.on('UserClickedColumnPicker', true).subscribe(listenerColumnPicker);
    await clickNthItem(index);
    expect(listenerColumnPicker).toHaveBeenCalledTimes(1);
    expect(listenerColumnPicker).toHaveBeenNthCalledWith(1, {
      eventPayload: columns[index],
      metadata: {
        moduleName: null, // no module registered for this base component
        target: wrapper.findAllComponents(BaseEventButton).at(index).element
      }
    });
  });

  it('emits a `change` event with the selected column if it has changed.', async () => {
    const columns = [1, 3, 6];
    const index = 1;
    const { wrapper, clickNthItem } = renderBaseColumnPickerListComponent({ columns });
    const listenerColumnPicker = jest.fn();
    wrapper.vm.$x.on('UserClickedColumnPicker', true).subscribe(listenerColumnPicker);
    await clickNthItem(index);
    expect(wrapper.emitted('change')).toEqual([[columns[index]]]);
    expect(listenerColumnPicker).toHaveBeenCalledTimes(1);
  });

  it('allows configuring the number of columns and updates the css class accordingly', () => {
    const columns = [1, 3, 6];
    const { wrapper } = renderBaseColumnPickerListComponent({ columns });
    const columnPickerListWrapper = wrapper.findAll(getDataTestSelector('column-picker-item'));
    columns.forEach((column, index) => {
      expect(columnPickerListWrapper.at(index).classes()).toContain(
        `x-column-picker-list__item--${column}-cols`
      );
    });
  });

  it('allows customizing slots', () => {
    const columns = [1, 3, 6];
    const customItemSlot = `
      <template #default="{ column }">
        <p data-test="column-slot">{{ column }}</p>
      </template>`;
    const { wrapper } = renderBaseColumnPickerListComponent({
      columns,
      customItemSlot
    });
    const columnsSlots = wrapper.findAll(getDataTestSelector('column-slot'));
    expect(columnsSlots).toHaveLength(columns.length);
    columns.forEach((column, index) => {
      expect(columnsSlots.at(index).text()).toEqual(column.toString());
    });
  });

  it('updates selected value on fresh mounts correctly', async () => {
    const getSelectedItem = (wrapper: Wrapper<Vue>): string =>
      wrapper.get('[aria-selected=true]').text();
    const { wrapper, mountComponent, clickNthItem, setWrapperSelectedColumns } =
      renderBaseColumnPickerListComponent({
        columns: [4, 6, 0]
      });

    expect(getSelectedItem(wrapper)).toBe('4');

    // Mounting another component does not change selected value
    const wrapper2 = mountComponent();
    await wrapper.vm.$nextTick();
    expect(getSelectedItem(wrapper)).toBe('4');
    expect(getSelectedItem(wrapper2)).toBe('4');
    // Clicking the first item updates the selected value in both items
    await clickNthItem(1);
    await wrapper.vm.$nextTick();
    expect(getSelectedItem(wrapper)).toBe('6');
    expect(getSelectedItem(wrapper2)).toBe('6');

    // Mounting a new component receives the updated selected value
    const wrapper3 = mountComponent();
    await wrapper.vm.$nextTick();
    expect(getSelectedItem(wrapper)).toBe('6');
    expect(getSelectedItem(wrapper2)).toBe('6');
    expect(getSelectedItem(wrapper3)).toBe('6');

    // Changing the value using v-model in one components updates all of them
    await setWrapperSelectedColumns(0);
    await wrapper.vm.$nextTick();
    const wrapper4 = mountComponent();
    expect(getSelectedItem(wrapper)).toBe('0');
    expect(getSelectedItem(wrapper2)).toBe('0');
    expect(getSelectedItem(wrapper3)).toBe('0');
    expect(getSelectedItem(wrapper4)).toBe('0');

    // New component instances initial value is ignored
    const wrapper5 = mountComponent({ selectedColumns: 6 });
    await wrapper.vm.$nextTick();
    expect(getSelectedItem(wrapper)).toBe('0');
    expect(getSelectedItem(wrapper2)).toBe('0');
    expect(getSelectedItem(wrapper3)).toBe('0');
    expect(getSelectedItem(wrapper4)).toBe('0');
    expect(getSelectedItem(wrapper5)).toBe('0');
  });
});

interface BaseColumnPickerListRenderOptions {
  /** The number of columns to be rendered. */
  columns?: number[];
  /** The initial selected column value. */
  selectedColumns?: number;
  /** The custom element to be rendered. */
  customItemSlot?: string;
  /** The template to be rendered. */
  template?: string;
}

interface BaseColumnPickerListComponentAPI {
  /** The wrapper of the container element.*/
  wrapper: Wrapper<Vue>;
  /** Clicks the event button and waits for the view to update. */
  clickNthItem: (index: number) => Promise<void>;
  /** Mounts a new component. */
  mountComponent: (options?: { selectedColumns?: number }) => Wrapper<Vue>;
  /** Changes parent wrapper selected column to simulate v-model change. */
  setWrapperSelectedColumns: (column: number) => Promise<void>;
  /** Gets the selected item. */
  getSelectedItem: () => Wrapper<Vue>;
}
