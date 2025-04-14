import type { Facet } from '@empathyco/x-types'
import type { DeepPartial } from '@empathyco/x-utils'
import type { Store } from 'vuex'
import type { RootXStoreState } from '../../../../store/store.types'
import type { GroupId } from '../../store/types'
import { map } from '@empathyco/x-utils'
import { resetStoreXModuleState } from '../../../../__tests__/utils'
import { arrayToObject } from '../../../../utils/array'
import { facetsXStoreModule } from '../../store/module'

/**
 * Reset facets x-module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Root state of the x-modules.
 * @param facets - Store state facets to use as replacement.
 * @param groupId - Facets group id to use in replacement.
 *
 * @internal
 */
export function resetXFacetsStateWith(
  store: Store<DeepPartial<RootXStoreState>>,
  facets: Record<Facet['id'], Facet> = {},
  groupId: GroupId = 'search',
): void {
  const filters = arrayToObject(
    Object.values(facets).flatMap(facet => facet.filters),
    'id',
  )
  const groups = map(facets, () => groupId)

  resetStoreXModuleState(store, 'facets', facetsXStoreModule.state(), {
    facets,
    filters,
    groups,
  })
}
