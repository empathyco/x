import { mount, VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import { XPlugin } from '../../../plugins/x-plugin';
import BaseColumnPickerDropdown from '../base-column-picker-dropdown.vue';
import { XDummyBus } from '../../../__tests__/bus.dummy';
const bus = new XDummyBus();

function render({
  selectedColumns,
  columns = [2, 4, 6],
  template = `
    <BaseColumnPickerDropdown
      @update:modelValue="col => selectedColumns = col"
      :columns="columns"
      :modelValue="selectedColumns"
    >
      <template #item="{ item, isSelected, isHighlighted }">
        <span v-if="isHighlighted">🟢</span>
        <span v-if="isSelected">✅</span>
        <span>{{ item }}</span>
      </template>
    </BaseColumnPickerDropdown>`
}: { selectedColumns?: number; columns?: number[]; template?: string } = {}) {
  const mountComponent = (options: { selectedColumns?: number } = {}): VueWrapper => {
    return mount(
      {
        components: {
          BaseColumnPickerDropdown
        },
        data() {
          return {
            columns,
            selectedColumns: options.selectedColumns ?? selectedColumns
          };
        },
        template
      },
      {
        global: { plugins: [installNewXPlugin({}, bus)] }
      }
    );
  };

  const columnPickerDropdownWrapper = mountComponent();
  const wrapper: VueWrapper = columnPickerDropdownWrapper.findComponent(BaseColumnPickerDropdown);
  const toggleWrapper = wrapper.find(getDataTestSelector('dropdown-toggle'));
  const toggleDropdown = async () => await toggleWrapper.trigger('click');

  return {
    wrapper,
    toggleWrapper,
    mountComponent: async (options: { selectedColumns?: number } = {}) => {
      const component = mountComponent(options);
      await nextTick();
      return component;
    },
    toggleDropdown,
    setWrapperSelectedColumns: async (column: number) => {
      await columnPickerDropdownWrapper.setData({ selectedColumns: column });
      await nextTick();
    },
    clickNthItem: async (nth: number) => {
      await toggleDropdown();
      await wrapper.findAll(getDataTestSelector('dropdown-item')).at(nth)?.trigger('click');
      await nextTick();
    }
  } as const;
}

describe('testing BaseColumnPickerDropdown component', () => {
  it('emits ColumnsNumberProvided event with the column number on init', () => {
    render();

    const listenerColumnPicker = jest.fn();
    XPlugin.bus.on('ColumnsNumberProvided', true).subscribe(listenerColumnPicker);

    expect(listenerColumnPicker).toHaveBeenCalledTimes(1);
    expect(listenerColumnPicker).toHaveBeenNthCalledWith(1, {
      eventPayload: 2,
      metadata: {
        moduleName: null,
        location: 'none',
        replaceable: true
      }
    });
  });

  it('sets value prop as initial selectedColumns', () => {
    const { toggleWrapper } = render({ selectedColumns: 4 });

    expect(toggleWrapper.text()).toEqual('4');
  });

  it('sets first columns item as initial selectedColumns if no value is provided', () => {
    const { toggleWrapper } = render();

    expect(toggleWrapper.text()).toEqual('2');
  });

  it('sets selectedColumns and emits "ColumnsNumberProvided" X Event with the column as payload on value change', async () => {
    const { toggleWrapper, setWrapperSelectedColumns } = render();

    const listener = jest.fn();
    XPlugin.bus.on('ColumnsNumberProvided').subscribe(listener);

    expect(toggleWrapper.text()).toEqual('2');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenNthCalledWith(1, 2);

    await setWrapperSelectedColumns(4);

    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenNthCalledWith(2, 4);
    expect(toggleWrapper.text()).toEqual('4');
  });

  it('sets selectedColumns and emits "update:modelValue" event with the payload of "UserClickedColumnPicker" X Event received', async () => {
    const { wrapper, toggleWrapper } = render();

    await XPlugin.bus.emit('ColumnsNumberProvided', 4);
    await nextTick();

    expect(wrapper.emitted('update:modelValue')).toEqual([[4]]);
    expect(toggleWrapper.text()).toEqual('4');
  });

  it('emits "UserClickedColumnPicker" when clicking a item dropdown, changing its own selectedColumns value', async () => {
    const { clickNthItem, toggleWrapper } = render();

    const listener = jest.fn();
    XPlugin.bus.on('UserClickedColumnPicker').subscribe(listener);

    expect(toggleWrapper.text()).toEqual('2');

    await clickNthItem(2);

    expect(toggleWrapper.text()).toEqual('6');
    expect(listener).toHaveBeenNthCalledWith(1, 6);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('provides slots to customize the toggle button and the items', async () => {
    const { wrapper, toggleWrapper, toggleDropdown } = render({
      template: `
        <BaseColumnPickerDropdown
          :columns="columns"
          :modelValue="selectedColumns"
          @update:modelValue="col => selectedColumns = col"
        >
          <template #toggle="{ item }">
            Selected: {{ item }}
          </template>
          <template #item="{ item, isSelected, isHighlighted }">
            <span v-if="isHighlighted">🟢</span>
            <span v-if="isSelected">✅</span>
            <span>{{ item }}</span>
          </template>
        </BaseColumnPickerDropdown>
      `,
      selectedColumns: 2
    });

    expect(toggleWrapper.text()).toEqual('Selected: 2');

    await toggleDropdown();

    const itemWrapperArray = wrapper.findAll(getDataTestSelector('dropdown-item'));

    expect(itemWrapperArray.at(0)?.text()).toEqual('🟢✅2');
    expect(itemWrapperArray.at(1)?.text()).toEqual('4');
    expect(itemWrapperArray.at(2)?.text()).toEqual('6');
  });

  it('renders the item slot as toggle when its slot is not defined', () => {
    const { toggleWrapper } = render({
      template: `
        <BaseColumnPickerDropdown
          :columns="columns"
          :modelValue="selectedColumns"
          @update:modelValue="col => selectedColumns = col"
        >
          <template #item="{ item }">
            <span data-test="column-picker-dropdown-item">{{ item }}</span>
          </template>
        </BaseColumnPickerDropdown>
      `
    });

    expect(toggleWrapper.text()).toEqual('2');
  });

  it('updates selected value on fresh mounts correctly', async () => {
    const { wrapper, mountComponent, clickNthItem, setWrapperSelectedColumns } = render({
      columns: [4, 6, 0]
    });
    const wrappers = [wrapper];

    expect(wrapper.text().slice(0, 1)).toEqual('4');

    // Mounting another component does not change selected value
    wrappers.push(await mountComponent());
    wrappers.forEach(wrapper => expect(wrapper.text().slice(0, 1)).toEqual('4'));

    // Clicking the first item updates the selected value in both items
    await clickNthItem(1);
    await nextTick();
    wrappers.forEach(wrapper => expect(wrapper.text().slice(0, 1)).toEqual('6'));

    // Mounting a new component receives the updated selected value
    wrappers.push(await mountComponent());
    wrappers.forEach(wrapper => expect(wrapper.text().slice(0, 1)).toEqual('6'));

    // Changing the value using v-model in one components updates all of them
    await setWrapperSelectedColumns(0);
    wrappers.push(await mountComponent());
    wrappers.forEach(wrapper => expect(wrapper.text().slice(0, 1)).toEqual('0'));

    // New component instances initial value is ignored
    wrappers.push(await mountComponent());
    wrappers.forEach(wrapper => expect(wrapper.text().slice(0, 1)).toEqual('0'));
  });
});
