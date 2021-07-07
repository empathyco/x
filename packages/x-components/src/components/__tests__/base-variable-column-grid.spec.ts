import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getSearchResponseStub } from '../../__stubs__/search-response-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../__tests__/utils';
import { GridItem } from '../../utils/types';
import BaseVariableColumnGrid from '../base-variable-column-grid.vue';

const searchResponse = getSearchResponseStub();
const itemsStub = [
  ...searchResponse.banners,
  ...searchResponse.promoteds,
  ...searchResponse.results
];

function renderComponent({ items = itemsStub }: RenderOptions): RenderAPI {
  const [, localVue] = installNewXPlugin();
  const wrapper = mount(BaseVariableColumnGrid, {
    components: {
      BaseVariableColumnGrid
    },
    props: ['items'],
    propsData: {
      items
    },
    localVue,
    scopedSlots: {
      default: '<span data-test="default-slot" slot-scope="{ item }">{{ item.id }}</span>',
      Result: '<span data-test="result-slot" slot-scope="{ item }">{{ item.name }}</span>'
    }
  });

  const gridWrapper = wrapper.findComponent(BaseVariableColumnGrid);

  return {
    gridWrapper,
    hasColumns(columns: number): boolean {
      return gridWrapper.classes().includes(`x-base-grid--cols-${columns}`);
    },
    isScopedSlotOverridden(selector): boolean {
      return gridWrapper.find(getDataTestSelector(selector)).exists();
    }
  };
}

describe('testing BaseVariableColumnGrid component', () => {
  it('renders the columns number emitted by the ColumnPickerSetColumnsNumber event', async () => {
    const newColumns = 4;
    const { gridWrapper, hasColumns } = renderComponent({});
    gridWrapper.vm.$x.emit('ColumnPickerSetColumnsNumber', newColumns);

    expect(hasColumns(newColumns)).toBe(false);
    await gridWrapper.vm.$nextTick();
    expect(hasColumns(newColumns)).toBe(true);
  });

  it('renders the columns number emitted by the UserClickedColumnPicker event', async () => {
    const newColumns = 2;
    const { gridWrapper, hasColumns } = renderComponent({});
    gridWrapper.vm.$x.emit('UserClickedColumnPicker', newColumns);

    expect(hasColumns(newColumns)).toBe(false);
    await gridWrapper.vm.$nextTick();
    expect(hasColumns(newColumns)).toBe(true);
  });

  it('renders custom content for the available scoped slots', () => {
    const { isScopedSlotOverridden } = renderComponent({});

    expect(isScopedSlotOverridden('default-slot')).toBe(true);
    expect(isScopedSlotOverridden('result-slot')).toBe(true);
  });
});

interface RenderOptions {
  /** The array of items to render in the grid. */
  items?: GridItem[];
}

interface RenderAPI {
  /** The grid's wrapper. */
  gridWrapper: Wrapper<Vue>;
  /** Checks if the grid has a certain number of columns. */
  hasColumns: (columns: number) => boolean;
  /** Check if a scoped slot is overridden. */
  isScopedSlotOverridden: (selector: string) => boolean;
}
