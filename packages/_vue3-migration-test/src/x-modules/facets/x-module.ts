import { Facet } from '@empathyco/x-types';
import { createSimpleFacetStub } from '../../../../x-components/src/__stubs__/facets-stubs.factory';
import { PrivateXModuleOptions } from '../../../../x-components/src/plugins/x-plugin.types';
import { arrayToObject } from '../../../../x-components/src/utils/array';
import { FacetsXModule } from '../../../../x-components/src/x-modules/facets/x-module';

const facets: Record<Facet['id'], Facet> = {
  gender: createSimpleFacetStub('gender', createFilter => [
    createFilter('Men', false),
    createFilter('Women', false)
  ]),
  brand: createSimpleFacetStub('brand', createFilter => [
    createFilter('Audi', true),
    createFilter('BMW', false)
  ]),
  color: createSimpleFacetStub('color', createFilter => [
    createFilter('red', true),
    createFilter('blue', false)
  ]),
  category: createSimpleFacetStub('category', createFilter =>
    ['dress', 'floral', 'skirt', 'print', 'midi', 'fitted', 'short', 'long'].map((query, index) =>
      createFilter(query, false, index)
    )
  )
};
const filters = arrayToObject(
  Object.values(facets).flatMap(facet => facet.filters),
  'id'
);

export const facetsXModule: PrivateXModuleOptions<FacetsXModule> = {
  storeModule: {
    state: {
      facets,
      filters
    }
  }
};
