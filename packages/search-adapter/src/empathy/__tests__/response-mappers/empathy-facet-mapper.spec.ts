import {
  BooleanFilter,
  Facet,
  Filter,
  HierarchicalFacet,
  HierarchicalFilter,
  NumberRangeFacet,
  NumberRangeFilter,
  SimpleFacet,
  SimpleFilter
} from '@empathyco/x-types-old';
import {
  HierarchicalFilterSchema,
  NumberRangeFacetSchema, NumberRangeFilterSchema,
  SimpleFacetSchema, SimpleFilterSchema
} from '@empathyco/x-types-old/schemas';
import { Container } from 'inversify';
import {
  dynamicNumberRangeRawFacet,
  hierarchicalRawFacet, hierarchicalRawFacetWithoutSelected, noDynamicNumberRangeRawFacet, simpleRawFacet
} from '../../__fixtures__/responses/single-facet.response';
import { EmpathyAdapterBuilder } from '../../builder/empathy-adapter.builder';
import { DEPENDENCIES } from '../../container/container.const';
import { MapFn, ResponseMapper, ResponseMapperContext } from '../../empathy-adapter.types';
import { pipeMappers } from '../../mappers/pipe-mappers';
import { EmpathyFacet } from '../../models';

const emptyContext: ResponseMapperContext = { feature: '', url: '', requestOptions: {}, rawRequest: {}, request: {}, rawResponse: {} };
const container = new Container();
new EmpathyAdapterBuilder(container)
  .setFacetConfig({ modelName: 'HierarchicalFacet' }, 'hierarchical_category')
  .setFacetConfig({ isDynamic: true, modelName: 'NumberRangeFacet' }, 'price_facet')
  .setFacetConfig({ isDynamic: false, modelName: 'NumberRangeFacet' }, 'rating_facet')
  .build();
let mapFacet: MapFn<EmpathyFacet, Facet>;

beforeEach(() => {
  const facetMappers = container.getAll<ResponseMapper<EmpathyFacet, Facet>>(DEPENDENCIES.ResponseMappers.facets);
  mapFacet = pipeMappers(...facetMappers);
  container.snapshot();
});

afterEach(() => {
  container.restore();
});

describe('Empathy Hierarchical Facet', () => {
  it('maps a hierarchical facet', () => {
    const mappedFacet = mapFacet(hierarchicalRawFacet, {} as HierarchicalFacet, emptyContext) as HierarchicalFacet;

    expectAllFiltersToBeValid(mappedFacet.filters, HierarchicalFilterSchema);
    expectFacetToMatchMock(mappedFacet, hierarchicalRawFacet.facet, hierarchicalRawFacet.values.length);
    // tslint:disable-next-line:no-non-null-assertion
    expect(mappedFacet.filters[1].children![0].children![0]).toBeDefined();
    expectBooleanFiltersToHaveSelectedPropertyTo(mappedFacet.filters, false);
  });

  it('maps filters correctly if the selected property is not defined', () => {
    const mappedFacet = mapFacet(hierarchicalRawFacetWithoutSelected, {} as HierarchicalFacet, emptyContext) as HierarchicalFacet;

    expectFacetToMatchMock(mappedFacet, hierarchicalRawFacetWithoutSelected.facet, hierarchicalRawFacetWithoutSelected.values.length);
    expectAllFiltersToBeValid(mappedFacet.filters, HierarchicalFilterSchema);
    // tslint:disable-next-line:no-non-null-assertion
    expect(mappedFacet.filters[1].children![1].children![0]).toBeDefined();
    expectBooleanFiltersToHaveSelectedPropertyTo(mappedFacet.filters, false);
  });
});

describe('Empathy Simple Facet', () => {
  it('maps a simple facet', () => {
    const mappedFacet = mapFacet(simpleRawFacet, {} as SimpleFacet, emptyContext) as SimpleFacet;

    expect(mappedFacet).toMatchObject(SimpleFacetSchema);
    expectFacetToMatchMock(mappedFacet, simpleRawFacet.facet, simpleRawFacet.values.length);
    expectAllFiltersToBeValid(mappedFacet.filters, SimpleFilterSchema);
    expectBooleanFiltersToHaveSelectedPropertyTo(mappedFacet.filters, false);
  });
});

describe('Empathy Number Range Facet', () => {
  it('maps a number range facet with dynamic values', () => {
    const mappedFacet = mapFacet(dynamicNumberRangeRawFacet, {} as NumberRangeFacet, emptyContext) as NumberRangeFacet;

    expect(mappedFacet).toMatchObject(NumberRangeFacetSchema);
    expectFacetToMatchMock(mappedFacet, dynamicNumberRangeRawFacet.facet, 1);
    expectAllFiltersToBeValid(mappedFacet.filters, NumberRangeFilterSchema);
    expectBooleanFiltersToHaveSelectedPropertyTo(mappedFacet.filters, false);
  });

  it('maps a number range facet without dynamic values', () => {
    const mappedFacet = mapFacet(noDynamicNumberRangeRawFacet, {} as NumberRangeFacet, emptyContext) as NumberRangeFacet;

    expect(mappedFacet).toMatchObject(NumberRangeFacetSchema);
    expectFacetToMatchMock(mappedFacet, noDynamicNumberRangeRawFacet.facet, mappedFacet.filters.length);
    expectAllFiltersToBeValid(mappedFacet.filters, NumberRangeFilterSchema);
    expectBooleanFiltersToHaveSelectedPropertyTo(mappedFacet.filters, false);
  });
});

function expectFacetToMatchMock(mappedFacet: HierarchicalFacet | SimpleFacet | NumberRangeFacet, mockFacetId: string,
  mockFiltersLength: number): void {
  expect(mappedFacet.id).toEqual(mockFacetId);
  expect(mappedFacet.label).toEqual(mockFacetId);
  expect(mappedFacet.filters.length).toEqual(mockFiltersLength);
}

function expectBooleanFiltersToHaveSelectedPropertyTo(filters: BooleanFilter[], selected: boolean | null): void {
  filters.forEach(filter => {
    expect(filter.selected).toEqual(selected);
    if (isHierarchicalFilter(filter) && !!filter.children) {
      expectBooleanFiltersToHaveSelectedPropertyTo(filter.children, selected);
    }
  });
}

function expectAllFiltersToBeValid(filters: Filter[], schema: HierarchicalFilter | SimpleFilter | NumberRangeFilter): void {
  return filters.forEach(filter => {
    expect(filter).toMatchObject(schema);
    if (isHierarchicalFilter(filter) && filter.children) {
      expectAllFiltersToBeValid(filter.children, HierarchicalFilterSchema);
    }
  });
}

function isHierarchicalFilter(filter: Filter): filter is HierarchicalFilter {
  return filter.modelName === 'HierarchicalFilter';
}
