import { Suggestion } from '../../suggestion.model';

export const SuggestionSchema: Suggestion = {
  modelName: expect.any(String),
  facets: expect.any(Array),
  term: expect.any(String),
  html: expect.any(String),
  key: expect.any(String)
};
