import { Facet } from '@empathy/search-types';

/**
 * Creates {@link @empathy/search-types#Facet | facets} stub.
 *
 * @returns Array of facets stub.
 *
 * @internal
 */
export function getFacetsStub(): Facet[] {
  return [
    {
      title: 'brand_facet',
      modelName: 'Results',
      filters: []
    }
  ];
}
