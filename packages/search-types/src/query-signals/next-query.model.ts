import { NamedModel } from '../named-model.model';
import { Previewable } from '../previewable.model';

/**
 * @public
 * A next query is a suggestion of a new query that the user may be interested after searching for an specific term
 */
export interface NextQuery extends NamedModel, Required<Previewable> {}
