import { Facet } from '@empathyco/x-types';
import { DeepPartial, map } from '@empathyco/x-utils';
import { Store } from 'vuex';
import { resetStoreXModuleState } from '../../../../__tests__/utils';
import { RootXStoreState } from '../../../../store/store.types';
import { arrayToObject } from '../../../../utils/array';
import { facetsXStoreModule as facetsXStoreModule } from '../../store/module';
import { GroupId } from '../../store/types';

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
  groupId: GroupId = 'search'
): void {
  const filters = arrayToObject(
    Object.values(facets).flatMap(facet => facet.filters),
    'id'
  );
  const groups = map(facets, () => groupId);

  resetStoreXModuleState(store, 'facets', facetsXStoreModule.state(), {
    facets,
    filters,
    groups
  });
}
