import { Suggestion } from '../suggestion.model';

/**
 * Jest schema for validating Suggestion entities.
 *
 * @public
 */
export const SuggestionSchema: Suggestion = {
  modelName: expect.any(String),
  key: expect.any(String),
  query: expect.any(String)
};
