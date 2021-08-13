import { inject, injectable } from 'inversify';
import { Dictionary } from '../../../types';
import { EmpathyAdapterConfig } from '../../config/empathy-adapter-config.types';
import { DEPENDENCIES } from '../../container/container.const';
import { RequestMapper } from '../../empathy-adapter.types';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
@injectable()
export class EmpathyRequestParamsMapper implements RequestMapper<Dictionary<string>, Dictionary<string>> {

  constructor(
    @inject(DEPENDENCIES.config) private readonly config: EmpathyAdapterConfig
  ) {}

  map(_rawRequest: Dictionary<string>, request: Dictionary<string>): Dictionary<string> {
    return Object.assign(request, this.config.requestParams);
  }
}
