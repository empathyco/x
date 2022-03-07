import { NamedModel } from '../named-model.model';
import { Previewable } from '../previewable.model';

/**
 * A related tag is just a term that refines the current query.
 *
 * @public
 */
export interface RelatedTag extends NamedModel<'RelatedTag'>, Previewable {
  /** If it's a curated related tag. */
  isCurated?: boolean;
  /** The term to add to the current query. */
  tag: string;
}
