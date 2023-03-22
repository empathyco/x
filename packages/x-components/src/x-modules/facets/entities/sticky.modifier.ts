import { Filter } from '@empathyco/x-types';
import { BaseFilterEntityModifier } from './types';

interface Metadata {
  keepSticky: boolean;
}

export class StickyModifier extends BaseFilterEntityModifier<Metadata> {
  deselect(filter: Filter, metadata?: Metadata): void {
    if (!metadata?.keepSticky) {
      super.deselect(filter, metadata);
      this.store.commit('x/facets/removeStickyFilter', filter);
    }
  }

  select(filter: Filter, metadata?: Metadata): void {
    super.select(filter, metadata);
    this.store.commit('x/facets/setStickyFilter', filter);
  }
}
