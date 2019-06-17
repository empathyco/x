import { RelatedTag } from '@empathy/search-types';
import { injectable } from 'inversify';
import { ResponseMapper } from '../../empathy-adapter.types';
import { EmpathyRelatedTag } from '../../models';

@injectable()
export class EmpathyRelatedTagMapper implements ResponseMapper<EmpathyRelatedTag, RelatedTag> {
  map(rawRelatedTag: EmpathyRelatedTag, relatedTag: RelatedTag): RelatedTag {
    return Object.assign(relatedTag, {
      tag: rawRelatedTag.tag,
      query: rawRelatedTag.query,
      previous: rawRelatedTag.query.replace(rawRelatedTag.tag, '').trim(),
      selected: false
    });
  }
}
