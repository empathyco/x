import { Facet, FacetModelName, Filter, MultiSelect, SimpleFacet, SimpleFilter } from '@empathy/search-types';
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
    color: [getMockedSimpleFilter('blue', facet), getMockedSimpleFilter('red', facet)]
  };

  const mappedFilters = filtersMapper.map(filters, [], emptyContext);

  expect(mappedFilters).toHaveLength(2);
  expect(mappedFilters).toEqual([
    '{!tag=color}color:blue',
    '{!tag=color}color:red'
  ]);
});

it('Composes filters with OR on frontend', () => {
  config.mappings.facets.default.multiSelectable = MultiSelect.OnFrontend;
  const facet = getMockedFacet('color');
  const filters: Dictionary<Filter[]> = {
    color: [getMockedSimpleFilter('blue', facet), getMockedSimpleFilter('red', facet)]
  };

  const mappedFilters = filtersMapper.map(filters, [], emptyContext);

  expect(mappedFilters).toHaveLength(1);
  expect(mappedFilters).toEqual(['{!tag=color}color:(blue OR red)']);
});

it('Removes the no-tag when you don\'t want to show unselected values', () => {
  config.mappings.facets.default.showUnselectedValues = false;
  const facet = getMockedFacet('category');
  const filters: Dictionary<Filter[]> = {
    category: [getMockedSimpleFilter('man', facet)]
  };

  const mappedFilters = filtersMapper.map(filters, [], emptyContext);

  expect(mappedFilters).toEqual([
    'category:man'
  ]);
});

it('Reads custom configurations of facets', () => {
  config.mappings.facets.named = {
    size: deepMerge({}, config.mappings.facets.default, {
      prefix: {
        facetId: 'size-facet-id',
        noTagFacetId: 'size-no-tag-facet-id'
      }
    })
  };
  const colorFacet = getMockedFacet('color');
  const sizeFacet = getMockedFacet('size');
  const filters: Dictionary<Filter[]> = {
    color: [getMockedSimpleFilter('blue', colorFacet)],
    size: [getMockedSimpleFilter('small', sizeFacet)]
  };

  const mappedFilters = filtersMapper.map(filters, [], emptyContext);

  expect(mappedFilters).toEqual(['{!tag=color}color:blue', '{!tag=size-no-tag-facet-id}size-facet-id:small']);
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
