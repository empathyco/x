import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { getSearchResponseStub } from '../../__stubs__/search-response-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../__tests__/utils';
import BaseVariableColumnGrid from '../base-variable-column-grid.vue';
import { XPlugin } from '../../plugins/x-plugin';
import { XDummyBus } from '../../__tests__/bus.dummy';

const searchResponse = getSearchResponseStub();
const itemsStub = [
  ...searchResponse.banners!,
  ...searchResponse.promoteds!,
  ...searchResponse.results
];

const sharedBus = new XDummyBus();

function renderComponent({ items = itemsStub } = {}) {
  function mountComponent() {
    return mount(BaseVariableColumnGrid, {
      global: { plugins: [installNewXPlugin({}, sharedBus)] },
      props: {
        items
      },
      slots: {
        default: '<span data-test="default-slot" slot-scope="{ item }">{{ item.id }}</span>',
        result: '<span data-test="result-slot" slot-scope="{ item }">{{ item.name }}</span>'
      }
    });
  }

  const wrapper = mountComponent();

  return {
    wrapper: wrapper,
    mountComponent,
    hasColumns: (columns: number) => wrapper.classes(`x-base-grid--cols-${columns}`),
    isScopedSlotOverridden: (selector: string) =>
      wrapper.find(getDataTestSelector(selector)).exists()
  };
}

describe('testing BaseVariableColumnGrid component', () => {
  it('renders the columns number emitted by the ColumnsNumberProvided event', async () => {
    const newColumns = 4;
    const { hasColumns } = renderComponent();

    expect(hasColumns(newColumns)).toBe(false);

    XPlugin.bus.emit('ColumnsNumberProvided', newColumns);
    await nextTick();
    expect(hasColumns(newColumns)).toBe(true);
  });

  it('renders custom content for the available scoped slots', () => {
    const { isScopedSlotOverridden } = renderComponent();

    expect(isScopedSlotOverridden('default-slot')).toBe(true);
    expect(isScopedSlotOverridden('result-slot')).toBe(true);
  });

  it('re-renders custom content for the available scoped slots', async () => {
    const { hasColumns, mountComponent } = renderComponent();
    XPlugin.bus.emit('ColumnsNumberProvided', 6);

    await nextTick();
    expect(hasColumns(6)).toBe(true);

    const wrapper2 = mountComponent();

    await nextTick();

    expect(wrapper2.classes('x-base-grid--cols-6')).toBe(true);
  });
});
