import { Suggestion } from '../suggestion.model';

/**
 * @public
 * Jest schema for validating Suggestion entities
 */
export const SuggestionSchema: Suggestion = {
  modelName: expect.any(String),
  facets: expect.any(Array),
  term: expect.any(String),
  html: expect.any(String),
  key: expect.any(String)
};
