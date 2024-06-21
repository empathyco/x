import { mount } from '@vue/test-utils';
import { nextTick, ref } from 'vue';
import { createSimpleFilter } from '../../../../../__stubs__/filters-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import SimpleFilter from '../simple-filter.vue';
import { XPlugin } from '../../../../../plugins/index';

const metadata = {
  moduleName: 'facets',
  location: 'none',
  replaceable: true
};

function render({
  template = '<SimpleFilter :filter="filter" :clickEvents="clickEvents" />',
  filter = ref(createSimpleFilter('category', 'women')),
  clickEvents = {}
} = {}) {
  installNewXPlugin();

  const wrapper = mount(
    {
      components: { SimpleFilter },
      props: ['filter', 'clickEvents'],
      template
    },
    {
      propsData: { filter, clickEvents }
    }
  );

  const filterWrapper = wrapper.findComponent(SimpleFilter);

  return {
    wrapper: filterWrapper,
    emitSpy: jest.spyOn(XPlugin.bus, 'emit'),
    filter,
    clickFilter: () => wrapper.trigger('click'),
    selectFilter: () => {
      filter.value.selected = true;
      return nextTick();
    }
  };
}

describe('testing SimpleFilter component', () => {
  it('is an XComponent that belongs to the facets', () => {
    const { wrapper } = render();

    expect(isXComponent(wrapper.vm)).toBeTruthy();
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('facets');
  });

  it('renders the provided filter by default', () => {
    const { wrapper, filter } = render();

    expect(wrapper.text()).toEqual(filter.value.label);
  });

  it('emits `UserClickedAFilter` & `UserClickedASimpleFilter` events when clicked', async () => {
    const { clickFilter, emitSpy, filter } = render();

    await clickFilter();

    expect(emitSpy).toHaveBeenCalledTimes(2);
    ['UserClickedAFilter', 'UserClickedASimpleFilter'].forEach(event => {
      expect(emitSpy).toHaveBeenCalledWith(event, filter.value, metadata);
    });
  });

  it('emits configured events when clicked', async () => {
    const { clickFilter, emitSpy, filter } = render({
      clickEvents: { UserAcceptedAQuery: 'potato' }
    });

    await clickFilter();

    expect(emitSpy).toHaveBeenCalledTimes(3);
    ['UserClickedAFilter', 'UserClickedASimpleFilter'].forEach(event => {
      expect(emitSpy).toHaveBeenCalledWith(event, filter.value, metadata);
    });
    expect(emitSpy).toHaveBeenNthCalledWith(3, 'UserAcceptedAQuery', 'potato', metadata);
  });

  it('allows customizing the default button content', () => {
    const { wrapper, filter } = render({
      template: `
      <SimpleFilter :filter="filter" :clickEvents="clickEvents">
        <template #label="{ filter }">
          <span data-test="custom-label">{{ filter.label }}</span>
        </template>
      </SimpleFilter>`
    });

    const customLabel = wrapper.find(getDataTestSelector('custom-label'));
    expect(customLabel.text()).toEqual(filter.value.label);
  });

  it('allows replacing the root element of the component', () => {
    const { wrapper, emitSpy, filter } = render({
      template: `
      <SimpleFilter :filter="filter" :clickEvents="clickEvents" v-slot="{ filter, clickFilter }">
        <label data-test="label">
          <input data-test="input"
            type="checkbox"
            @change="clickFilter"
          />
          {{ filter.label }}
        </label>
      </SimpleFilter>`
    });
    const labelWrapper = wrapper.get(getDataTestSelector('label'));
    const inputWrapper = wrapper.get(getDataTestSelector('input'));

    expect(labelWrapper.text()).toEqual(filter.value.label);

    inputWrapper.trigger('change');
    expect(emitSpy).toHaveBeenCalledTimes(2);
    ['UserClickedAFilter', 'UserClickedASimpleFilter'].forEach(event => {
      expect(emitSpy).toHaveBeenCalledWith(event, filter.value, metadata);
    });
  });

  it('exposes proper css classes and attributes in the default slot', async () => {
    const { wrapper, selectFilter, filter } = render({
      template: `
      <SimpleFilter
        :filter="filter"
        :clickEvents="clickEvents"
        v-slot="{ filter, clickFilter, isDisabled, cssClasses }"
      >
        <button data-test="button"
          :class="cssClasses"
          :disabled="isDisabled"
          :aria-checked="filter.selected.toString()">
          {{ filter.label }}
        </button>
      </SimpleFilter>`
    });
    const buttonWrapper = wrapper.get(getDataTestSelector('button'));

    expect(buttonWrapper.classes()).toHaveLength(2);
    expect(buttonWrapper.classes()).toEqual(
      expect.arrayContaining(['x-facet-filter', 'x-simple-filter'])
    );
    expect(buttonWrapper.attributes()).toHaveProperty('aria-checked', 'false');
    expect(buttonWrapper.element).toHaveProperty('disabled', false);

    await selectFilter();
    expect(buttonWrapper.attributes('aria-checked')).toBe('true');
    expect(buttonWrapper.classes()).toHaveLength(4);
    expect(buttonWrapper.classes()).toEqual(
      expect.arrayContaining([
        'x-facet-filter',
        'x-simple-filter',
        'x-selected',
        'x-simple-filter--is-selected'
      ])
    );

    filter.value.totalResults = 0;
    await nextTick();
    expect(buttonWrapper.element).toHaveProperty('disabled', true);

    filter.value.totalResults = undefined;
    await nextTick();
    expect(buttonWrapper.element).toHaveProperty('disabled', false);
  });

  it('adds selected classes to the rendered element when the filter is selected', async () => {
    const { wrapper, selectFilter } = render();

    expect(wrapper.classes()).not.toContain('x-selected');
    expect(wrapper.classes()).not.toContain('x-simple-filter--is-selected');

    await selectFilter();

    expect(wrapper.classes()).toContain('x-selected');
    expect(wrapper.classes()).toContain('x-simple-filter--is-selected');
  });
});
