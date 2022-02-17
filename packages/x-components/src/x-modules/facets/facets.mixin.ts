import { Facet, Filter } from '@empathyco/x-types';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Getter } from '../../components/index';
import { isArrayEmpty } from '../../utils/index';
import { FiltersByFacet } from './store/index';

/**
 * Mixin to share Facets logic.
 *
 * @public
 */
@Component
export default class FacetsMixin extends Vue {
  /**
   * Array of facets ids that will be passed to event like payload.
   *
   * @public
   */
  @Prop()
  public facetsIds?: Array<Facet['id']>;

  /**
   * It handles if the component is always visible no matter if there are not
   * filters selected. If false, the component is not visible whether
   * there are no filters selected.
   *
   * @public
   */
  @Prop({ default: false })
  public alwaysVisible!: boolean;

  /**
   * Array of selected filters from every facet.
   *
   * @internal
   */
  @Getter('facets', 'selectedFiltersByFacet')
  public selectedFiltersByFacet!: FiltersByFacet;

  /**
   * Get the selected filters from store.
   *
   * @internal
   */
  @Getter('facets', 'selectedFilters')
  public selectedFiltersGetter!: Filter[];

  /**
   * Get selected filters.
   * If there are facets ids, get selected filters whose facet id match with some of facets ids.
   * If there aren't facets ids, get selected filters.
   *
   * @returns Array of selected filters depends on there are facets ids or not.
   * @internal
   */
  protected get selectedFilters(): Filter[] {
    if (this.facetsIds) {
      return (this.facetsIds as string[]).reduce(
        (selectedFilters, facetId) => [...selectedFilters, ...this.selectedFiltersByFacet[facetId]],
        [] as Filter[]
      );
    }

    return this.selectedFiltersGetter;
  }

  /**
   * Check if there are selected filters.
   *
   * @returns True or false depends on if there are selected filters.
   * @internal
   */
  protected get hasSelectedFilters(): boolean {
    return !isArrayEmpty(this.selectedFilters);
  }

  /**
   * If alwaysVisible prop is true, component is always shown, but disabled
   * if there are no filters selected.
   * If alwaysVisible prop is false, component is shown whether there
   * are some filter selected.
   *
   * @returns True if alwaysVisible is true or in the opposite case true or false depends
   * on if there are selected filters or not.
   *
   * @internal
   */
  protected get show(): boolean {
    return this.alwaysVisible || this.hasSelectedFilters;
  }
}
