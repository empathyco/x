/**
 * Banner model for the `platform` API.
 *
 * @public
 */
export interface PlatformBanner {
  id: string;
  title: string;
  url: string;
  image_url: string;
  tagging?: {
    query: string;
  };
}
