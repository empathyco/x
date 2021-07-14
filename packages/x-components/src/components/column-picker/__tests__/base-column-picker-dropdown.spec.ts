import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import BaseColumnPickerDropdown from '../base-column-picker-dropdown.vue';

function renderBaseColumnPickerDropdownComponent({
  selectedColumns,
  columns,
  template = `
    <BaseColumnPickerDropdown v-model="selectedColumns" :columns="columns">
      <template #item="{ item, isSelected, isHighlighted }">
        <span v-if="isHighlighted">🟢</span>
        <span v-if="isSelected">✅</span>
        <span>{{ item }}</span>
      </template>
    </BaseColumnPickerDropdown>
  `
}: BaseColumnPickerDropdownRenderOptions = {}): BaseColumnPickerDropdownComponentAPI {
  const [, localVue] = installNewXPlugin();

  const wrapper = mountComponent();

  const componentWrapper = wrapper.findComponent(BaseColumnPickerDropdown);
  const toggleWrapper = componentWrapper.find(getDataTestSelector('dropdown-toggle'));

  function mountComponent(options: { selectedColumns?: number } = {}): Wrapper<Vue> {
    return mount(
      {
        components: {
          BaseColumnPickerDropdown
        },
        data() {
          return { selectedColumns: options.selectedColumns ?? selectedColumns };
        },
        props: ['columns'],
        template
      },
      {
        propsData: {
          columns
        },
        localVue
      }
    );
  }

  function toggleDropdown(): Promise<void> {
    componentWrapper.find(getDataTestSelector('dropdown-toggle')).trigger('click');
    return localVue.nextTick();
  }

  return {
    wrapper,
    componentWrapper,
    toggleWrapper,
    mountComponent,
    toggleDropdown,
    async setWrapperSelectedColumns(column: number): Promise<void> {
      await wrapper.setData({ selectedColumns: column });
      await localVue.nextTick();
    },
    async clickNthItem(nth: number): Promise<void> {
      await toggleDropdown();
      await componentWrapper.findAll(getDataTestSelector('dropdown-item')).at(nth).trigger('click');
    }
  };
}

describe('testing BaseColumnPickerDropdown', () => {
  it('emits ColumnsNumberProvided event with the column number on init', () => {
    const columns = [1, 3, 6];
    const index = 1;
    const value = columns[index];
    const { wrapper } = renderBaseColumnPickerDropdownComponent({
      columns,
      template: `<BaseColumnPickerDropdown :columns="columns" :value="${value}" />`
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

  it('sets value prop as initial selectedColumns', () => {
    const { toggleWrapper } = renderBaseColumnPickerDropdownComponent({
      selectedColumns: 4,
      columns: [2, 4, 6]
    });
    expect(toggleWrapper.text()).toBe('4');
  });

  it('sets first columns item as initial selectedColumns if no value is provided', () => {
    const { toggleWrapper } = renderBaseColumnPickerDropdownComponent({
      selectedColumns: undefined,
      columns: [2, 4, 6]
    });
    expect(toggleWrapper.text()).toBe('2');
  });

  // eslint-disable-next-line max-len
  it('sets selectedColumns and emits "ColumnsNumberProvided" X Event with the column as payload on value change', async () => {
    const { wrapper, toggleWrapper, setWrapperSelectedColumns } =
      renderBaseColumnPickerDropdownComponent({
        selectedColumns: undefined,
        columns: [2, 4, 6]
      });

    const listener = jest.fn();
    wrapper.vm.$x.on('ColumnsNumberProvided').subscribe(listener);
    expect(toggleWrapper.text()).toBe('2');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenNthCalledWith(1, 2);

    await setWrapperSelectedColumns(4);
    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenNthCalledWith(2, 4);
    expect(toggleWrapper.text()).toBe('4');
  });

  // eslint-disable-next-line max-len
  it('sets selectedColumns and emits "change" event with the payload of "UserClickedColumnPicker" X Event received', async () => {
    const { wrapper, componentWrapper, toggleWrapper } = renderBaseColumnPickerDropdownComponent({
      selectedColumns: 2,
      columns: [2, 4, 6]
    });
    wrapper.vm.$x.emit('ColumnsNumberProvided', 4);
    await wrapper.vm.$nextTick();
    expect(componentWrapper.emitted('change')).toEqual([[4]]);
    expect(toggleWrapper.text()).toBe('4');
  });

  // eslint-disable-next-line max-len
  it('emits "UserClickedColumnPicker" when clicking a item dropdown, changing its own selectedColumns value', async () => {
    const { clickNthItem, toggleWrapper, wrapper } = renderBaseColumnPickerDropdownComponent({
      selectedColumns: 2,
      columns: [2, 4, 6]
    });
    const listener = jest.fn();
    wrapper.vm.$x.on('UserClickedColumnPicker').subscribe(listener);

    expect(toggleWrapper.text()).toBe('2');

    await clickNthItem(2);

    expect(toggleWrapper.text()).toBe('6');

    expect(listener).toHaveBeenNthCalledWith(1, 6);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('provides slots to customize the toggle button and the items', async () => {
    const { wrapper, toggleWrapper, toggleDropdown } = renderBaseColumnPickerDropdownComponent({
      template: `
            <BaseColumnPickerDropdown v-model="selectedColumns" :columns="columns">
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
      selectedColumns: 2,
      columns: [2, 4, 6]
    });

    expect(toggleWrapper.text()).toEqual('Selected: 2');

    await toggleDropdown();

    const itemWrapperArray = wrapper.findAll(getDataTestSelector('dropdown-item'));

    expect(itemWrapperArray.at(0).text()).toBe('🟢 ✅ 2');
    expect(itemWrapperArray.at(1).text()).toBe('4');
    expect(itemWrapperArray.at(2).text()).toBe('6');
  });

  it('renders the item slot as toggle when its slot is not defined', () => {
    const { toggleWrapper } = renderBaseColumnPickerDropdownComponent({
      template: `
            <BaseColumnPickerDropdown v-model="selectedColumns" :columns="columns">
              <template #item="{ item }">
                <span data-test="column-picker-dropdown-item">{{ item }}</span>
              </template>
            </BaseColumnPickerDropdown>
        `,
      selectedColumns: 2,
      columns: [2, 4, 6]
    });
    expect(toggleWrapper.text()).toBe('2');
  });

  it('updates selected value on fresh mounts correctly', async () => {
    const { wrapper, mountComponent, clickNthItem, setWrapperSelectedColumns } =
      renderBaseColumnPickerDropdownComponent({ columns: [4, 6, 0] });

    expect(wrapper.text()).toBe('4');

    // Mounting another component does not change selected value
    const wrapper2 = mountComponent();
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toBe('4');
    expect(wrapper2.text()).toBe('4');

    // Clicking the first item updates the selected value in both items
    await clickNthItem(1);
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toBe('6');
    expect(wrapper2.text()).toBe('6');

    // Mounting a new component receives the updated selected value
    const wrapper3 = mountComponent();
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toBe('6');
    expect(wrapper2.text()).toBe('6');
    expect(wrapper3.text()).toBe('6');

    // Changing the value using v-model in one components updates all of them
    await setWrapperSelectedColumns(0);
    const wrapper4 = mountComponent();
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toBe('0');
    expect(wrapper2.text()).toBe('0');
    expect(wrapper3.text()).toBe('0');
    expect(wrapper4.text()).toBe('0');

    // New component instances initial value is ignored
    const wrapper5 = mountComponent({ selectedColumns: 6 });
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toBe('0');
    expect(wrapper2.text()).toBe('0');
    expect(wrapper3.text()).toBe('0');
    expect(wrapper4.text()).toBe('0');
    expect(wrapper5.text()).toBe('0');
  });
});

interface BaseColumnPickerDropdownRenderOptions {
  /** The number of columns to be rendered. */
  columns?: number[];
  /** The selected column value. */
  selectedColumns?: number | null;
  /** The template to be rendered. */
  template?: string;
}

interface BaseColumnPickerDropdownComponentAPI {
  /** The wrapper of the container element.*/
  wrapper: Wrapper<Vue>;
  /** The wrapper of the component. */
  componentWrapper: Wrapper<Vue>;
  /** The wrapper of the toggle. */
  toggleWrapper: Wrapper<Vue>;
  /** Mounts a new component. */
  mountComponent: (options?: { selectedColumns?: number }) => Wrapper<Vue>;
  /** Toggles dropdown. */
  toggleDropdown: () => Promise<void>;
  /** Changes parent wrapper selected columns to simulate v-model change. */
  setWrapperSelectedColumns: (column: number) => Promise<void>;
  /** Clicks nth item. */
  clickNthItem: (item: number) => Promise<void>;
}
