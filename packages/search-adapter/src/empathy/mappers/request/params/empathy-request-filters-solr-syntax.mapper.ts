import { Filter, FilterModel, MultiSelect, RangeFilter, SimpleFilter } from '@empathy/search-types';
import { inject, injectable } from 'inversify';
import { EmpathyAdapterConfig, FacetConfig, FilterValueMapperParams } from '../../../config/empathy-adapter-config.types';
import { DEPENDENCIES } from '../../../container/container.const';
import { Mapper } from '../../../empathy-adapter.types';

// TODO When the backend updates their services to be agnostic of the solr db syntax, we can remove this class
@injectable()
export class EmpathyRequestFiltersSolrSyntaxMapper implements Mapper<Filter[], string[]> {
  constructor(@inject(DEPENDENCIES.config) private readonly config: EmpathyAdapterConfig
  ) {}

  map(filters: Filter[], filterValues: string[]): string[] {
    const facetName = filters[0].facet.modelName;
    const mappedFilterValues = this.needsCompositionWithOrOnFrontend(facetName, filters)
      ? this.composeFiltersWithOr(facetName, filters)
      : this.composeFilters(facetName, filters);
    filterValues.push(...mappedFilterValues);
    return filterValues;
  }

  private composeFilters(facetName: string, filters: Filter[]): string[] {
    const mapFilterValue = this.getMappingFilterValueFn(filters[0].modelName);
    return filters.map(filter =>
      `${ this.getFilterPrefix(facetName, filter) }:${ mapFilterValue(filter) }`);
  }

  private composeFiltersWithOr(facetName: string, filters: Filter[]): string[] {
    const prefix = this.getFilterPrefix(facetName, filters[0]);
    const filterValues = filters.map(this.getMappingFilterValueFn(filters[0].modelName)).join(' OR ');
    return [`${ prefix }:(${ filterValues })`];
  }

  private getFacetConfig(facetName: string): FacetConfig {
    const facetsConfig = this.config.mappings.facets;
    return facetsConfig.named[facetName] || facetsConfig.default;
  }

  private getFacetNamePrefix(facetName: string, context: FilterValueMapperParams): string {
    const { prefix } = this.getFacetConfig(facetName);
    return prefix.facetName instanceof Function
      ? prefix.facetName(context)
      : prefix.facetName;
  }

  private getFilterDeepness(filter: Filter, deepness: number = 0): number {
    return filter.parent ? this.getFilterDeepness(filter.parent, deepness + 1) : deepness;
  }

  private getFilterPrefix(facetName: string, filter: Filter): string {
    const { showUnselectedValues } = this.getFacetConfig(facetName);
    const filterDeepness = this.getFilterDeepness(filter);
    const context: FilterValueMapperParams = { config: this.config, filter, filterDeepness, facetName };
    const noTagPrefix = showUnselectedValues ? this.getNoTagPrefix(facetName, context) : '';
    const facetNamePrefix = this.getFacetNamePrefix(facetName, context);
    return `${ noTagPrefix }${ facetNamePrefix }`;
  }

  private getMappingFilterValueFn(model: string): (filter: Filter) => string {
    switch (model) {
      case FilterModel.currencyRange:
      case FilterModel.range:
        return this.mapRangeValue;
      case FilterModel.simple:
      default:
        return this.mapSimpleValue;
    }
  }

  private getNoTagPrefix(facetName: string, context: FilterValueMapperParams): string {
    const { prefix } = this.getFacetConfig(facetName);
    const noTag = prefix.noTagFacetName instanceof Function
      ? prefix.noTagFacetName(context)
      : prefix.noTagFacetName;
    return `{!tag=${ noTag }}`;
  }

  private mapRangeValue({ value }: RangeFilter): string {
    return `[${ value.min || '*' } TO ${ value.max || '*' }]`;
  }

  private mapSimpleValue({ value }: SimpleFilter): string {
    return value.filter;
  }

  private needsCompositionWithOrOnFrontend(facetName: string, filters: Filter[]): boolean {
    const { multiSelectable } = this.getFacetConfig(facetName);
    return multiSelectable === MultiSelect.OnFrontend && filters.length > 1;
  }
}
