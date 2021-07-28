import { Filter } from '@empathyco/x-types-old';
import { injectable, multiInject } from 'inversify';
import { Dictionary } from '../../../../types';
import { DEPENDENCIES } from '../../../container/container.const';
import { Mapper, MapRequest, RequestMapper, RequestMapperContext } from '../../../empathy-adapter.types';
import { pipeMappers } from '../../pipe-mappers';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
@injectable()
export class EmpathyRequestFiltersMapper implements Mapper<Dictionary<Filter[]>, string[]> {
  private mapFiltersValue: MapRequest<Filter[], string[]>;

  constructor(
    @multiInject(DEPENDENCIES.RequestMappers.Parameters.filtersValue) filtersValueMappers: RequestMapper<Filter[], string[]>[]
  ) {
    this.mapFiltersValue = pipeMappers(...filtersValueMappers);
  }

  map(selectedFilters: Dictionary<Filter[]>, filtersValue: string[], context: RequestMapperContext): string[] {
    return Object.values(selectedFilters).reduce((mappedFilters, filters) => {
      if (filters.length) {
        mappedFilters.push(...this.mapFiltersValue(filters, [], context));
      }
      return mappedFilters;
    }, filtersValue);
  }
}
