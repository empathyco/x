import { RelatedTag } from '@empathyco/x-types';
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
      curated: rawRelatedTag.source && rawRelatedTag.source === 'CURATED',
      modelName: 'RelatedTag',
      tag: rawRelatedTag.tag,
      query: rawRelatedTag.query,
      position: rawRelatedTag.position,
      previous: rawRelatedTag.query.replace(rawRelatedTag.tag, '').trim(),
      selected: false
    });
  }
}
