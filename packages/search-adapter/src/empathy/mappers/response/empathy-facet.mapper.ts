import { Facet, Filter } from '@empathy/search-types';
import { inject, injectable, multiInject } from 'inversify';
import { FilterableRequest } from '../../../types';
import { Dictionary } from '../../../utils/utils.types';
import { EmpathyAdapterConfig, FacetsConfig } from '../../config/empathy-adapter-config.types';
import { DEPENDENCIES } from '../../container/container.const';
import { MapFn, ResponseMapper, ResponseMapperContext } from '../../empathy-adapter.types';
import { EmpathyFacet, EmpathyFilter } from '../../models';
import { pipeMappers } from '../pipe-mappers';

@injectable()
export class EmpathyFacetMapper implements ResponseMapper<EmpathyFacet, Facet> {
  protected readonly facetsConfig: FacetsConfig;
  protected readonly mapFilter: MapFn<EmpathyFilter, Filter>;

  constructor(
    @multiInject(DEPENDENCIES.ResponseMappers.filters) filterMappers: ResponseMapper<EmpathyFilter, Filter>[],
    @inject(DEPENDENCIES.config) config: EmpathyAdapterConfig
  ) {
    this.mapFilter = pipeMappers(...filterMappers);
    this.facetsConfig = config.mappings.facets;
  }

  map(rawFacet: EmpathyFacet, facet: Facet, context: ResponseMapperContext): Facet {
    this.addSelectedFiltersToContext(context);
    const facetConfig = this.facetsConfig.named[rawFacet.facet] || this.facetsConfig.default;
    Object.assign<Facet, Partial<Facet>>(facet, {
      modelName: rawFacet.facet,
      title: rawFacet.facet,
      preselected: facetConfig.preselected
    });
    facet.filters = this.mapFiltersTree(facet, rawFacet.values, context);
    return facet;
  }

  protected addSelectedFiltersToContext(context: ResponseMapperContext) {
    if (this.hasRequestFilters(context.rawRequest) && !context.selectedFilters) {
      context.selectedFilters = Object.values(context.rawRequest.filters)
        .reduce((filters, facetFilters) => {
          facetFilters.forEach(filter => filters[filter.id] = filter);
          return filters;
        }, {} as Dictionary<Filter>);
    }
  }

  protected hasRequestFilters(request: any): request is Required<FilterableRequest> {
    return !!(request as FilterableRequest).filters;
  }

  protected mapFiltersTree(facet: Facet, rawFilters: EmpathyFilter[], context: ResponseMapperContext): Filter[] {
    const { filterModelName, needsParentFilters, isDynamic } = this.facetsConfig.named[facet.modelName] || this.facetsConfig.default;
    const initialFilterProperties: Partial<Filter> = { facet, needsParentFilter: needsParentFilters, modelName: filterModelName };
    return isDynamic
      // We only map the first filter because its values will be overridden dynamically by the user
      ? [this.mapFilter(rawFilters[0], initialFilterProperties as Filter, context)]
      : this.mapFilters(rawFilters, initialFilterProperties, context);
  }

  protected mapFilters(rawFilters: EmpathyFilter[] = [], initialFilterProperties: Readonly<Partial<Filter>>,
    context: ResponseMapperContext): Filter[] {
    return rawFilters.map(rawFilter => {
      const filter = this.mapFilter(rawFilter, { ...initialFilterProperties } as Filter, context);
      filter.children = this.mapFilters(rawFilter.values, { ...initialFilterProperties, parent: filter }, context);
      return filter;
    });
  }
}
