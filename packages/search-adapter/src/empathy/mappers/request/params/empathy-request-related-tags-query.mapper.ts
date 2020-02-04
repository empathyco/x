import { injectable } from 'inversify';
import { QueryableRequest } from '../../../../types';
import { RequestMapper } from '../../../empathy-adapter.types';

@injectable()
export class EmpathyRequestRelatedTagsQueryMapper implements RequestMapper<QueryableRequest, string> {

  map({ relatedTags = [] }: QueryableRequest, query: string): string {
    return relatedTags.reduce((chain, rt) => `${chain} ${rt.tag}`, query).trim();
  }
}
