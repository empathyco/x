import { CallbackInfo } from './callback-info.model';
import { Identifiable } from './identifiable.model';
import { NamedModel } from './named-model.model';
import { Tagging } from './tagging.model';

/**
 * A promoted is an image with a title, that when clicked redirect the user to an URL.
 * Often it is represented taking up the same space than a normal result.
 *
 * @public
 */
export interface Promoted extends NamedModel, CallbackInfo, Identifiable {
  /** Promoted title. */
  title: string;
  /** URL to redirect. */
  url: string;
  /** Promoted image. */
  image: string;
  /** Promoted tagging. */
  tagging: {
    /** {@link Tagging | Click tagging}. */
    click: Tagging;
  };
}
