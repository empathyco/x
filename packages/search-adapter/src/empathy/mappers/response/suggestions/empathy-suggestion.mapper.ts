import { Suggestion } from '@empathyco/x-types';
import { injectable } from 'inversify';
import { ResponseMapper, ResponseMapperContext } from '../../../empathy-adapter.types';
import { EmpathySuggestion } from '../../../models';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
@injectable()
export class EmpathySuggestionMapper implements ResponseMapper<EmpathySuggestion, Suggestion> {

  map({ title_raw }: EmpathySuggestion, suggestion: Suggestion, context: ResponseMapperContext): Suggestion {
    return Object.assign<Suggestion, Partial<Suggestion>>(suggestion, {
      modelName: context.rawRequest.query ? 'QuerySuggestion' : 'PopularSearch',
      query: title_raw,
      key: title_raw
    });
  }
}
