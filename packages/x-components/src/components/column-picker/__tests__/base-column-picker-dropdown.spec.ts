import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import BaseColumnPickerDropdown from '../base-column-picker-dropdown.vue';

function renderBaseColumnPickerDropdownComponent({
  selectedColumn,
  columns,
  template = `
    <BaseColumnPickerDropdown v-model="selectedColumn" :columns="columns">
      <template #item="{ item, isSelected, isHighlighted }">
        <span v-if="isHighlighted">🟢</span>
        <span v-if="isSelected">✅</span>
        <span>{{ item }}</span>
      </template>
    </BaseColumnPickerDropdown>
  `
}: BaseColumnPickerDropdownRenderOptions = {}): BaseColumnPickerDropdownComponentAPI {
  const [, localVue] = installNewXPlugin();
  const wrapper = mount(
    {
      components: {
        BaseColumnPickerDropdown
      },
      data() {
        return { selectedColumn };
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

  const componentWrapper = wrapper.findComponent(BaseColumnPickerDropdown);
  const toggleWrapper = componentWrapper.find(getDataTestSelector('dropdown-toggle'));

  function toggleDropdown(): Promise<void> {
    componentWrapper.find(getDataTestSelector('dropdown-toggle')).trigger('click');
    return localVue.nextTick();
  }

  return {
    wrapper,
    componentWrapper,
    toggleWrapper,
    toggleDropdown,
    async setWrapperSelectedColumn(column: number): Promise<void> {
      await wrapper.setData({ selectedColumn: column });
      return localVue.nextTick();
    },
    async clickNthItem(nth: number): Promise<void> {
      await toggleDropdown();
      componentWrapper.findAll(getDataTestSelector('dropdown-item')).at(nth).trigger('click');
      return localVue.nextTick();
    }
  };
}

describe('testing BaseColumnPickerDropdown', () => {
  it('emits ColumnPickerSetColumnsNumber event with the column number on init', () => {
    const columns = [1, 3, 6];
    const index = 1;
    const value = columns[index];
    const { wrapper } = renderBaseColumnPickerDropdownComponent({
      columns,
      template: `<BaseColumnPickerDropdown :columns="columns" :value="${value}" />`
    });
    const listenerColumnPicker = jest.fn();
    wrapper.vm.$x.on('ColumnPickerSetColumnsNumber', true).subscribe(listenerColumnPicker);
    expect(listenerColumnPicker).toHaveBeenCalledTimes(1);
    expect(listenerColumnPicker).toHaveBeenNthCalledWith(1, {
      eventPayload: 3,
      metadata: {
        moduleName: null
      }
    });
  });

  it('sets value prop as initial selectedColumn', () => {
    const { toggleWrapper } = renderBaseColumnPickerDropdownComponent({
      selectedColumn: 4,
      columns: [2, 4, 6]
    });
    expect(toggleWrapper.text()).toBe('4');
  });

  it('sets first columns item as initial selectedColumn if no value is provided', () => {
    const { toggleWrapper } = renderBaseColumnPickerDropdownComponent({
      selectedColumn: undefined,
      columns: [2, 4, 6]
    });
    expect(toggleWrapper.text()).toBe('2');
  });

  // eslint-disable-next-line max-len
  it('sets selectedColumn and emits "UserClickedColumnPicker" X Event with the column as payload on value change', async () => {
    const { wrapper, toggleWrapper, setWrapperSelectedColumn } =
      renderBaseColumnPickerDropdownComponent({
        selectedColumn: undefined,
        columns: [2, 4, 6]
      });
    const listener = jest.fn();
    wrapper.vm.$x.on('UserClickedColumnPicker').subscribe(listener);
    expect(toggleWrapper.text()).toBe('2');
    await setWrapperSelectedColumn(4);
    expect(listener).toHaveBeenNthCalledWith(1, 4);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(toggleWrapper.text()).toBe('4');
  });

  // eslint-disable-next-line max-len
  it('sets selectedColumn and emits "input" event with the payload of "UserClickedColumnPicker" X Event received', async () => {
    const { wrapper, componentWrapper, toggleWrapper } = renderBaseColumnPickerDropdownComponent({
      selectedColumn: 2,
      columns: [2, 4, 6]
    });
    wrapper.vm.$x.emit('UserClickedColumnPicker', 4);
    await wrapper.vm.$nextTick();
    expect(componentWrapper.emitted('input')).toEqual([[4]]);
    expect(toggleWrapper.text()).toBe('4');
  });

  // eslint-disable-next-line max-len
  it('emits "UserClickedColumnPicker" when clicking a item dropdown, changing its own selectedColumn value', async () => {
    const { clickNthItem, toggleWrapper, wrapper } = renderBaseColumnPickerDropdownComponent({
      selectedColumn: 2,
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
            <BaseColumnPickerDropdown v-model="selectedColumn" :columns="columns">
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
      selectedColumn: 2,
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
            <BaseColumnPickerDropdown v-model="selectedColumn" :columns="columns">
              <template #item="{ item }">
                <span data-test="column-picker-dropdown-item">{{ item }}</span>
              </template>
            </BaseColumnPickerDropdown>
        `,
      selectedColumn: 2,
      columns: [2, 4, 6]
    });
    expect(toggleWrapper.text()).toBe('2');
  });
});

interface BaseColumnPickerDropdownRenderOptions {
  /** The number of columns to be rendered. */
  columns?: number[];
  /** The selected column value. */
  selectedColumn?: number | null;
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
  /** Toggles dropdown. */
  toggleDropdown: () => Promise<void>;
  /** Changes parent wrapper selected column to simulate v-model change. */
  setWrapperSelectedColumn: (column: number) => Promise<void>;
  /** Clicks nth item. */
  clickNthItem: (item: number) => Promise<void>;
}
