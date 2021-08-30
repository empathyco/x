import { Filter, HierarchicalFilter, isHierarchicalFilter } from '@empathyco/x-types';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { XInject } from '../../../../components/decorators/injection.decorators';
import { isArrayEmpty } from '../../../../utils/array';

/**
 * Mixin to share filters injection logic.
 *
 * @public
 */
@Component
export default class FiltersInjectionMixin extends Vue {
  /**
   * The list of filters to be rendered as slots.
   *
   * @public
   */
  @Prop()
  protected filters!: Filter[];

  /**
   * This prop is used in the `HierarchicalFilter` component and only in that case. It is necessary
   * to make the `renderedFilters` to return only the filters of each level of the hierarchy.
   *
   * @public
   */
  @Prop({ required: false })
  protected parentId!: Filter['id'];

  /** The injected filters array.
   *
   * @public
   */
  @XInject('filters')
  public injectedFilters!: Filter[];

  /**
   * The prop or injected filters array, filtered by parentId if they are
   * {@link @empathyco/x-types#HierarchicalFilter}.
   *
   * @returns An array of filters.
   *
   * @internal
   */
  protected get renderedFilters(): Filter[] {
    return this.filterByParentId(this.propOrInjectedFilters);
  }

  /**
   * An array of filters formed by those that are passed through prop or injected.
   *
   * @returns An array of filters.
   *
   * @internal
   */
  protected get propOrInjectedFilters(): Filter[] {
    return (
      this.filters ??
      this.injectedFilters ??
      //TODO: add here logger
      //eslint-disable-next-line no-console
      console.warn('It is necessary to pass a prop or inject the list of filters')
    );
  }

  /**
   * In the case that the filters are {@link @empathyco/x-types#HierarchicalFilter}, this method
   * removes from the filter list passed as a param, the filters that are not part of the level of
   * the hierarchy, depending on the value of the `parentId` prop. In case this prop is undefined,
   * then only the first level of filters hierarchy are returned. In the case the prop `parentId` is
   * defined, then only the filters with the same `parentId` are returned.
   *
   * @param filters - The list of the filters to apply the filter.
   * @returns The list of the filters filtered by parentId.
   * @internal
   */
  protected filterByParentId(filters: Filter[]): Filter[] {
    if (!isArrayEmpty(filters) && isHierarchicalFilter(filters[0])) {
      return (filters as HierarchicalFilter[]).filter(
        filter => filter.parentId === (this.parentId ?? null)
      );
    } else {
      return filters;
    }
  }
}
