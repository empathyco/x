import type { Filter } from '@empathyco/x-types'

/**
 * Custom interface to provide a slot name to a Filter.
 *
 * @internal
 */
export interface RenderFilter {
  slotName: string
  selectedFilter: Filter
}
