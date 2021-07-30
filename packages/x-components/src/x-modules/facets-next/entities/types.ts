import { Store } from 'vuex';
import { Filter } from '../../../../../search-types/src/facet/filter/filter.model';
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
export interface FilterEntity {
  /** Selects the filter. */
  select(): void;
  /** Deselects the filter. */
  deselect(): void;
}

/** Constructor of a {@link FilterEntity}. */
export interface FilterEntityConstructor<SomeFilter extends Filter> {
  new (store: Store<RootXStoreState>, filter: SomeFilter): FilterEntity;
  /**
   * Checks if this class can create an instance with the passed filter DTO.
   *
   * @param filter - The filter to check if this class can create an instance with it.
   * @returns True if this class can create an instance with it. False otherwise.
   */
  accepts(filter: Filter): boolean;
}
