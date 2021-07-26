import { Identifiable } from './identifiable.model';
import { NamedModel } from './named-model.model';
import { Tagging } from './tagging.model';

/**
 * A banner is an image with a title, that when clicked redirect the user to an URL.
 * Often it is represented as a 100% wide element that appears on top of the results inside the
 * grid or between rows
 *
 * @public
 */
export interface Banner extends NamedModel, Identifiable {
  /** Banner title. */
  title: string;
  /** URL to redirect. */
  url: string;
  /** Banner image. */
  image: string;
  /** Banner tagging. */
  tagging: {
    /** {@link Tagging | Click tagging}. */
    click: Tagging;
  };
}
