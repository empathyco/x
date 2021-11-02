import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getSearchResponseStub } from '../../__stubs__/search-response-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../__tests__/utils';
import { ListItem } from '../../utils/types';
import BaseVariableColumnGrid from '../base-variable-column-grid.vue';

const searchResponse = getSearchResponseStub();
const itemsStub = [
  ...searchResponse.banners,
  ...searchResponse.promoteds,
  ...searchResponse.results
];

function renderComponent({ items = itemsStub }: RenderOptions = {}): RenderAPI {
  const [, localVue] = installNewXPlugin();
  function mountComponent(): Wrapper<Vue> {
    return mount(BaseVariableColumnGrid, {
      props: ['items'],
      propsData: {
        items
      },
      localVue,
      scopedSlots: {
        default: '<span data-test="default-slot" slot-scope="{ item }">{{ item.id }}</span>',
        result: '<span data-test="result-slot" slot-scope="{ item }">{{ item.name }}</span>'
      }
    });
  }

  const wrapper = mountComponent();

  return {
    wrapper: wrapper,
    mountComponent,
    hasColumns(columns: number): boolean {
      return wrapper.classes(`x-grid--cols-${columns}`);
    },
    isScopedSlotOverridden(selector): boolean {
      return wrapper.find(getDataTestSelector(selector)).exists();
    }
  };
}

describe('testing BaseVariableColumnGrid component', () => {
  it('renders the columns number emitted by the ColumnsNumberProvided event', async () => {
    const newColumns = 4;
    const { wrapper, hasColumns } = renderComponent();

    expect(hasColumns(newColumns)).toBe(false);

    wrapper.vm.$x.emit('ColumnsNumberProvided', newColumns);
    await wrapper.vm.$nextTick();
    expect(hasColumns(newColumns)).toBe(true);
  });

  it('renders custom content for the available scoped slots', () => {
    const { isScopedSlotOverridden } = renderComponent();

    expect(isScopedSlotOverridden('default-slot')).toBe(true);
    expect(isScopedSlotOverridden('result-slot')).toBe(true);
  });

  it('re-renders custom content for the available scoped slots', async () => {
    const { wrapper, hasColumns, mountComponent } = renderComponent();
    wrapper.vm.$x.emit('ColumnsNumberProvided', 6);

    await wrapper.vm.$nextTick();
    expect(hasColumns(6)).toBe(true);

    const wrapper2 = mountComponent();
    expect(wrapper2.classes('x-grid--cols-6')).toBe(true);
  });
});

interface RenderOptions {
  /** The array of items to render in the grid. */
  items?: ListItem[];
}

interface RenderAPI {
  /** The grid's wrapper. */
  wrapper: Wrapper<Vue>;
  /** Mounts the grid component. */
  mountComponent: () => Wrapper<Vue>;
  /** Checks if the grid has a certain number of columns. */
  hasColumns: (columns: number) => boolean;
  /** Check if a scoped slot is overridden. */
  isScopedSlotOverridden: (selector: string) => boolean;
}
