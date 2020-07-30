import { Suggestion } from '../suggestion.model';

/**
 * @public
 * Jest schema for validating Suggestion entities
 */
export const SuggestionSchema: Suggestion = {
  modelName: expect.any(String),
  facets: expect.any(Array),
  key: expect.any(String),
  query: expect.any(String)
};
