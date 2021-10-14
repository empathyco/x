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
          return this.isTagBeforeQuery(tag, query)
            ? [`${left} ${tag}`, right]
            : [left, `${right} ${tag}`];
        },
        ['', '']
      )
      .map(sortedRelatedTags => sortedRelatedTags.trim());
  }

  // Checks if the query is after the tag.
  isTagBeforeQuery(tag: string, query: string): boolean {
    return query.indexOf(tag) === 0;
  }
}
