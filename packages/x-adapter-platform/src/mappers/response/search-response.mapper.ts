import { schemaMapperFactory, combineMappers, MapperContext } from '@empathyco/x-adapter-next';
import { SearchResponse, HierarchicalFilter, HierarchicalFacet } from '@empathyco/x-types';
import { PlatformSearchResponse } from '../../types/responses/search-response.model';
import { searchResponseMutableSchema } from '../../schemas/response/search-response.schema';
import {
  AdapterHierarchicalFacet,
  AdapterHierarchicalFilter
} from '../../types/responses/models/facet.model';

export const searchResponseMapper = combineMappers(
  schemaMapperFactory<PlatformSearchResponse, SearchResponse>(searchResponseMutableSchema),
  searchResponseFacetsMapper
);

/**
 * Mapper to flatten hierarchical facet filters.
 *
 * @param from - The Platform search response.
 * @param context - The context from the mapper.
 * @returns The mapped facets.
 */
export function searchResponseFacetsMapper(
  from: PlatformSearchResponse,
  { to }: MapperContext
): Partial<SearchResponse> {
  const facets = (to as SearchResponse).facets?.map(facet =>
    facet.modelName === 'HierarchicalFacet'
      ? flattenHierarchicalFacet(facet as AdapterHierarchicalFacet)
      : facet
  );
  return { facets };
}

/**
 * Returns a hierarchical facet with its filters flattened.
 *
 * @param facet - The hierarchical facet.
 * @returns The flattened hierarchical facet.
 */
function flattenHierarchicalFacet(facet: AdapterHierarchicalFacet): HierarchicalFacet {
  const filters: HierarchicalFilter[] = [];

  facet.filters.forEach(rawFilter => {
    mapHierarchicalFilter(
      rawFilter,
      {
        facetId: facet.id,
        parentId: null
      },
      filters
    );
  });

  return {
    ...facet,
    filters
  };
}

/**
 * Map recursively the hierarchical facet filters.
 *
 * @param rawFilter - The hierarchical filter to map.
 * @param initialValues - The initial values for the filter.
 * @param filters - The filters array to fill with the facet filters.
 * @returns The filter id.
 */
function mapHierarchicalFilter(
  rawFilter: AdapterHierarchicalFilter,
  initialValues: Readonly<Partial<HierarchicalFilter>>,
  filters: HierarchicalFilter[]
): HierarchicalFilter['id'] {
  const filter = { ...rawFilter, ...initialValues } as HierarchicalFilter;
  filter.children = rawFilter.children?.filters?.map(rawFilterChild =>
    mapHierarchicalFilter(rawFilterChild, { ...initialValues, parentId: filter.id }, filters)
  );
  filters.push(filter);
  return filter.id;
}
