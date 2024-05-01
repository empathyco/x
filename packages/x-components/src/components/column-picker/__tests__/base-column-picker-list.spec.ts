import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import BaseColumnPickerList from '../base-column-picker-list.vue';

function renderBaseColumnPickerListComponent({
  columns,
  selectedColumns,
  buttonClass,
  customItemSlot = `
    <template #default="{ column }">
      <p data-test="column-slot">{{ column }}</p>
    </template>`,
  template = `
   <BaseColumnPickerList v-bind="$attrs" v-model="selectedColumns">
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
        template,
        data() {
          return { selectedColumns: options.selectedColumns ?? selectedColumns };
        }
      },
      {
        propsData: {
          columns,
          buttonClass
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
      return wrapper.find('[aria-pressed=true]');
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
      template: `<BaseColumnPickerList v-bind="$attrs" :value="${value}" />`
    });
    const listenerColumnPicker = jest.fn();
    wrapper.vm.$x.on('ColumnsNumberProvided', true).subscribe(listenerColumnPicker);
    expect(listenerColumnPicker).toHaveBeenCalledTimes(1);
    expect(listenerColumnPicker).toHaveBeenNthCalledWith(1, {
      eventPayload: 3,
      metadata: {
        moduleName: null,
        location: undefined,
        replaceable: true
      }
    });
  });

  it('emits XEvents & a Vue event when the user selects a value', async () => {
    const columns = [1, 3, 6];
    const index = 1;
    const { wrapper, clickNthItem } = renderBaseColumnPickerListComponent({ columns });
    const userClickedColumnPickerListener = jest.fn();
    const columnsNumberProvidedListener = jest.fn();
    wrapper.vm.$x.on('UserClickedColumnPicker', true).subscribe(userClickedColumnPickerListener);
    wrapper.vm.$x.on('ColumnsNumberProvided', true).subscribe(columnsNumberProvidedListener);

    await clickNthItem(index);

    expect(wrapper.emitted('change')).toEqual([[columns[index]]]);
    expect(userClickedColumnPickerListener).toHaveBeenCalledTimes(1);
    expect(userClickedColumnPickerListener).toHaveBeenNthCalledWith(1, {
      eventPayload: columns[index],
      metadata: {
        moduleName: null, // no module registered for this base component
        target: wrapper.findAll(getDataTestSelector('column-picker-button')).at(index).element,
        location: 'none',
        replaceable: true
      }
    });
    /* 1st event is to sync the initial value
     * 2nd event is the clicked one
     * 3rd one is to sync the prop value */
    expect(columnsNumberProvidedListener).toHaveBeenCalledTimes(3);
    expect(columnsNumberProvidedListener).toHaveBeenNthCalledWith(2, {
      eventPayload: columns[index],
      metadata: {
        moduleName: null, // no module registered for this base component
        target: wrapper.findAll(getDataTestSelector('column-picker-button')).at(index).element,
        location: 'none',
        replaceable: true
      }
    });
  });

  it('allows configuring the number of columns and updates the css class accordingly', () => {
    const columns = [1, 3, 6];
    const { wrapper } = renderBaseColumnPickerListComponent({ columns });
    const columnPickerListWrapper = wrapper.findAll(getDataTestSelector('column-picker-button'));
    columns.forEach((column, index) => {
      expect(columnPickerListWrapper.at(index).classes()).toContain(
        `x-column-picker-list__button--${column}-cols`
      );
    });
  });

  it('allows customizing the picker button slot', () => {
    const columns = [1, 3, 6];
    const customItemSlot = `
      <template #default="{ column }">
        <p data-test="custom-column-slot">{{ column }}</p>
      </template>`;
    const { wrapper } = renderBaseColumnPickerListComponent({
      columns,
      customItemSlot
    });
    const columnsSlots = wrapper.findAll(getDataTestSelector('custom-column-slot'));
    expect(columnsSlots).toHaveLength(columns.length);
    columns.forEach((column, index) => {
      expect(columnsSlots.at(index).text()).toEqual(column.toString());
    });
  });

  it('by default there are no divider elements between column picker buttons', () => {
    const columns = [1, 3, 6];
    const { wrapper } = renderBaseColumnPickerListComponent({
      columns
    });

    const rootChildren = wrapper.element.children;
    expect(rootChildren).toHaveLength(columns.length);
  });

  it('divider slot renders only between column picker buttons', () => {
    const columns = [1, 3, 6];
    const customItemSlot = `
      <template #default="{ column }">
        <p>{{ column }}</p>
      </template>
      <template #divider>
        <span data-test="custom-divider-slot">-</span>
      </template>`;

    const { wrapper } = renderBaseColumnPickerListComponent({
      columns,
      customItemSlot
    });

    const dividerSlots = wrapper.findAll(getDataTestSelector('custom-divider-slot'));
    expect(dividerSlots).toHaveLength(columns.length - 1);

    dividerSlots.wrappers.forEach(dividerWrapper => {
      const nextSibling = dividerWrapper.element.nextSibling! as HTMLElement;
      expect(nextSibling.getAttribute('data-test')).toBe('column-picker-button');
    });
  });

  it('updates selected value on fresh mounts correctly', async () => {
    const getSelectedItem = (wrapper: Wrapper<Vue>): string =>
      wrapper.get('[aria-pressed=true]').text();
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

  it('allows adding CSS class to the buttons', () => {
    const { wrapper } = renderBaseColumnPickerListComponent({
      columns: [1, 3, 6],
      buttonClass: 'custom-class'
    });

    wrapper.findAll('button').wrappers.forEach(button => {
      expect(button.classes()).toContain('custom-class');
    });
  });
});

interface BaseColumnPickerListRenderOptions {
  /** The number of columns to be rendered. */
  columns?: number[];
  /** The custom element to be rendered. */
  customItemSlot?: string;
  /** The CSS classes to add to the buttons. */
  buttonClass?: string;
  /** The initial selected column value. */
  selectedColumns?: number;
  /** The template to be rendered. */
  template?: string;
}

interface BaseColumnPickerListComponentAPI {
  /** Clicks the event button and waits for the view to update. */
  clickNthItem: (index: number) => Promise<void>;
  /** Gets the selected item. */
  getSelectedItem: () => Wrapper<Vue>;
  /** Mounts a new component. */
  mountComponent: (options?: { selectedColumns?: number }) => Wrapper<Vue>;
  /** Changes parent wrapper selected column to simulate v-model change. */
  setWrapperSelectedColumns: (column: number) => Promise<void>;
  /** The wrapper of the container element.*/
  wrapper: Wrapper<Vue>;
}
