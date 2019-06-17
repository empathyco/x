import { Filter, RelatedTag } from '@empathy/search-types';
import { injectable, multiInject } from 'inversify';
import { SearchRequest } from '../../../types';
import { Dictionary } from '../../../utils/utils.types';
import { DEPENDENCIES } from '../../container/container.const';
import { MapRequest, RequestMapper, RequestMapperContext } from '../../empathy-adapter.types';
import { EmpathySearchRequest } from '../../models';
import { pipeMappers } from '../pipe-mappers';

@injectable()
export class EmpathySearchRequestMapper implements RequestMapper<SearchRequest, EmpathySearchRequest> {
  private readonly mapFilters: MapRequest<Dictionary<Filter[]>, string[]>;
  private readonly mapQuery: MapRequest<string, string>;

  constructor(
    @multiInject(DEPENDENCIES.RequestMappers.Parameters.query) queryMapper: RequestMapper<string, string>[],
    @multiInject(DEPENDENCIES.RequestMappers.Parameters.filters) filtersMapper: RequestMapper<Dictionary<Filter[]>, string[]>[]
  ) {
    this.mapQuery = pipeMappers(...queryMapper);
    this.mapFilters = pipeMappers(...filtersMapper);
  }

  map({ query, relatedTags = [], filters = {}, ...rest }: SearchRequest, request: EmpathySearchRequest,
    context: RequestMapperContext): EmpathySearchRequest {
    return Object.assign<EmpathySearchRequest, Partial<EmpathySearchRequest>>(request, {
        ...rest,
        q: this.mapQuery(query, this.applyRelatedTags(query, relatedTags), context),
        filter: this.mapFilters(filters, [], context)
      }
    );
  }

  private applyRelatedTags(query: string, relatedTags: RelatedTag[]): string {
    const relatedTagsValue = relatedTags.map(tag => tag.tag).join(' ');
    return `${ query } ${ relatedTagsValue }`.trim();
  }
}
