import { createMutableSchema, Schema, schemaMapperFactory } from '@empathyco/x-adapter-next';
import { reduce } from '@empathyco/x-utils';
import { Filter, isHierarchicalFilter } from '@empathyco/x-types';
import { PlatformSearchRequest, SearchRequest } from '../../types/request.types';

export const searchRequestSchema: Schema<SearchRequest, PlatformSearchRequest> = {
  device: 'device',
  query: 'query',
  env: 'env',
  scope: 'scope',
  origin: 'origin',
  start: 'start',
  rows: 'rows',
  lang: 'lang',
  filter: mapFilters
};

export const searchRequestMutableSchema = createMutableSchema(searchRequestSchema);
export const searchRequestMapper = schemaMapperFactory<SearchRequest, PlatformSearchRequest>(
  searchRequestMutableSchema
);

/**
 * Converts the filters to the shape the Platform's API is expecting.
 *
 * @param filters - The filters from our internal request.
 *
 * @returns The filters ready for the API.
 */
function mapFilters({ filters }: SearchRequest): string[] {
  return reduce(
    filters,
    (accumulator: string[], _, filters: Filter[]) => {
      if (Array.isArray(filters)) {
        accumulator.push(
          ...filters
            .filter(
              filter =>
                !isHierarchicalFilter(filter) ||
                !filters.some(f => isHierarchicalFilter(f) && f.parentId === filter.id)
            )
            .map(filter => filter.id.toString())
        );
      }
      return accumulator;
    },
    []
  );
}
