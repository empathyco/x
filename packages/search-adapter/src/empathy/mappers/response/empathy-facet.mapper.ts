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
  private readonly facetsConfig: FacetsConfig;
  private readonly mapFilter: MapFn<EmpathyFilter, Filter>;

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
    return Object.assign<Facet, Partial<Facet>>(facet, {
      filters: this.mapFiltersTree(facet, rawFacet.values, context)
    });
  }

  private addSelectedFiltersToContext(context: ResponseMapperContext) {
    if (this.hasRequestFilters(context.rawRequest) && !context.selectedFilters) {
      context.selectedFilters = Object.values(context.rawRequest.filters)
        .reduce((filters, facetFilters) => {
          facetFilters.forEach(filter => filters[filter.id] = filter);
          return filters;
        }, {} as Dictionary<Filter>);
    }
  }

  private createFilter(rawFilter: EmpathyFilter, filter: Filter, context: ResponseMapperContext): Filter {
    return this.mapFilter(rawFilter, Object.assign(filter, {
      children: this.mapFilters(rawFilter.values, { ...filter, parent: filter }, context)
    }), context);
  }

  private hasRequestFilters(request: any): request is Required<FilterableRequest> {
    return !!(request as FilterableRequest).filters;
  }

  private mapFilters(rawFilters: EmpathyFilter[] = [], initialFilterProperties: Readonly<Partial<Filter>>,
    context: ResponseMapperContext) {
    return rawFilters.map(rawFilter => this.createFilter(rawFilter, { ...initialFilterProperties } as Filter, context));
  }

  private mapFiltersTree(facet: Facet, rawFilters: EmpathyFilter[], context: ResponseMapperContext): Filter[] {
    const { filterModelName, needsParentFilters, isDynamic } = this.facetsConfig.named[facet.modelName] || this.facetsConfig.default;
    const initialFilterProperties: Partial<Filter> = { facet, needsParentFilter: needsParentFilters, modelName: filterModelName };
    return isDynamic
      // We only map the first filter because its values will be overriden dynamically by the user
      ? [this.createFilter(rawFilters[0], initialFilterProperties as Filter, context)]
      : this.mapFilters(rawFilters, initialFilterProperties, context);
  }
}
