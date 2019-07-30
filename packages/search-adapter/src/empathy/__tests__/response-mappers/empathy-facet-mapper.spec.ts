import { Facet, Filter } from '@empathy/search-types';
import { FacetSchema, FilterSchema } from '@empathy/search-types/schemas';
import { deepMerge } from '@empathybroker/deep-merge';
import { Container } from 'inversify';
import { FilterableRequest } from '../../../types';
import { deepFacet, deepFacetWithNoSelectedProperty } from '../../__fixtures__/responses/single-facet.response';
import { EmpathyAdapterBuilder } from '../../builder/empathy-adapter.builder';
import { DEPENDENCIES } from '../../container/container.const';
import { MapFn, ResponseMapper, ResponseMapperContext } from '../../empathy-adapter.types';
import { pipeMappers } from '../../mappers/pipe-mappers';
import { EmpathyFacet } from '../../models';

const emptyContext: ResponseMapperContext = { feature: '', url: '', requestOptions: {}, rawRequest: {}, request: {}, rawResponse: {} };
const container = new Container();
new EmpathyAdapterBuilder(container).build();
let mapFacet: MapFn<EmpathyFacet, Facet>;

beforeEach(() => {
  const facetMappers = container.getAll<ResponseMapper<EmpathyFacet, Facet>>(DEPENDENCIES.ResponseMappers.facets);
  mapFacet = pipeMappers(...facetMappers);
  container.snapshot();
});

afterEach(() => {
  container.restore();
});

it('Empathy facets mapping', () => {
  const mappedFacet = mapFacet(deepFacet as any, {} as Facet, emptyContext);

  expect(mappedFacet).toMatchObject(FacetSchema);
  expect(mappedFacet.title).toEqual(deepFacet.facet);
  expect(mappedFacet.filters.length).toEqual(deepFacet.values.length);
  expect(mappedFacet.filters[1].children[0].children[0]).toBeDefined();
  expectAllFiltersToBeValid(mappedFacet.filters);
});

it('maps a filters previous selection state', () => {
  const filterId = 'hierarchical_category:"juegos_de_manualidades\\/construye"';
  const context = createContextWithFilterSelected(filterId);

  const mappedFacet = mapFacet(deepFacet as any, {} as Facet, context);
  const targetFilter = findFilterById(mappedFacet.filters, filterId);

  expectFacetToMatchMock(mappedFacet, deepFacet);
  expectAllFiltersToBeValid(mappedFacet.filters);
  expectFilterAncestorsToBeSelected(targetFilter);
});

it('maps filters correctly if the response does not have the selected property', () => {
  const filterId = 'hierarchical_category:"juegos_de_manualidades\\/construye\\/construye-hija"';
  const context = createContextWithFilterSelected(filterId);

  const mappedFacet = mapFacet(deepFacetWithNoSelectedProperty as any, {} as Facet, context);
  const targetFilter = findFilterById(mappedFacet.filters, filterId);

  expectFacetToMatchMock(mappedFacet, deepFacetWithNoSelectedProperty);
  expectAllFiltersToBeValid(mappedFacet.filters);
  expectFilterAncestorsToBeSelected(targetFilter);
  expect(mappedFacet.filters[1].children[0].children[0]).toBeDefined();
});

it('maps filters selected property to false by default', () => {
  const mappedFacet = mapFacet(deepFacetWithNoSelectedProperty as any, {} as Facet, emptyContext);

  expectFacetToMatchMock(mappedFacet, deepFacetWithNoSelectedProperty);
  expectAllFiltersToBeValid(mappedFacet.filters);
  expectAllFiltersToHaveSelectedPropertyTo(mappedFacet.filters, false);
});

function createContextWithFilterSelected(filterId: string): FilterableRequest {
  return deepMerge({}, emptyContext, {
    rawRequest: {
      filters: {
        hierarchical_category: [{ id: filterId, selected: true } as Filter]
      }
    } as FilterableRequest
  });
}

function expectAllFiltersToBeValid(filters: Filter[]): void {
  return filters.forEach(filter => {
    expect(filter).toMatchObject(FilterSchema);
    expectAllFiltersToBeValid(filter.children);
  });
}

function findFilterById(filters: Filter[], id: string): Filter {
  const searchFn = (target: Filter | null, filter: Filter): Filter | null => target || filter.id === id
    ? filter
    : filter.children.reduce(searchFn, null);
  const foundFilter = filters.reduce(searchFn, null);
  if (!foundFilter) {
    throw new Error(`Filter with id ${ id } couldn't be found`);
  }
  return foundFilter;
}

function expectAllFiltersToHaveSelectedPropertyTo(filters: Filter[], selected: boolean): void {
  filters.forEach(filter => {
    expect(filter.selected).toEqual(selected);
    expectAllFiltersToHaveSelectedPropertyTo(filter.children, selected);
  });
}

function expectFilterAncestorsToBeSelected(filter: Filter) {
  expect(filter.selected).toEqual(true);
  if (filter.parent) {
    expectFilterAncestorsToBeSelected(filter.parent);
  }
}

function expectFacetToMatchMock(facet: Facet, rawFacet: EmpathyFacet) {
  expect(facet).toMatchObject(FacetSchema);
  expect(facet.title).toEqual(rawFacet.facet);
  expect(facet.filters.length).toEqual(rawFacet.values.length);
}
