import type { Sort } from '@empathyco/x-types'

/**
 * Request for the `browse` endpoint.
 *
 * @public
 */

export interface PlatformBrowseRequest {
  browseField: string
  browseValue: string
  extraParams?: {
    [key: string]: any
  }
  filter: string[]
  sort?: Sort
  start?: number
  rows?: number
}
