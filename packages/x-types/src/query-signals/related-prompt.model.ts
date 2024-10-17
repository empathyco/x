import { NamedModel } from '../named-model.model';
import { Previewable } from '../previewable.model';

/**
 * Represents a related prompt.
 */
export interface RelatedPrompt extends NamedModel<'RelatedPrompt'>, Required<Previewable> {
  /** The next queries related to the prompt. */
  nextQueries: Array<string>;
  /** The prompt. */
  suggestionText: string;
  /** The type of the prompt. */
  type: string;
}
