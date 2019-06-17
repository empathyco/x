import { Suggestion } from '@empathy/search-types';
import { injectable, multiInject } from 'inversify';
import { DEPENDENCIES } from '../../../container/container.const';
import { MapFn, ResponseMapper, ResponseMapperContext } from '../../../empathy-adapter.types';
import { EmpathySuggestion } from '../../../models';
import { pipeMappers } from '../../pipe-mappers';

@injectable()
export class EmpathySuggestionMapper implements ResponseMapper<EmpathySuggestion, Suggestion> {
  private readonly highlightWithQuery: MapFn<string, string>;

  constructor(
    @multiInject(DEPENDENCIES.ResponseMappers.Helpers.queryHighlighting) queryHighlightingMappers: ResponseMapper<string, string>[]
  ) {
    this.highlightWithQuery = pipeMappers(...queryHighlightingMappers);
  }

  map({ title_raw }: EmpathySuggestion, suggestion: Suggestion, context: ResponseMapperContext): Suggestion {
    if (!context.queryHighlightingClass) {
      context.queryHighlightingClass = 'ebx-suggestion__query';
    }
    return Object.assign<Suggestion, Partial<Suggestion>>(suggestion, {
      modelName: 'Suggestion',
      term: title_raw,
      html: this.highlightWithQuery(title_raw, title_raw, context),
      key: title_raw
    });
  }
}
