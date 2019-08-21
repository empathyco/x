import { injectable } from 'inversify';
import { Dictionary } from '../../../types';
import { RequestMapper } from '../../empathy-adapter.types';

@injectable()
export class EmpathySimpleRequestMapper implements RequestMapper<Dictionary<string>, Dictionary<string>> {
  map(rawRequest: Dictionary<string>, request: Dictionary<string>): Dictionary<string> {
    return Object.assign(request, rawRequest);
  }
}
