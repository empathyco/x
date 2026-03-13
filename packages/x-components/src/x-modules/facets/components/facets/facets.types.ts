import type { Facet } from '@empathyco/x-types'

/**
 * Custom interface to provide a slot name to a Facet.
 *
 * @internal
 */
export interface RenderFacet {
  slotNameById: string
  slotNameByModelName: string
  facet: Facet
}
