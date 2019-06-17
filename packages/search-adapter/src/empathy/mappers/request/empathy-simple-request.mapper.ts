import { injectable } from 'inversify';
import { Dictionary } from '../../../utils/utils.types';
import { RequestMapper } from '../../empathy-adapter.types';

@injectable()
export class EmpathySimpleRequestMapper implements RequestMapper<Dictionary<string>, Dictionary<string>> {
  map(rawRequest: Dictionary<string>, request: Dictionary<string>): Dictionary<string> {
    return Object.assign(request, rawRequest);
  }
}
