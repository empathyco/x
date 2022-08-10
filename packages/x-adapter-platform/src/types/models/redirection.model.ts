/**
 * Redirection model for the `platform` API.
 *
 * @public
 */
export interface PlatformRedirection {
  id: string;
  url: string;
  tagging?: {
    click: string;
  };
}
