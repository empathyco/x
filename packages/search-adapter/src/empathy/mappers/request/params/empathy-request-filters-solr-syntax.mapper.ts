import { Filter, MultiSelect, NumberRangeFilter, RangeValue } from '@empathy/search-types';
import { inject, injectable } from 'inversify';
import { EmpathyAdapterConfig, FacetConfig, FilterValueMapperParams } from '../../../config/empathy-adapter-config.types';
import { DEPENDENCIES } from '../../../container/container.const';
import { Mapper } from '../../../empathy-adapter.types';

// TODO When the backend updates their services to be agnostic of the solr db syntax, we can remove this class
/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
@injectable()
export class EmpathyRequestFiltersSolrSyntaxMapper implements Mapper<Filter[], string[]> {
  constructor(@inject(DEPENDENCIES.config) private readonly config: EmpathyAdapterConfig) {}

  map(filters: Filter[], filterValues: string[]): string[] {
    const facetId = filters[0].facetId;
    const mappedFilterValues = this.needsCompositionWithOrOnFrontend(facetId, filters)
      ? this.composeFiltersWithOr(facetId, filters)
      : this.composeFilters(facetId, filters);
    filterValues.push(...mappedFilterValues);
    return filterValues;
  }

  private composeFilters(facetId: string, filters: Filter[]): string[] {
    return this.isNumberRangeFilters(filters)
      ? filters.map(filter => `${ this.getFilterPrefix(facetId, filter) }:${ this.mapRangeValue(filter.value) }`)
      : filters.map(filter => `${ this.getFilterPrefix(facetId, filter) }:${ filter.value }`);
  }

  private composeFiltersWithOr(facetId: string, filters: Filter[]): string[] {
    const prefix = this.getFilterPrefix(facetId, filters[0]);
    const filterValues = this.isNumberRangeFilters(filters)
      ? filters.map(filter => this.mapRangeValue(filter.value))
      : filters.map(filter => filter.value);
    return [`${ prefix }:(${ filterValues.join(' OR ') })`];
  }

  private getFacetConfig(facetId: string): FacetConfig {
    const facetsConfig = this.config.mappings.facets;
    return facetsConfig.named[facetId] || facetsConfig.default;
  }

  private getFacetIdPrefix(facetId: string, context: FilterValueMapperParams): string {
    const { prefix } = this.getFacetConfig(facetId);
    return prefix.facetId instanceof Function
      ? prefix.facetId(context)
      : prefix.facetId;
  }

  private getFilterPrefix(facetId: string, filter: Filter): string {
    const { showUnselectedValues } = this.getFacetConfig(facetId);
    const context: FilterValueMapperParams = { config: this.config, filter };
    const noTagPrefix = showUnselectedValues ? this.getNoTagPrefix(facetId, context) : '';
    const facetIdPrefix = this.getFacetIdPrefix(facetId, context);
    return `${ noTagPrefix }${ facetIdPrefix }`;
  }

  private isNumberRangeFilters(filters: Filter[]): filters is NumberRangeFilter[] {
    return filters[0].modelName === 'NumberRangeFilter';
  }

  private mapRangeValue({ min, max }: RangeValue): string {
    return `[${ min || '*' } TO ${ max || '*' }]`;
  }

  private getNoTagPrefix(facetId: string, context: FilterValueMapperParams): string {
    const { prefix } = this.getFacetConfig(facetId);
    const noTag = prefix.noTagFacetId instanceof Function
      ? prefix.noTagFacetId(context)
      : prefix.noTagFacetId;
    return `{!tag=${ noTag }}`;
  }

  private needsCompositionWithOrOnFrontend(facetId: string, filters: Filter[]): boolean {
    const { multiSelectable } = this.getFacetConfig(facetId);
    return multiSelectable === MultiSelect.OnFrontend && filters.length > 1;
  }
}
