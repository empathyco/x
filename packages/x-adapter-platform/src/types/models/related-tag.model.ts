/**
 * Related tag model for the `platform` API.
 *
 * @public
 */
export interface PlatformRelatedTag {
  query: string;
  tag: string;
  source: 'ORGANIC' | 'CURATED';
  position: number;
}
