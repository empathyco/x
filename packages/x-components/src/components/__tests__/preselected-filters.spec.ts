import { mount } from '@vue/test-utils';
import { createRawFilters } from '../../utils/filters';
import { baseSnippetConfig } from '../../views/base-config';
import PreselectedFilters from '../preselected-filters.vue';

function renderPreselectedFilters({
  filters,
  snippetFilters
}: RenderPreselectedFiltersOptions = {}): RenderPreselectedFiltersAPI {
  const emit = jest.fn();
  mount(PreselectedFilters, {
    provide: {
      snippetConfig: { ...baseSnippetConfig, filters: snippetFilters }
    },
    propsData: { filters },
    mocks: {
      $x: {
        emit
      }
    }
  });

  return {
    emit
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
}
