import { injectable, multiInject } from 'inversify';
import { Dictionary, QueryableRequest } from '../../../types';
import { DEPENDENCIES } from '../../container/container.const';
import { MapRequest, RequestMapper, RequestMapperContext } from '../../empathy-adapter.types';
import { pipeMappers } from '../pipe-mappers';

@injectable()
export class EmpathyQueryableRequestMapper implements RequestMapper<QueryableRequest & Dictionary<string>, Dictionary<string>> {
  private readonly mapQuery: MapRequest<QueryableRequest, string>;

  constructor(@multiInject(DEPENDENCIES.RequestMappers.Parameters.query) queryMapper: RequestMapper<QueryableRequest, string>[]) {
    this.mapQuery = pipeMappers(...queryMapper);
  }

  map({ query, relatedTags = [], ...rest }: QueryableRequest & Dictionary<string>, request: Dictionary<string>,
    context: RequestMapperContext): Dictionary<string> {
    return Object.assign(request, {
      ...rest,
      q: query && this.mapQuery({ query, relatedTags }, query, context)
    });
  }
}
