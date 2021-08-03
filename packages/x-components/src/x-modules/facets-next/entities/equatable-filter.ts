import { Filter } from '@empathyco/x-types-next';
import { Equatable } from './types';

/**
 * Simple implementation of {@link Equatable} for filters using its id for comparing
 * equality.
 */
export class EquatableFilter implements Equatable {
  public constructor(protected filter: Filter) {}

  getHashCode(): string {
    return this.filter.id.toString();
  }

  isEquals(something: Equatable): boolean {
    return this.getHashCode() === something.getHashCode();
  }
}
