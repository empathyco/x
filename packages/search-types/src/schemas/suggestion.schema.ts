import { Suggestion } from '../suggestion.model';

/**
 * Jest schema for validating Suggestion entities.
 *
 * @public
 */
export const SuggestionSchema: Suggestion = {
  modelName: expect.any(String),
  facets: expect.any(Array),
  key: expect.any(String),
  query: expect.any(String)
};
