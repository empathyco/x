import { Store } from 'vuex';
import { Filter } from '@empathyco/x-types-next';
import { RootXStoreState } from '../../../store/store.types';

/**
 * Compares if two objects are the same.
 */
export interface Equatable {
  /**
   * Returns true if this object is equal to the one passed.
   *
   * @param something - The object to compare this instance to.
   * @returns True if the two objects are equals, false otherwise.
   */
  isEquals(something: Equatable): boolean;
  /**
   * Returns a unique string identifier for the instance.
   */
  getHashCode(): string;
}

/**
 * Contains business logic to select or deselect a filter of a certain type.
 */
export interface FilterEntity<SomeFilter extends Filter = Filter> {
  /** Selects the filter. */
  select(): void;
  /** Selects the filter passing a filter as new state.
   *
   * @param filter - The filter passed as parameter to use as new state.
   * */
  select(filter: SomeFilter): void;
  /** Deselects the filter. */
  deselect(): void;
}

/** Constructor of a {@link FilterEntity}. */
export interface FilterEntityConstructor<SomeFilter extends Filter> {
  new (store: Store<RootXStoreState>, filter: SomeFilter): FilterEntity<SomeFilter>;
  /**
   * Checks if this class can create an instance with the passed filter DTO.
   *
   * @param filter - The filter to check if this class can create an instance with it.
   * @returns True if this class can create an instance with it. False otherwise.
   */
  accepts(filter: Filter): boolean;
}
