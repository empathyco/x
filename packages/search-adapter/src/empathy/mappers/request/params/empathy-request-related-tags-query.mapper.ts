import { injectable } from 'inversify';
import { QueryableRequest } from '../../../../types';
import { RequestMapper } from '../../../empathy-adapter.types';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
@injectable()
export class EmpathyRequestRelatedTagsQueryMapper implements RequestMapper<QueryableRequest, string>
{
  map({ relatedTags = [] }: QueryableRequest, query: string): string {
    return relatedTags.reduce(
      (partialQuery, { tag, query: relatedTagQuery }) =>
        relatedTagQuery.startsWith(tag)
          ? `${tag} ${partialQuery}`
          : `${partialQuery} ${tag}`,
      query
    )
    .trim();
  }
}
