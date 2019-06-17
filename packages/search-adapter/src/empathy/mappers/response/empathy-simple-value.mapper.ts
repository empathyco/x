import { injectable } from 'inversify';
import { ResponseMapper } from '../../empathy-adapter.types';

@injectable()
export class EmpathySimpleValueMapper<From> implements ResponseMapper<From, From> {
  map(rawValue: From): From {
    return rawValue;
  }
}
