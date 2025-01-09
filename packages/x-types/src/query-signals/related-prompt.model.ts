import { NamedModel } from '../named-model.model';

/**
 * Represents a related prompt.
 *
 * @public
 */
export interface RelatedPrompt extends NamedModel<'RelatedPrompt'> {
  /** The next queries related to the prompt. */
  nextQueries: string[];
  /** The prompt. */
  suggestionText: string;
  /** The type of the prompt. */
  type: string;
}
