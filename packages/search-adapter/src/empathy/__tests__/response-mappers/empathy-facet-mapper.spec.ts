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
  const context = deepMerge({}, emptyContext, {
    rawRequest: {
      filters: {
        hierarchical_category: [
          { id: filterId, selected: true } as Filter
        ]
      }
    } as FilterableRequest
  });

  const mappedFacet = mapFacet(deepFacet as any, {} as Facet, context);
  const targetFilter = findFiltersDeep(mappedFacet.filters, filter => filterId === filter.id);

  if (targetFilter) {
    expect(targetFilter.selected).toEqual(true);
  } else {
    fail(`Filter with id ${ filterId } couldn't be found`);
  }
});

it('maps filters correctly if the response does not have the selected property', () => {
  const filterId = 'hierarchical_category:"juegos_de_manualidades\\/construye"';
  const context = deepMerge({}, emptyContext, {
    rawRequest: {
      filters: {
        hierarchical_category: [
          { id: filterId, selected: true } as Filter
        ]
      }
    } as FilterableRequest
  });

  const mappedFacet = mapFacet(deepFacetWithNoSelectedProperty as any, {} as Facet, context);
  const targetFilter = findFiltersDeep(mappedFacet.filters, filter => filterId === filter.id);

  expect(mappedFacet).toMatchObject(FacetSchema);
  expect(mappedFacet.title).toEqual(deepFacetWithNoSelectedProperty.facet);
  expect(mappedFacet.filters.length).toEqual(deepFacetWithNoSelectedProperty.values.length);
  expect(mappedFacet.filters[1].children[0].children[0]).toBeDefined();
  expectAllFiltersToBeValid(mappedFacet.filters);
  if (targetFilter) {
    expect(targetFilter.selected).toEqual(true);
  } else {
    fail(`Filter with id ${ filterId } couldn't be found`);
  }
});

it('maps filters selected property to false by default', () => {
  const mappedFacet = mapFacet(deepFacetWithNoSelectedProperty as any, {} as Facet, emptyContext);

  expect(mappedFacet).toMatchObject(FacetSchema);
  expect(mappedFacet.title).toEqual(deepFacetWithNoSelectedProperty.facet);
  expect(mappedFacet.filters.length).toEqual(deepFacetWithNoSelectedProperty.values.length);
  expect(mappedFacet.filters[1].children[0].children[0]).toBeDefined();
  expectAllFiltersToBeValid(mappedFacet.filters);
  expectAllFiltersToHaveSelectedPropertyTo(mappedFacet.filters, false);
});

function expectAllFiltersToBeValid(filters: Filter[]): void {
  return filters.forEach(filter => {
    expect(filter).toMatchObject(FilterSchema);
    expectAllFiltersToBeValid(filter.children);
  });
}

function findFiltersDeep(filters: Filter[], predicate: (filter: Filter) => boolean): Filter | undefined {
  let foundFilter: Filter | undefined;
  filters.some(filter => {
    if (predicate(filter)) {
      foundFilter = filter;
    } else {
      foundFilter = findFiltersDeep(filter.children, predicate);
    }
    return !!foundFilter;
  });
  return foundFilter;
}

function expectAllFiltersToHaveSelectedPropertyTo(filters: Filter[], selected: boolean): void {
  filters.forEach(filter => {
    expect(filter.selected).toEqual(selected);
    expectAllFiltersToHaveSelectedPropertyTo(filter.children, selected);
  });
}
