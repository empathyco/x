import { Filter } from '@empathyco/x-types';
import { BaseFilterEntityModifier } from './types';

interface Metadata {
  shouldDeselect: boolean;
}

export class StickyModifier extends BaseFilterEntityModifier<Metadata> {
  deselect(filter: Filter, metadata: Metadata): void {
    console.log('STICKY', this.entity);

    if (metadata?.shouldDeselect) {
      super.deselect(filter, metadata);
    }
  }
}
