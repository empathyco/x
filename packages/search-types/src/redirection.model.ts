import { Tagging } from './tagging.model';

/**
 * @public
 * A redirection (AKA Direct Link) is simply a URL.
 * Normally, the user is just redirected to it after making a query that matches the configuration of this URL. In other cases it is shown
 * as a button that the user can click, and which will trigger the redirect action.
 */
export interface Redirection {
  id: string;
  title: string;
  url: string;
  tagging: {
    click: Tagging;
  };
}
