import { RelatedTag } from '@empathyco/x-types-old';
import { injectable } from 'inversify';
import { ResponseMapper } from '../../empathy-adapter.types';
import { EmpathyRelatedTag } from '../../models';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
@injectable()
export class EmpathyRelatedTagMapper implements ResponseMapper<EmpathyRelatedTag, RelatedTag> {
  map(rawRelatedTag: EmpathyRelatedTag, relatedTag: RelatedTag): RelatedTag {
    return Object.assign(relatedTag, {
      modelName: 'RelatedTag',
      tag: rawRelatedTag.tag,
      query: rawRelatedTag.query,
      previous: rawRelatedTag.query.replace(rawRelatedTag.tag, '').trim(),
      selected: false
    });
  }
}
