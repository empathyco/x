import { Store } from 'vuex';
import { Facet, FacetModelName } from '@empathyco/x-types-next';
import { RootXStoreState } from '../../../store/store.types';

/**
 * Adds an {@link Facet} to the store in case it doesn't exist for the passed facetId.
 *
 * @param store - The {@link https://vuex.vuejs.org/guide/ | Vuex Store}.
 * @param facetId - The Facet id for the Facet that will be created.
 * @param facetModelName - The {@link FacetModelName} for  the Facet that will be created.
 * @internal
 */
export function addFacetIfNotPresent(
  store: Store<RootXStoreState>,
  facetId: Facet['id'],
  facetModelName: FacetModelName
): void {
  if (!store.state.x.facetsNext.facets[facetId]) {
    store.commit('x/facetsNext/setFacet', {
      modelName: facetModelName,
      id: facetId,
      label: facetId
    } as Omit<Facet, 'filters'>);
  }
}
