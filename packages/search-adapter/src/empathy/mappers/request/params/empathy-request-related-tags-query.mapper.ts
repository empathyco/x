import { RelatedTag } from '@empathyco/x-types';
import { injectable } from 'inversify';
import { QueryableRequest } from '../../../../types';
import { RequestMapper } from '../../../empathy-adapter.types';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
@injectable()
export class EmpathyRequestRelatedTagsQueryMapper
  implements RequestMapper<QueryableRequest, string>
{
  map({ relatedTags = [] }: QueryableRequest, query: string): string {
    const [leftRelatedTags, rightRelatedTags] = this.splitRelatedTagsByQueryPosition(relatedTags);
    return `${leftRelatedTags} ${query} ${rightRelatedTags}`.trim();
  }

  splitRelatedTagsByQueryPosition(relatedTags: RelatedTag[]): string[] {
    return relatedTags
      .reduce(
        ([left, right], { tag, query }) => {
          return query.startsWith(tag)
            ? [`${left} ${tag}`, right]
            : [left, `${right} ${tag}`];
        },
        ['', '']
      )
      .map(sortedRelatedTags => sortedRelatedTags.trim());
  }
}
