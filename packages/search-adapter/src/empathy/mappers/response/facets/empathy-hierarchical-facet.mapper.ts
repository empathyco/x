import { HierarchicalFacet, HierarchicalFilter, Filter } from '@empathyco/x-types-next';
import { injectable, multiInject } from 'inversify';
import { DEPENDENCIES } from '../../../container/container.const';
import { MapFn, ResponseMapper, ResponseMapperContext } from '../../../empathy-adapter.types';
import { EmpathyFacet, EmpathyFilter } from '../../../models';
import { pipeMappers } from '../../pipe-mappers';

/**
 * Hierarchical Empathy facet mapper.
 *
 * @public
 */
@injectable()
export class EmpathyHierarchicalFacetMapper implements ResponseMapper<EmpathyFacet, HierarchicalFacet> {
  protected readonly mapFilter: MapFn<EmpathyFilter, HierarchicalFilter>;

  constructor(
    @multiInject(DEPENDENCIES.ResponseMappers.hierarchicalFilter) filterMappers: ResponseMapper<EmpathyFilter, HierarchicalFilter>[]
  ) {
    this.mapFilter = pipeMappers(...filterMappers);
  }

  map(rawFacet: EmpathyFacet, facet: HierarchicalFacet, context: ResponseMapperContext): HierarchicalFacet {
    if (facet.modelName === 'HierarchicalFacet') {
      Object.assign<HierarchicalFacet, Partial<HierarchicalFacet>>(facet, {
        filters: this.mapFiltersTree(facet, rawFacet.values, context)
      });
    }
    return facet;
  }

  protected mapFiltersTree(facet: HierarchicalFacet, rawFilters: EmpathyFilter[], context: ResponseMapperContext): HierarchicalFilter[] {
    const filters: HierarchicalFilter[] = [];
    const initFilterProps: Readonly<Partial<HierarchicalFilter>> = { facetId: facet.id, parentId: null };
    rawFilters.forEach(rawFilter => {
      this.mapDeepFilter(rawFilter, initFilterProps, context, filters);
    });
    return filters;
  }

  protected mapDeepFilter(
    rawFilter: EmpathyFilter,
    initFilterProps: Readonly<Partial<HierarchicalFilter>>,
    context: ResponseMapperContext,
    filters: HierarchicalFilter[]
  ): Filter['id'] {
    const filter = this.mapFilter(rawFilter, { ...initFilterProps } as HierarchicalFilter, context);
    filter.children =
      rawFilter.values?.map(
        rawFilterChild => this.mapDeepFilter(rawFilterChild, { ...initFilterProps, parentId: filter.id }, context, filters));
    filters.push(filter);
    return filter.id;
  }
}
