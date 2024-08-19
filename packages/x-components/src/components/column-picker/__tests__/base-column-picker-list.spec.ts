import { mount, VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import { XPlugin } from '../../../plugins/x-plugin';
import BaseColumnPickerList from '../base-column-picker-list.vue';
import { XDummyBus } from '../../../__tests__/bus.dummy';
let bus = new XDummyBus();
function render({
  selectedColumns,
  columns,
  buttonClass,
  customItemSlot = `
    <template #default="{ column }">
      <p data-test="column-slot">{{ column }}</p>
    </template>`,
  template = `
   <BaseColumnPickerList
      :columns="columns"
      :modelValue="selectedColumns"
      :buttonClass="buttonClass"
      @update:modelValue="col => selectedColumns = col"
    >
      ${customItemSlot ?? ''}
   </BaseColumnPickerList>`
}: BaseColumnPickerListRenderOptions = {}) {
  function mountComponent(options: { selectedColumns?: number } = {}) {
    return mount(
      {
        components: { BaseColumnPickerList },
        template,
        data: () => ({
          columns,
          selectedColumns: options.selectedColumns ?? selectedColumns,
          buttonClass
        })
      },
      {
        props: { columns, buttonClass },
        global: { plugins: [installNewXPlugin({}, bus)] }
      }
    );
  }

  const columnPickerListWrapper = mountComponent();
  const wrapper = columnPickerListWrapper.findComponent(BaseColumnPickerList);

  return {
    wrapper,
    mountComponent: async (options: { selectedColumns?: number } = {}) => {
      const component = mountComponent(options);
      await nextTick();
      return component;
    },
    setWrapperSelectedColumns: async (column: number) => {
      await columnPickerListWrapper.setData({ selectedColumns: column });
      await nextTick();
    },
    clickNthItem: async (nth: number) => {
      await wrapper.findAll(getDataTestSelector('column-picker-button')).at(nth)?.trigger('click');
      await nextTick();
    },
    getSelectedItem: () => wrapper.find('[aria-pressed=true]')
  } as const;
}

describe('testing BaseColumnPickerList component', () => {
  beforeEach(() => {
    bus = new XDummyBus();
  });
  it('emits ColumnsNumberProvided event with the column number on init', () => {
    render({ columns: [1, 3, 6] });

    const listenerColumnPicker = jest.fn();
    XPlugin.bus.on('ColumnsNumberProvided', true).subscribe(listenerColumnPicker);

    expect(listenerColumnPicker).toHaveBeenCalledTimes(1);
    expect(listenerColumnPicker).toHaveBeenNthCalledWith(1, {
      eventPayload: 1,
      metadata: {
        moduleName: null,
        location: 'none',
        replaceable: true
      }
    });
  });

  it('emits XEvents & a Vue event when the user selects a value', async () => {
    const columns = [1, 3, 6];
    const index = 1;
    const { wrapper, clickNthItem } = render({ columns });

    const userClickedColumnPickerListener = jest.fn();
    const columnsNumberProvidedListener = jest.fn();
    XPlugin.bus.on('UserClickedColumnPicker', true).subscribe(userClickedColumnPickerListener);
    XPlugin.bus.on('ColumnsNumberProvided', true).subscribe(columnsNumberProvidedListener);

    await clickNthItem(index);

    expect(wrapper.emitted('update:modelValue')).toEqual([[columns[index]]]);
    expect(userClickedColumnPickerListener).toHaveBeenCalledTimes(1);
    expect(userClickedColumnPickerListener).toHaveBeenNthCalledWith(1, {
      eventPayload: columns[index],
      metadata: {
        moduleName: null, // no module registered for this base component
        target: wrapper.findAll(getDataTestSelector('column-picker-button')).at(index)?.element,
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
        target: wrapper.findAll(getDataTestSelector('column-picker-button')).at(index)?.element,
        location: 'none',
        replaceable: true
      }
    });
  });

  it('allows configuring the number of columns and updates the css class accordingly', () => {
    const columns = [1, 3, 6];
    const { wrapper } = render({ columns });
    const columnPickerListWrapper = wrapper.findAll(getDataTestSelector('column-picker-button'));

    columns.forEach((column, index) => {
      expect(columnPickerListWrapper.at(index)?.classes()).toContain(
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
    const { wrapper } = render({ columns, customItemSlot });
    const columnsSlots = wrapper.findAll(getDataTestSelector('custom-column-slot'));

    expect(columnsSlots).toHaveLength(columns.length);
    columns.forEach((column, index) => {
      expect(columnsSlots.at(index)?.text()).toEqual(column.toString());
    });
  });

  it('by default there are no divider elements between column picker buttons', () => {
    const columns = [1, 3, 6];
    const { wrapper } = render({ columns });

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

    const { wrapper } = render({ columns, customItemSlot });

    const dividerSlots = wrapper.findAll(getDataTestSelector('custom-divider-slot'));
    expect(dividerSlots).toHaveLength(columns.length - 1);
  });

  it('updates selected value on fresh mounts correctly', async () => {
    const getSelectedItem = (wrapper: VueWrapper): string =>
      wrapper.get('[aria-pressed=true]').text();
    const { wrapper, mountComponent, clickNthItem, setWrapperSelectedColumns } = render({
      columns: [4, 6, 0]
    });
    const wrappers = [wrapper];

    expect(wrapper.text().slice(0, 1)).toEqual('4');

    // Mounting another component does not change selected value
    wrappers.push(await mountComponent());
    wrappers.forEach(wrapper => expect(getSelectedItem(wrapper)).toEqual('4'));

    // Clicking the first item updates the selected value in both items
    await clickNthItem(1);
    wrappers.forEach(wrapper => expect(getSelectedItem(wrapper)).toEqual('6'));

    // Mounting a new component receives the updated selected value
    wrappers.push(await mountComponent());
    wrappers.forEach(wrapper => expect(getSelectedItem(wrapper)).toEqual('6'));

    // Changing the value using v-model in one components updates all of them
    await setWrapperSelectedColumns(0);
    wrappers.push(await mountComponent());
    wrappers.forEach(wrapper => expect(getSelectedItem(wrapper)).toEqual('0'));

    // New component instances initial value is ignored
    wrappers.push(await mountComponent());
    wrappers.forEach(wrapper => expect(getSelectedItem(wrapper)).toEqual('0'));
  });

  it('allows adding CSS class to the buttons', () => {
    const { wrapper } = render({
      columns: [1, 3, 6],
      buttonClass: 'custom-class'
    });

    wrapper.findAll('button').forEach(button => {
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
