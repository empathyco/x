import { injectable } from 'inversify';
import { ResponseMapper } from '../../empathy-adapter.types';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
@injectable()
export class EmpathySimpleValueMapper<From> implements ResponseMapper<From, From> {
  map(rawValue: From): From {
    return rawValue;
  }
}
