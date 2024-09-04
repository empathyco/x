import { mount } from '@vue/test-utils';
import { nextTick, ref } from 'vue';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import {
  createSimpleFilter,
  getSimpleFilterStub
} from '../../../../../__stubs__/filters-stubs.factory';
import { installNewXPlugin } from '../../../../../__tests__/utils';
import RenderlessFilter from '../renderless-filter.vue';
import { XPlugin } from '../../../../../plugins/x-plugin';
import { facetsXModule } from '../../../x-module';

function render({
  filter = ref(createSimpleFilter('category', 'food')),
  clickEvents = {},
  template = `
    <RenderlessFilter
      :filter="filter"
      :clickEvents="clickEvents"
      v-slot="{ filter, clickFilter, cssClasses, isDisabled }">
        <button
          @click="clickFilter"
          :class="cssClasses"
          :disabled="isDisabled"
          data-test="custom-label"
        >
          {{ filter.label }}
        </button>
    </RenderlessFilter>`
} = {}) {
  const wrapper = mount(
    {
      components: { RenderlessFilter },
      template
    },
    {
      props: { filter, clickEvents },
      global: {
        plugins: [installNewXPlugin()]
      }
    }
  );

  XPlugin.registerXModule(facetsXModule);

  const renderlessFilterButton = wrapper.find('[data-test="custom-label"]');

  return {
    rootWrapper: wrapper,
    wrapper: wrapper.findComponent(RenderlessFilter),
    renderlessFilterButton,
    emitSpy: jest.spyOn(XPlugin.bus, 'emit'),
    filter,
    clickFilter: async () => await renderlessFilterButton.trigger('click'),
    selectFilter: async () => {
      filter.value.selected = true;
      await nextTick();
    }
  };
}

describe('testing Renderless Filter component', () => {
  it('is an XComponent that belongs to the facets', () => {
    const { wrapper } = render();

    expect(isXComponent(wrapper.vm)).toBeTruthy();
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('facets');
  });

  it('emits UserClickedAFilter and other custom events when clicked', async () => {
    const filter = ref(getSimpleFilterStub());
    const { renderlessFilterButton, emitSpy } = render({
      filter,
      clickEvents: { UserClickedASimpleFilter: filter.value }
    });
    const metadata = {
      moduleName: 'facets',
      location: 'none',
      replaceable: true
    };

    await renderlessFilterButton.trigger('click');

    expect(emitSpy).toHaveBeenCalledTimes(2);
    expect(emitSpy).toHaveBeenCalledWith('UserClickedAFilter', filter, metadata);
    expect(emitSpy).toHaveBeenCalledWith('UserClickedASimpleFilter', filter.value, metadata);
  });

  it('allows customizing the rendered content with an slot', () => {
    const { renderlessFilterButton, rootWrapper, filter } = render();
    //console.log(rootWrapper);
    console.log(renderlessFilterButton.html());
    //expect(rootWrapper.text()).toEqual(filter.value.label);
    //expect(renderlessFilterButton.text()).toEqual(filter.value.label);
  });

  // it('adds selected classes to the rendered element when the filter is selected', async () => {
  //   const { wrapper, selectFilter } = render();
  //
  //   expect(wrapper.classes()).not.toContain('x-selected');
  //
  //   await selectFilter();
  //
  //   expect(wrapper.classes()).toContain('x-selected');
  // });

  // it('disables the filter when it has no results', async () => {
  //   const filter = ref(createSimpleFilter('category', 'men', false));
  //   const { wrapper } = render({ filter });
  //
  //   expect(wrapper.attributes('disabled')).toBeUndefined();
  //
  //   filter.value.totalResults = 0;
  //   await nextTick();
  //
  //   expect(wrapper.attributes('disabled')).toEqual('disabled');
  // });
});
