import {
  BooleanFilter,
  EditableNumberRangeFilter,
  Filter,
  isBooleanFilter,
  isRawFilter,
  RawFilter,
  isEditableNumberRangeFilter
} from '@empathyco/x-types';
import { inject, injectable } from 'inversify';
import { EmpathyAdapterConfig } from '../../../config/empathy-adapter-config.types';
import { DEPENDENCIES } from '../../../container/container.const';
import { Mapper } from '../../../empathy-adapter.types';
import { Logger } from '../../../logger';

// TODO When the backend updates their services to be agnostic of the solr db syntax, we can remove this class
/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
@injectable()
export class EmpathyRequestFiltersSolrSyntaxMapper implements Mapper<Filter[], string[]> {
  constructor(@inject(DEPENDENCIES.config) private readonly config: EmpathyAdapterConfig) {}

  private readonly logger = Logger.child('EmpathyRequestFiltersSolrSyntaxMapper');

  map(filters: Filter[], filterValues: string[]): string[] {
    filterValues.push(...this.composeFilters(filters));
    return filterValues;
  }

  private composeFilters(filters: Filter[]): string[] {
    return this.isArrayOfEditableNumberRangeFilters(filters)
      ? this.mapEditableNumberRangeFiltersList(filters)
      : filters.map((filter) => filter.id.toString());
  }

  private mapEditableNumberRangeFiltersList(filters: EditableNumberRangeFilter[]): string[] {
    const facetId = filters[0].facetId;
    const facetsConfig = this.config.mappings.facets;
    const { template } = facetsConfig.named[facetId] || facetsConfig.default;
    if (template) {
      return filters.map(filter => this.mapEditableNumberRangeFilter(template, filter));
    }
    this.logger.warn(`The facet with facetId ${ facetId } doesn't have a template configured.`);
    return [];
  }

  private mapEditableNumberRangeFilter(template: string, { range: { min, max } }: EditableNumberRangeFilter): string {
    function parseNullValues(value: number | null) {
      return value === null ? '*' : String(value);
    }

    return template
      .replace(/<min>/g, parseNullValues(min))
      .replace(/<max>/g, parseNullValues(max));
  }

  /**
   * Check if the filters passed are of type {@link @empathyco/x-types#EditableNumberRangeFilter | EditableNumberRangeFilter}.
   *
   * @param filters - The array of filters to check.
   *
   * @internal
   */
  private isArrayOfEditableNumberRangeFilters(filters: Filter[]): filters is EditableNumberRangeFilter[] {
    return isEditableNumberRangeFilter(filters[0]);
  }
}
