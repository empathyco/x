import { Facet } from '@empathyco/x-types';
import { createSimpleFacetStub } from '../../../../x-components/src/__stubs__/facets-stubs.factory';
import { arrayToObject } from '../../../../x-components/src/utils/array';
import {
  facetsXModule,
  FacetsXModule
} from '../../../../x-components/src/x-modules/facets/x-module';

const facets: Record<Facet['id'], Facet> = {
  gender: createSimpleFacetStub('gender', createFilter => [
    createFilter('Men', false),
    createFilter('Women', true)
  ]),
  brand: createSimpleFacetStub('brand', createFilter => [
    createFilter('Audi', true),
    createFilter('BMW', false)
  ]),
  color: createSimpleFacetStub('color', createFilter => [
    createFilter('red', true),
    createFilter('blue', false)
  ])
};
const filters = arrayToObject(
  Object.values(facets).flatMap(facet => facet.filters),
  'id'
);

export const testFacetsXModule: FacetsXModule = {
  ...facetsXModule,
  storeModule: {
    ...facetsXModule.storeModule,
    state: () => ({
      ...facetsXModule.storeModule.state(),
      facets,
      filters
    })
  }
};
