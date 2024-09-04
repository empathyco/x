import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { createNumberRangeFilter } from '../../../../../__stubs__/filters-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import NumberRangeFilter from '../number-range-filter.vue';
import { XPlugin } from '../../../../../plugins/index';
import { facetsXModule } from '../../../x-module';
import { XDummyBus } from '../../../../../__tests__/bus.dummy';

const metadata = {
  moduleName: 'facets',
  location: 'none',
  replaceable: true
};

let bus = new XDummyBus();
function render({
  template = '<NumberRangeFilter :filter="filter" :clickEvents="clickEvents" />',
  filter = createNumberRangeFilter('price', { min: 0, max: 20 }),
  clickEvents = {}
} = {}) {
  const wrapper = mount(
    {
      components: { NumberRangeFilter },
      props: ['filter', 'clickEvents'],
      template
    },
    {
      props: {
        filter,
        clickEvents
      },
      global: {
        plugins: [installNewXPlugin({ initialXModules: [facetsXModule] }, bus)]
      }
    }
  );

  const filterWrapper = wrapper.findComponent(NumberRangeFilter);

  return {
    wrapper: filterWrapper,
    emitSpy: jest.spyOn(XPlugin.bus, 'emit'),
    filter,
    clickFilter: () => wrapper.trigger('click'),
    selectFilter: () => {
      filter.selected = true;
      return nextTick();
    }
  };
}

describe('testing NumberRangeFilter component', () => {
  beforeEach(() => {
    bus = new XDummyBus();
  });
  it('is an XComponent that belongs to the facets', () => {
    const { wrapper } = render();

    expect(isXComponent(wrapper.vm)).toBeTruthy();
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('facets');
  });

  it('renders the provided filter by default', () => {
    const { wrapper, filter } = render();

    expect(wrapper.text()).toEqual(filter.label);
  });

  it('emits `UserClickedAFilter` & `UserClickedANumberRangeFilter` events when clicked', async () => {
    const { clickFilter, emitSpy, filter } = render();

    await clickFilter();

    expect(emitSpy).toHaveBeenCalledTimes(2);
    ['UserClickedAFilter', 'UserClickedANumberRangeFilter'].forEach(event => {
      expect(emitSpy).toHaveBeenCalledWith(event, filter, metadata);
    });
  });

  it('emits configured events when clicked', async () => {
    const { clickFilter, emitSpy, filter } = render({
      clickEvents: { UserAcceptedAQuery: 'potato' }
    });

    await clickFilter();

    expect(emitSpy).toHaveBeenCalledTimes(3);
    ['UserClickedAFilter', 'UserClickedANumberRangeFilter'].forEach(event => {
      expect(emitSpy).toHaveBeenCalledWith(event, filter, metadata);
    });
    expect(emitSpy).toHaveBeenNthCalledWith(3, 'UserAcceptedAQuery', 'potato', metadata);
  });

  it('allows customizing the rendered content with an slot', () => {
    const { wrapper, filter } = render({
      template: `
        <NumberRangeFilter :filter="filter" :clickEvents="clickEvents" v-slot="{ filter }">
          <span data-test="custom-label">{{ filter.label }}</span>
        </NumberRangeFilter>`
    });

    const customLabel = wrapper.find(getDataTestSelector('custom-label'));
    expect(customLabel.text()).toEqual(filter.label);
  });

  it('adds selected classes to the rendered element when the filter is selected', async () => {
    const { wrapper, selectFilter } = render();

    expect(wrapper.classes()).not.toContain('x-selected');
    expect(wrapper.classes()).not.toContain('x-number-range-filter--is-selected');

    await selectFilter();
    await nextTick();

    expect(wrapper.classes()).toContain('x-selected');
    expect(wrapper.classes()).toContain('x-number-range-filter--is-selected');
  });
});
