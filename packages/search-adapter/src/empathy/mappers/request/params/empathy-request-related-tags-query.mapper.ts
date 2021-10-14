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
    const [leftRelatedTags, rightRelatedTags] =
      this.splitRelatedTagsByQueryPosition(relatedTags, query);
    return `${leftRelatedTags} ${query} ${rightRelatedTags}`.trim();
  }

  splitRelatedTagsByQueryPosition(relatedTags: RelatedTag[], query: string): string[] {
    return relatedTags
      .reduce(
        ([left, right], relatedTag) => {
          const normalizedQuery = query.toLocaleLowerCase();
          return this.isQueryAfterTag(relatedTag, normalizedQuery)
            ? [`${left} ${relatedTag.tag}`, right]
            : [left, `${right} ${relatedTag.tag}`];
        },
        ['', '']
      )
      .map((sortedRelatedTags) => sortedRelatedTags.trim());
  }

  // Checks if the query is after the tag.
  isQueryAfterTag({ tag, query: relatedTagQuery }: RelatedTag, query: string): boolean {
    return relatedTagQuery.indexOf(query) > relatedTagQuery.indexOf(tag);
  }
}
