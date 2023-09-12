/**
 * Promoted model for the `platform` API.
 *
 * @public
 */
export interface PlatformPromoted {
  id: string;
  title: string;
  url: string;
  image_url: string;
  position?: number;
  tagging?: {
    click?: string;
  };
}
