import {
  EditableNumberRangeFacet,
  EditableNumberRangeFilter,
  Facet,
  Filter,
  RangeValue,
  SimpleFilter
} from '@empathy/search-types';
import { deepMerge } from '@empathybroker/deep-merge';
import { Container } from 'inversify';
import { DeepPartial, Dictionary } from '../../../../types';
import { EmpathyAdapterConfig } from '../../../config/empathy-adapter-config.types';
import { DEFAULT_EMPATHY_ADAPTER_CONFIG } from '../../../config/empathy-adapter.config';
import { DEPENDENCIES } from '../../../container/container.const';
import { RequestMapperContext } from '../../../empathy-adapter.types';
import { EmpathyRequestFiltersSolrSyntaxMapper } from '../../../mappers/request/params/empathy-request-filters-solr-syntax.mapper';
import { EmpathyRequestFiltersMapper } from '../../../mappers/request/params/empathy-request-filters.mapper';

const container = new Container();
const emptyContext: RequestMapperContext = { url: 'url', requestOptions: {}, feature: '' };
let filtersMapper: EmpathyRequestFiltersMapper;
let config: EmpathyAdapterConfig;
container.bind(DEPENDENCIES.RequestMappers.Parameters.filters).to(EmpathyRequestFiltersMapper);
container.bind(DEPENDENCIES.RequestMappers.Parameters.filtersValue).to(EmpathyRequestFiltersSolrSyntaxMapper);

describe('EmpathyRequestFiltersSolrSyntaxMapper', () => {
  beforeEach(() => {
    container.snapshot();
    config = deepMerge({}, DEFAULT_EMPATHY_ADAPTER_CONFIG);
    container.bind(DEPENDENCIES.config).toConstantValue(config);
    filtersMapper = container.get(DEPENDENCIES.RequestMappers.Parameters.filters);
  });

  afterEach(() => {
    container.restore();
  });

  it('Composes filters with AND', () => {
    const facet = getMockedFacet('color');
    const filters: Dictionary<Filter[]> = {
      color: [
        getMockedSimpleFilter('blue', facet, { value: '{!tag=color}color:blue' }),
        getMockedSimpleFilter('red', facet, { value: '{!tag=color}color:red' })
      ]
    };

    const mappedFilters = filtersMapper.map(filters, [], emptyContext);

    expect(mappedFilters).toHaveLength(2);
    expect(mappedFilters).toEqual([
      '{!tag=color}color:blue',
      '{!tag=color}color:red'
    ]);
  });

  describe('Reads custom template of EditableNumberRange facets', () => {
    beforeEach(() => {
      config.mappings.facets.named = {
        price: deepMerge({}, config.mappings.facets.default, {
          template: '{!tag:price}price:[<min> to <max>]'
        })
      };
    });

    it('Replaces template with min and max values', () => {
      const filters: Dictionary<EditableNumberRangeFilter[]> = getMockedEditableNumberRangeFilters('price', { min: 10, max: 20 });
      expect(filtersMapper.map(filters, [], emptyContext)).toEqual(['{!tag:price}price:[10 to 20]']);
    });

    it('Replaces min null with * in the template', () => {
      const filters: Dictionary<EditableNumberRangeFilter[]> = getMockedEditableNumberRangeFilters('price', { min: null, max: 20 });
      expect(filtersMapper.map(filters, [], emptyContext)).toEqual(['{!tag:price}price:[* to 20]']);
    });

    it('Replaces max null with * in the template', () => {
      const filters: Dictionary<EditableNumberRangeFilter[]> = getMockedEditableNumberRangeFilters('price', { min: 40, max: null });
      expect(filtersMapper.map(filters, [], emptyContext)).toEqual(['{!tag:price}price:[40 to *]']);
    });
  });

  function getMockedFacet(name: string): Facet {
    return {
      id: name,
      modelName: 'SimpleFacet',
      label: name,
      filters: []
    };
  }

  function getMockedSimpleFilter(name: string, facet: Facet, partial?: DeepPartial<SimpleFilter>): SimpleFilter {
    const filter: SimpleFilter = deepMerge({
      selected: true,
      facetId: facet.id,
      callbackInfo: {},
      modelName: 'SimpleFilter',
      count: 10,
      id: name,
      label: name,
      value: name
    }, partial);
    facet.filters.push(filter);
    return filter;
  }

  function getMockedEditableNumberRangeFacet(name: string): EditableNumberRangeFacet {
    return {
      id: name,
      modelName: 'EditableNumberRangeFacet',
      label: name,
      filters: []
    };
  }

  function getMockedEditableNumberRangeFilters(title: string, { max, min }: RangeValue) {
    return {
      [title]: [
        getMockedEditableNumberRangeFilter(
          title, getMockedEditableNumberRangeFacet(title),
          { range: { max, min } }
        )
      ]
    };
  };

  function getMockedEditableNumberRangeFilter(
      name: string,
      facet: EditableNumberRangeFacet,
      customFilter?: DeepPartial<EditableNumberRangeFilter>
  ): EditableNumberRangeFilter {
    const sourceFilter: EditableNumberRangeFilter = {
      facetId: facet.id,
      callbackInfo: {},
      modelName: 'EditableNumberRangeFilter',
      id: name,
      label: name,
      range: {
        min: 0,
        max: 10
      }
    };

    const filter: EditableNumberRangeFilter = deepMerge(sourceFilter, customFilter);

    facet.filters.push(filter);
    return filter;
  }

});
