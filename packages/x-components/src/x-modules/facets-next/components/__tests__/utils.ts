import { Facet } from '@empathyco/x-types-next';
import { Store } from 'vuex';
import { resetStoreXModuleState } from '../../../../__tests__/utils';
import { RootXStoreState } from '../../../../store/store.types';
import { arrayToObject } from '../../../../utils/array';
import { reduce } from '../../../../utils/object';
import { DeepPartial } from '../../../../utils/types';
import { facetsNextXStoreModule as facetsXStoreModule } from '../../store/module';
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
    Object.values(facets)
      .map(facet => facet.filters)
      .flat(),
    'id'
  );
  const groups = reduce(
    facets,
    (groups, facetId) => Object.assign(groups, { [facetId]: groupId }),
    {} as Record<Facet['id'], GroupId>
  );

  resetStoreXModuleState(store, 'facetsNext', facetsXStoreModule.state(), {
    facets,
    filters,
    groups
  });
}
