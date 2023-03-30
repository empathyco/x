import { Filter } from '@empathyco/x-types';
import { BaseFilterEntityModifier } from './types';

/**
 * A dictionary with information about whether to keep or remove sticky filters.
 */
interface Metadata {
  keepSticky: boolean;
}

/**
 * Allows to persist a filter between different queries.
 *
 * @remarks when using this modifier along with others, make sure this is the last one defined.
 *
 * @internal
 */
export class StickyModifier extends BaseFilterEntityModifier<Metadata> {
  /**
   * Deselects the passed filter unless the metadata has the `keepSticky` flag enabled.
   *
   * @param filter - The filter to deselect.
   * @param metadata - Additional information to prevent a filter from being deselected.
   */
  deselect(filter: Filter, metadata?: Metadata): void {
    if (!metadata?.keepSticky) {
      super.deselect(filter, metadata);
      this.store.commit('x/facets/removeStickyFilter', filter);
    }
  }

  /**
   * Selects the passed filter and stores it as sticky.
   *
   * @param filter - The filter to select.
   */
  select(filter: Filter): void {
    super.select(filter);
    this.store.commit('x/facets/setStickyFilter', filter);
  }
}
