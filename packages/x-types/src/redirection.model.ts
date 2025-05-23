import type { Identifiable } from './identifiable.model'
import type { NamedModel } from './named-model.model'
import type { Taggable } from './tagging.model'

/**
 * A redirection (AKA Direct Link) is simply a URL.
 * Normally, the user is just redirected to it after making a query that matches the
 * configuration of this URL. In other cases it is shown as a button that the user can click,
 * and which will trigger the redirect action.
 *
 * @public
 */
export interface Redirection extends NamedModel<'Redirection'>, Identifiable, Taggable {
  /** URL to redirect. */
  url: string
}
