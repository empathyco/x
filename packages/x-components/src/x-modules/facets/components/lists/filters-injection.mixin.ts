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
   * {@link HierarchicalFilter}.
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
