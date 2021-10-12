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
    const [leftRts, rightRts] = this.splitRelatedTagsByQueryPosition(relatedTags, query);
    return `${leftRts} ${query} ${rightRts}`.trim();
  }

  splitRelatedTagsByQueryPosition(array: RelatedTag[], query: string): string[] {
    return array
      .reduce(
        ([left, right], rt) => {
          return rt.query.indexOf(query) > rt.query.indexOf(rt.tag)
            ? [`${left} ${rt.tag}`, right]
            : [left, `${right} ${rt.tag}`];
        },
        ['', '']
      )
      .map((rts) => rts.trim());
  }
}
