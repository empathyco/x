import { Store } from 'vuex';
import { Filter } from '@empathyco/x-types';
import { RootXStoreState } from '../../../store/store.types';

/**
 * Contains business logic to select or deselect a filter of a certain type.
 *
 * @internal
 */
export interface FilterEntity {
  /** Selects the filter. */
  select(filter: Filter): void;
  /** Deselects the filter. */
  deselect(filter: Filter): void;
}

/** Constructor of a {@link FilterEntity}.
 *
 * @internal
 */
export interface FilterEntityConstructor {
  new (store: Store<RootXStoreState>): FilterEntity;
  /**
   * Checks if this class can create an instance with the passed filter DTO.
   *
   * @param filter - The filter to check if this class can create an instance with it.
   * @returns True if this class can create an instance with it. False otherwise.
   */
  accepts(filter: Filter): boolean;
}

/**
 * The FilterEntityModifier constructor.
 *
 * @param store - The {@link https://vuex.vuejs.org/api/#vuex-store | Vuex Store} that modifier
 * uses.
 * @param entity - The {@link FilterEntity } that the modifier modifies.
 *
 * @internal
 */
export interface FilterEntityModifier {
  new (store: Store<RootXStoreState>, entity: FilterEntity): FilterEntity;
}

/**
 * The base class for any Modifier. It delegates to the `entity` methods by default.
 *
 * @internal
 */
export abstract class BaseFilterEntityModifier implements FilterEntity {
  public constructor(protected store: Store<RootXStoreState>, protected entity: FilterEntity) {}

  /**
   * Selects the filter passed by parameter.
   *
   * @param filter - The filter to select.
   */
  select(filter: Filter): void {
    this.entity.select(filter);
  }

  /**
   * Deselects the filter passed by parameter.
   *
   * @param filter - The filter to deselect.
   */
  deselect(filter: Filter): void {
    this.entity.deselect(filter);
  }
}
