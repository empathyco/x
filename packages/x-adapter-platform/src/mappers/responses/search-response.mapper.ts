import { schemaMapperFactory, combineMappers, MapperContext } from '@empathyco/x-adapter';
import { SearchResponse, HierarchicalFacet, HierarchicalFilter } from '@empathyco/x-types';
import { PlatformSearchResponse } from '../../types/responses/search-response.model';
import { searchResponseSchema } from '../../schemas/responses/search-response.schema';
import {
  AdapterHierarchicalFacet,
  AdapterHierarchicalFilter
} from '../../types/models/facet.model';

export const searchResponseMapper = combineMappers(
  schemaMapperFactory<PlatformSearchResponse, SearchResponse>(searchResponseSchema),
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
  { mappedValue }: MapperContext
): Partial<SearchResponse> {
  const facets = (mappedValue as SearchResponse).facets?.map(facet =>
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
  const filters = facet.filters.reduce((flattenedFilters, filter) => {
    return mapHierarchicalFilter(filter, flattenedFilters);
  }, [] as HierarchicalFilter[]);

  return {
    ...facet,
    filters
  };
}

/**
 * Map recursively the hierarchical facet filters.
 *
 * @param rawFilter - The hierarchical filter to map.
 * @param filters - The filters array to fill with the facet filters.
 * @returns The filter id.
 */
function mapHierarchicalFilter(
  rawFilter: AdapterHierarchicalFilter,
  filters: HierarchicalFilter[]
): HierarchicalFilter[] {
  const filter: HierarchicalFilter = {
    ...rawFilter,
    children: rawFilter.children?.map(rawFilterChild => {
      mapHierarchicalFilter(rawFilterChild, filters);
      return rawFilterChild.id;
    })
  };
  filters.push(filter);
  return filters;
}
