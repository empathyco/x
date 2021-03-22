import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import BaseColumnPickerList from '../base-column-picker-list.vue';
import { BaseEventButton } from '../../index';

function renderBaseColumnPickerListComponent({
  columns,
  customItemSlot = `
    <template #default="{ column }">
      <p data-test="column-slot">{{ column }}</p>
    </template>`,
  template = `
   <BaseColumnPickerList :columns="columns">
      ${customItemSlot ?? ''}
   </BaseColumnPickerList>`
}: BaseColumnPickerListRenderOptions = {}): BaseColumnPickerListComponentAPI {
  const [, localVue] = installNewXPlugin();
  const columnPickerListWrapper = mount(
    {
      components: {
        BaseColumnPickerList
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
  const wrapper = columnPickerListWrapper.findComponent(BaseColumnPickerList);

  return {
    wrapper,
    async clickEventButton(index: number) {
      const eventButtons = wrapper.findAll(getDataTestSelector('column-picker-button'));
      await eventButtons.at(index).trigger('click');
    }
  };
}

describe('testing Base Column Picker List', () => {
  const columns = [1, 3, 6];

  it('emits UserClickedColumnPicker event with the column number as payload', async () => {
    const index = 1;
    const { wrapper, clickEventButton } = renderBaseColumnPickerListComponent({ columns });
    const listenerColumnPicker = jest.fn();
    wrapper.vm.$x.on('UserClickedColumnPicker', true).subscribe(listenerColumnPicker);
    expect(listenerColumnPicker).toHaveBeenCalledTimes(0);
    await clickEventButton(index);
    expect(listenerColumnPicker).toHaveBeenCalledTimes(1);
    expect(listenerColumnPicker).toHaveBeenNthCalledWith(1, {
      eventPayload: columns[index],
      metadata: {
        moduleName: null, // no module registered for this base component
        target: wrapper.findAllComponents(BaseEventButton).at(index).element
      }
    });
  });

  it('emits an `input` event with the selected column if it has changed.', async () => {
    const index = 1;
    const { wrapper, clickEventButton } = renderBaseColumnPickerListComponent({ columns });
    const listenerColumnPicker = jest.fn();
    wrapper.vm.$x.on('UserClickedColumnPicker', true).subscribe(listenerColumnPicker);
    expect(listenerColumnPicker).toHaveBeenCalledTimes(0);
    await clickEventButton(index);
    expect(wrapper.emitted('input')).toEqual([[columns[index]]]);
    expect(listenerColumnPicker).toHaveBeenCalledTimes(1);
  });

  it('allows configuring the number of columns and updates the css class accordingly', () => {
    const { wrapper } = renderBaseColumnPickerListComponent({ columns });
    const columnPickerListWrapper = wrapper.findAll(getDataTestSelector('column-picker-item'));
    columns.forEach((column, index) => {
      expect(columnPickerListWrapper.at(index).classes()).toContain(
        `x-column-picker-list__item--${column}-cols`
      );
    });
  });

  it('allows customizing slots', () => {
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
});

interface BaseColumnPickerListRenderOptions {
  /** The number of columns to be rendered. */
  columns?: number[];
  /** The custom element to be rendered. */
  customItemSlot?: string;
  /** The template to be rendered. */
  template?: string;
}

interface BaseColumnPickerListComponentAPI {
  /** The wrapper of the container element.*/
  wrapper: Wrapper<Vue>;
  /** Clicks the event button and waits for the view to update. */
  clickEventButton: (index: number) => Promise<void>;
}
