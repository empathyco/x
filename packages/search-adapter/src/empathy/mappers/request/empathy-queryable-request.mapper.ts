import { inject, injectable } from 'inversify';
import { Dictionary } from '../../../utils/utils.types';
import { DEPENDENCIES } from '../../container/container.const';
import { RequestMapper, RequestMapperContext } from '../../empathy-adapter.types';

@injectable()
export class EmpathyQueryableRequestMapper implements RequestMapper<Dictionary<string>, Dictionary<string>> {

  constructor(
    @inject(DEPENDENCIES.RequestMappers.Parameters.query) private readonly queryMapper: RequestMapper<string, string>
  ) {}

  map({ query, ...rest }: Dictionary<string>, request: Dictionary<string>, context: RequestMapperContext): Dictionary<string> {
    return Object.assign(request, {
      ...rest,
      q: query && this.queryMapper.map(query, query, context)
    });
  }
}
