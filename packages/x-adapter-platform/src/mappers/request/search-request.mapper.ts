import { createMutableSchema, Schema, schemaMapperFactory } from '@empathyco/x-adapter-next';
import { SearchRequest } from '../../types/request.types';

const searchRequestSchema: Schema<SearchRequest, Record<string, unknown>> = {
  device: 'device',
  query: 'query',
  env: 'env',
  scope: 'scope',
  origin: 'origin',
  start: 'start',
  rows: 'rows',
  lang: 'lang',
  filter: ({ filters }) => {
    return Object.values(filters).reduce((mappedFilters: any[], filters: any[]) => {
      if (filters.length) {
        mappedFilters.push(...filters.map(f => f.id));
      }
      return mappedFilters;
    }, []);
  }
};

const searchRequestMutableSchema = createMutableSchema(searchRequestSchema);
export const searchRequestMapper = schemaMapperFactory<SearchRequest, Record<string, unknown>>(
  searchRequestMutableSchema
);
