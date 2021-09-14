import { Identifiable } from './identifiable.model';
import { NamedModel } from './named-model.model';
import { Tagging } from './tagging.model';

/**
 * A redirection (AKA Direct Link) is simply a URL.
 * Normally, the user is just redirected to it after making a query that matches the
 * configuration of this URL. In other cases it is shown as a button that the user can click,
 * and which will trigger the redirect action.
 *
 * @public
 */
export interface Redirection extends NamedModel<'Redirection'>, Identifiable {
  /** Redirect title. */
  title: string;
  /** URL to redirect. */
  url: string;
  /** Redirect tagging. */
  tagging: {
    /** {@link Tagging | Click tagging}. */
    click: Tagging;
  };
}
