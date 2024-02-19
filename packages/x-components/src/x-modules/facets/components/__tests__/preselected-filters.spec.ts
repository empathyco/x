import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import Vuex from 'vuex';
import { Dictionary } from '@empathyco/x-utils';
import { createRawFilters } from '../../../../utils/filters';
import { baseSnippetConfig } from '../../../../views/base-config';
import PreselectedFilters from '../preselected-filters.vue';

function renderPreselectedFilters({
  filters,
  snippetFilters
}: RenderPreselectedFiltersOptions = {}): RenderPreselectedFiltersAPI {
  const emit = jest.fn();
  const localVue = createLocalVue();
  const snippetConfig = Vue.observable({ ...baseSnippetConfig, filters: snippetFilters });
  localVue.use(Vuex);

  const wrapper = mount(PreselectedFilters, {
    provide: {
      snippetConfig: snippetConfig
    },
    propsData: {
      filters
    },
    localVue,
    mocks: {
      $x: {
        emit
      }
    }
  });

  function setSnippetConfig(newValue: Dictionary<unknown>): Promise<void> {
    Object.assign(snippetConfig, newValue);
    return localVue.nextTick();
  }

  return {
    wrapper,
    emit,
    setSnippetConfig
  };
}

describe('testing Preselected filters component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not emit the event when neither filters nor snippet config filters are provided', () => {
    const { emit } = renderPreselectedFilters();

    expect(emit).not.toHaveBeenCalled();
  });

  it('emits the event when filters are provided in the snippet config', () => {
    const snippetFilters = [
      '{!tag=brand_facet}brand_facet:"Lego"',
      '{!tag=age_facet}age_facet:"toddler"'
    ];
    const { emit } = renderPreselectedFilters({
      snippetFilters
    });

    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith(
      'PreselectedFiltersProvided',
      createRawFilters(snippetFilters)
    );
  });

  it('emits the event when filters are provided by the prop', () => {
    const filters = ['{!tag=brand_facet}brand_facet:"Lego"', '{!tag=age_facet}age_facet:"toddler"'];
    const { emit } = renderPreselectedFilters({
      filters
    });

    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith('PreselectedFiltersProvided', createRawFilters(filters));
  });

  it('emits the event using the snippet config filters as payload when both are provided', () => {
    const filters = ['{!tag=brand_facet}brand_facet:"Lego"', '{!tag=age_facet}age_facet:"toddler"'];
    const snippetFilters = [
      '{!tag=brand_facet}brand_facet:"Nintendo"',
      '{!tag=age_facet}age_facet:"kids"'
    ];
    const { emit } = renderPreselectedFilters({
      filters,
      snippetFilters
    });

    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith(
      'PreselectedFiltersProvided',
      createRawFilters(snippetFilters)
    );
  });

  it('emits the event when the prop filters change', async () => {
    const filters = ['{!tag=brand_facet}brand_facet:"Lego"'];
    const newFilters = ['{!tag=brand_facet}brand_facet:"Playmobil"'];

    const { emit, wrapper } = renderPreselectedFilters({
      filters
    });

    expect(wrapper.props()).toEqual({ filters: filters });
    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith('PreselectedFiltersProvided', createRawFilters(filters));

    await wrapper.setProps({ filters: newFilters });

    expect(wrapper.props()).toEqual({ filters: newFilters });
    expect(emit).toHaveBeenCalledTimes(2);
    expect(emit).toHaveBeenCalledWith('PreselectedFiltersProvided', createRawFilters(newFilters));
  });

  it('emits the event when the snippetConfig filters change', async () => {
    const filters = ['{!tag=brand_facet}brand_facet:"Chorizo"'];
    const newFilters = ['{!tag=brand_facet}brand_facet:"Chistorra"'];

    const { emit, wrapper, setSnippetConfig } = renderPreselectedFilters({
      filters
    });

    expect(wrapper.props()).toEqual({ filters: filters });
    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith('PreselectedFiltersProvided', createRawFilters(filters));

    await setSnippetConfig({ filters: newFilters });

    // Prop filters remains the same while the provided SnippetConfig is updated with new filters
    expect(wrapper.props()).toEqual({ filters: filters });
    expect(wrapper.vm.$options.provide).toEqual({
      snippetConfig: { ...baseSnippetConfig, filters: newFilters }
    });

    // The event is called again with the newFilters provided
    expect(emit).toHaveBeenCalledTimes(2);
    expect(emit).toHaveBeenCalledWith('PreselectedFiltersProvided', createRawFilters(newFilters));
  });
});

/**
 * Options to configure how the preselected filters component should be rendered.
 */
interface RenderPreselectedFiltersOptions {
  /** The preselected filters provided by the filters prop. */
  filters?: string[];
  /** The preselected filters provided by the snippet config. */
  snippetFilters?: string[];
}

/**
 * Tools to test how the preselected filters component behaves.
 */
interface RenderPreselectedFiltersAPI {
  /** Mock of the {@link XBus.emit} function. */
  emit: jest.Mock;
  /** The wrapper of the container element.*/
  wrapper: Wrapper<Vue>;
  /** Helper method to change the snippet config. */
  setSnippetConfig: (newSnippetConfig: Dictionary<unknown>) => void | Promise<void>;
}
