import { Identifiable } from './identifiable.model';
import { NamedModel } from './named-model.model';
import { Taggable } from './tagging.model';

/**
 * A promoted is an image with a title, that when clicked redirect the user to an URL.
 * Often it is represented taking up the same space than a normal result.
 *
 * @public
 */
export interface Promoted extends NamedModel<'Promoted'>, Identifiable, Taggable {
  /** Promoted title. */
  title: string;
  /** URL to redirect. */
  url: string;
  /** Promoted image. */
  image: string;
  /** Promoted position inside the grid. */
  position?: number;
}
