import { Identifiable } from '../identifiable.model';
import { NamedModel } from '../named-model.model';
import { RelatedPrompt } from './related-prompt.model';

/**
 * A group of next queries.
 *
 * @public
 */
export interface RelatedPrompts extends NamedModel<'RelatedPrompts'>, Identifiable {
  /** Array of next queries available inside the group. */
  relatedPrompts: RelatedPrompt[];
}
