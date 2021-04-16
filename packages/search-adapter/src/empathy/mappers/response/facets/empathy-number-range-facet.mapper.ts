import { NumberRangeFacet, NumberRangeFilter, SimpleFilter } from '@empathy/search-types';
import { inject, injectable, multiInject } from 'inversify';
import { EmpathyAdapterConfig, FacetsConfig } from '../../../config';
import { DEPENDENCIES } from '../../../container/container.const';
import { MapFn, ResponseMapper, ResponseMapperContext } from '../../../empathy-adapter.types';
import { EmpathyFacet, EmpathyFilter } from '../../../models';
import { pipeMappers } from '../../pipe-mappers';

/**
 * Number Range Empathy facet mapper.
 *
 * @public
 */
@injectable()
export class EmpathyNumberRangeFacetMapper implements ResponseMapper<EmpathyFacet, NumberRangeFacet> {
  protected readonly facetsConfig: FacetsConfig;
  protected readonly mapFilter: MapFn<EmpathyFilter, NumberRangeFilter>;

  constructor(
    @multiInject(DEPENDENCIES.ResponseMappers.numberRangeFilter) filterMappers: ResponseMapper<EmpathyFilter, NumberRangeFilter>[],
    @inject(DEPENDENCIES.config) config: EmpathyAdapterConfig
  ) {
    this.mapFilter = pipeMappers(...filterMappers);
    this.facetsConfig = config.mappings.facets;
  }

  map(rawFacet: EmpathyFacet, facet: NumberRangeFacet, context: ResponseMapperContext): NumberRangeFacet {
    const { isDynamic } = this.facetsConfig.named[facet.id] || this.facetsConfig.default;
    if (facet.modelName === 'NumberRangeFacet') {
      Object.assign<NumberRangeFacet, Partial<NumberRangeFacet>>(facet, {
        filters: this.mapFilters(facet, rawFacet.values, isDynamic, context)
      });
    }
    return facet;
  }

  protected mapFilters(facet: NumberRangeFacet, rawFilters: EmpathyFilter[] = [], isDynamic: boolean,
    context: ResponseMapperContext): NumberRangeFilter[] {
    const rawFiltersToMap = isDynamic ? [rawFilters[0]] : rawFilters;
    return rawFiltersToMap.map(rawFilter => this.mapFilter(rawFilter, { facetId: facet.id } as NumberRangeFilter, context));
  }
}
