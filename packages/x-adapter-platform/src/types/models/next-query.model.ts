/**
 * Next query model for the `platform` API.
 *
 * @public
 */
export interface PlatformNextQuery {
  query: string
  source: 'ORGANIC' | 'CURATED' | 'SYNTHETIC'
  position: number
}
