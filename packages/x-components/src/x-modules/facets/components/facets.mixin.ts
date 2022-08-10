import { Facet, Filter } from '@empathyco/x-types';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Getter } from '../../../components/decorators/store.decorators';
import { isArrayEmpty } from '../../../utils/array';
import { FiltersByFacet } from '../store/types';

/**
 * Mixin to share Facets logic.
 *
 * @public
 */
@Component
export default class FacetsMixin extends Vue {
  /**
   * Array of facets ids used to get the selected filters for those facets.
   *
   * @public
   */
  @Prop()
  public facetsIds?: Array<Facet['id']>;

  /**
   * Flag to render the component even if there are no filters selected.
   *
   * @public
   */
  @Prop({ default: false })
  public alwaysVisible!: boolean;

  /**
   * Dictionary of filters {@link FiltersByFacet} filtered by facet id.
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
   * Flag representing if the component should be visible/rendered or not.
   *
   * @returns True whenever alwaysVisible is true or has selected filters. False
   * otherwise.
   *
   * @internal
   */
  protected get isVisible(): boolean {
    return this.alwaysVisible || this.hasSelectedFilters;
  }
}
