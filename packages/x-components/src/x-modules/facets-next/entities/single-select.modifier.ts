import { isFacetFilter, FacetFilter, Facet } from '@empathyco/x-types-next';
import { FacetsNextGetters } from '../store/types';
import { BaseFilterEntityModifier } from './types';

export class SingleSelectModifier extends BaseFilterEntityModifier {
  select(filter: FacetFilter): void {
    super.select(filter);
    this.getSelectedSiblings(filter).forEach(siblingFilter => this.deselect(siblingFilter));
  }

  protected getSelectedSiblings(filter: FacetFilter): FacetFilter[] {
    if (!isFacetFilter(filter)) {
      return [];
    } else {
      return this.getFacetFilters(filter.facetId).filter(
        storeFilter => storeFilter.id !== filter.id && storeFilter.selected
      );
    }
  }

  protected getFacetFilters(facetId: Facet['id']): FacetFilter[] {
    return (
      this.store.getters['x/facetsNext/filtersByFacet'] as FacetsNextGetters['filtersByFacet']
    )[facetId] as FacetFilter[];
  }
}
