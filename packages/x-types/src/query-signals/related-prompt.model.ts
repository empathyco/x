import { NamedModel } from '../named-model.model';
import { Previewable } from '../previewable.model';

/**
 * A next query is a suggestion of a new query that the user may be interested after searching
 * for an specific term.
 *
 * @public
 */
export interface RelatedPrompt extends NamedModel<'RelatedPrompt'>, Required<Previewable> {
  nextQueries: Array<string>;
  suggestionText: string;
  type: string;
}
