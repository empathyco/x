import { Filter } from '@empathy/search-types';
import { injectable, multiInject } from 'inversify';
import { Dictionary, QueryableRequest, SearchRequest } from '../../../types';
import { DEPENDENCIES } from '../../container/container.const';
import { MapRequest, RequestMapper, RequestMapperContext } from '../../empathy-adapter.types';
import { EmpathySearchRequest } from '../../models';
import { pipeMappers } from '../pipe-mappers';

@injectable()
export class EmpathySearchRequestMapper implements RequestMapper<SearchRequest, EmpathySearchRequest> {
  private readonly mapQuery: MapRequest<QueryableRequest, string>;
  private readonly mapFilters: MapRequest<Dictionary<Filter[]>, string[]>;

  constructor(
    @multiInject(DEPENDENCIES.RequestMappers.Parameters.query) queryMapper: RequestMapper<QueryableRequest, string>[],
    @multiInject(DEPENDENCIES.RequestMappers.Parameters.filters) filtersMapper: RequestMapper<Dictionary<Filter[]>, string[]>[]
  ) {
    this.mapQuery = pipeMappers(...queryMapper);
    this.mapFilters = pipeMappers(...filtersMapper);
  }

  map({ query, relatedTags = [], filters = {}, ...rest }: SearchRequest, request: EmpathySearchRequest,
    context: RequestMapperContext): EmpathySearchRequest {
    return Object.assign<EmpathySearchRequest, Partial<EmpathySearchRequest>>(request, {
        ...rest,
        q: query && this.mapQuery({ query, relatedTags }, query, context),
        filter: this.mapFilters(filters, [], context)
      }
    );
  }
}
