import { Store } from 'vuex';
import { Filter } from '@empathyco/x-types';
import { Dictionary } from '@empathyco/x-utils';
import { RootXStoreState } from '../../../store/store.types';

/**
 * Contains business logic to select or deselect a filter of a certain type.
 *
 * @internal
 */
export interface FilterEntity<Metadata extends Dictionary = Dictionary<unknown>> {
  /** Selects the filter. */
  select(filter: Filter, metadata?: Metadata): void;
  /** Deselects the filter. */
  deselect(filter: Filter, metadata?: Metadata): void;
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
export interface FilterEntityModifier<Metadata extends Dictionary = Dictionary> {
  new (store: Store<RootXStoreState>, entity: FilterEntity<Metadata>): FilterEntity<Metadata>;
}

/**
 * The base class for any Modifier. It delegates to the `entity` methods by default.
 *
 * @internal
 */
export abstract class BaseFilterEntityModifier<Metadata extends Dictionary = Dictionary>
  implements FilterEntity<Metadata>
{
  public constructor(protected store: Store<RootXStoreState>, protected entity: FilterEntity) {}

  /**
   * Selects the filter passed by parameter.
   *
   * @param filter - The filter to select.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  select(filter: Filter, metadata?: Metadata): void {
    this.entity.select(filter);
  }

  /**
   * Deselects the filter passed by parameter.
   *
   * @param filter - The filter to deselect.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deselect(filter: Filter, metadata?: Metadata): void {
    this.entity.deselect(filter);
  }
}
