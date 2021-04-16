import { Filter, Sort } from '@empathy/search-types';
import { injectable, multiInject } from 'inversify';
import { Dictionary, QueryableRequest, SearchRequest } from '../../../types';
import { DEPENDENCIES } from '../../container/container.const';
import { MapRequest, RequestMapper, RequestMapperContext } from '../../empathy-adapter.types';
import { EmpathySearchRequest } from '../../models';
import { pipeMappers } from '../pipe-mappers';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
@injectable()
export class EmpathySearchRequestMapper implements RequestMapper<SearchRequest, EmpathySearchRequest> {
  private readonly mapFilters: MapRequest<Dictionary<Filter[]>, string[]>;
  private readonly mapQuery: MapRequest<QueryableRequest, string>;
  private readonly mapSort: MapRequest<Sort | undefined, string | undefined>;

  constructor(
    @multiInject(DEPENDENCIES.RequestMappers.Parameters.query) queryMapper: RequestMapper<QueryableRequest, string>[],
    @multiInject(DEPENDENCIES.RequestMappers.Parameters.filters) filtersMapper: RequestMapper<Dictionary<Filter[]>, string[]>[],
    @multiInject(DEPENDENCIES.RequestMappers.Parameters.sort) sortMappers: RequestMapper<Sort | undefined, string | undefined>[]
  ) {
    this.mapQuery = pipeMappers(...queryMapper);
    this.mapFilters = pipeMappers(...filtersMapper);
    this.mapSort = pipeMappers(...sortMappers);
  }

  map({ query, relatedTags = [], filters = {}, sort, ...rest }: SearchRequest, request: EmpathySearchRequest,
    context: RequestMapperContext): EmpathySearchRequest {
    return Object.assign<EmpathySearchRequest, Partial<EmpathySearchRequest>>(request, {
        ...rest,
        q: query && this.mapQuery({ query, relatedTags }, query, context),
        filter: this.mapFilters(filters, [], context),
        sort: this.mapSort(sort, '', context)
      }
    );
  }
}
