import { Facet, FilterModelName, Filter, isFacetFilter } from '@empathyco/x-types';
import { Store } from 'vuex';
import { RootXStoreState } from '../../../store/store.types';
import { EditableNumberRangeFilterEntity } from './editable-number-range-filter.entity';
import { HierarchicalFilterEntity } from './hierarchical-filter.entity';
import { NumberRangeFilterEntity } from './number-range-filter.entity';
import { RawFilterEntity } from './raw-filter.entity';
import { SimpleFilterEntity } from './simple-filter.entity';
import { FilterEntity, FilterEntityConstructor, FilterEntityModifier } from './types';

/**
 * Creates {@link FilterEntity | FilterEntities} based on the provided configs.
 *
 * @internal
 */
export class FilterEntityFactory {
  /**
   * The public global instance of the Singleton.
   *
   * @remarks The constructor is not private, so it's possible to create more instances,
   * to simplify the testing.
   */
  public static instance = new FilterEntityFactory();

  /**
   * The registered entities by default to be used by the Factory.
   */
  protected entities: FilterEntityConstructor[] = [
    SimpleFilterEntity,
    HierarchicalFilterEntity,
    NumberRangeFilterEntity,
    EditableNumberRangeFilterEntity,
    RawFilterEntity
  ];

  /**
   * The registered modifiers grouped by the facetId to be applied.
   */
  protected modifiersByFacetId: Record<Facet['id'], FilterEntityModifier[]> = {};

  /**
   * The registered modifiers grouped by the filter `ModelName` to be applied.
   */
  protected modifiersByFilterModelName: Partial<Record<FilterModelName, FilterEntityModifier[]>> =
    {};

  /**
   * Contains the instantiated entities for each facet.
   *
   * @internal
   */
  protected cache: Record<Facet['id'] | '__unknown-facet__', FilterEntity> = {};

  /**
   * Creates a new FilterEntity from a filter.
   *
   * @param store - The {@link https://vuex.vuejs.org/guide/ | Vuex Store} that the entity will
   * use.
   * @param filter - The {@link @empathyco/x-types#Filter | Filter} necessary to know what
   * {@link FilterEntity} to create.
   * @returns The {@link FilterEntity} created by the factory.
   */
  getFilterEntity(store: Store<RootXStoreState>, filter: Filter): FilterEntity {
    const cacheKey = isFacetFilter(filter) ? filter.facetId : '__unknown-facet__';
    return this.cache[cacheKey] ?? (this.cache[cacheKey] = this.createFilterEntity(store, filter));
  }

  /**
   * Creates a brand new {@link FilterEntity} for the given
   * {@link @empathyco/x-types#Filter | Filter}.
   *
   * @param store - The store which should be mutated through the entity.
   * @param filter - The filter to create the entity for.
   * @returns A new {@link FilterEntity} for the given {@link @empathyco/x-types#Filter | Filter}.
   * @internal
   */
  protected createFilterEntity(store: Store<RootXStoreState>, filter: Filter): FilterEntity {
    const filterEntityConstructor = this.entities.find(entity => entity.accepts(filter));
    if (!filterEntityConstructor) {
      throw new Error(`Entity configuration for ${filter.modelName} not registered.`);
    }
    const entity = new filterEntityConstructor(store);
    const modifiers = isFacetFilter(filter)
      ? this.modifiersByFacetId[filter.facetId] ??
        this.modifiersByFilterModelName[filter.modelName] ??
        []
      : [];
    return modifiers.reduce(
      (modifiedEntity, modifier) => new modifier(store, modifiedEntity),
      entity
    );
  }

  /**
   * Registers a new {@link FilterEntity} to be used by the factory.
   *
   * @param entity - The new {@link FilterEntity} to be registered in the factory.
   */
  registerFilterEntity(entity: FilterEntityConstructor): void {
    if (!this.entities.includes(entity)) {
      this.entities.push(entity);
    }
  }

  /**
   * Registers a list of modifiers to be used with the {@link FilterEntity | FilterEntities} of a
   * particular facet.
   *
   * @param facetId - The facet id whose Entities will be modified.
   * @param modifiers - The list of modifiers to be registered.
   */
  registerModifierByFacetId(facetId: Facet['id'], ...modifiers: FilterEntityModifier[]): void {
    this.updateModifiers(this.modifiersByFacetId, facetId, modifiers);
  }

  /**
   * Registers a list of modifiers to be used with the {@link FilterEntity | FilterEntities} of a
   * particular facet.
   *
   * @param filterModelName - The facet ModelName whose Entities will be modified.
   * @param modifiers - The list of modifiers to be registered.
   */
  registerModifierByFilterModelName(
    filterModelName: FilterModelName,
    ...modifiers: FilterEntityModifier[]
  ): void {
    this.updateModifiers(this.modifiersByFilterModelName, filterModelName, modifiers);
  }

  /**
   * Updates the modifiers for a particular facet.
   *
   * @param modifiersRecord - The map of modifiers to be updated.
   * @param modifierKey - The id whose modifiers will be updated.
   * @param modifiers - The list of new modifiers to be registered.
   */
  protected updateModifiers(
    modifiersRecord: Record<string, FilterEntityModifier[]>,
    modifierKey: string | number,
    modifiers: FilterEntityModifier[]
  ): void {
    if (!modifiersRecord[modifierKey]) {
      modifiersRecord[modifierKey] = [];
    }
    const facetModifiers = modifiersRecord[modifierKey];
    const newModifiers = modifiers.filter(modifier => !facetModifiers.includes(modifier));
    facetModifiers.push(...newModifiers);
  }
}
