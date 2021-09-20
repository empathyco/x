import { NamedModel } from '../named-model.model';
import { Previewable } from '../previewable.model';

/**
 * A related tag is just a term that refines the current query.
 *
 * @public
 */
export interface RelatedTag extends NamedModel<'RelatedTag'>, Previewable {
  /** The term to add to the current query. */
  tag: string;
  /** If selection mode is enabled, tells if this related tag is selected or not. */
  selected: boolean;
  /** The query to refine. */
  previous: string;
}
