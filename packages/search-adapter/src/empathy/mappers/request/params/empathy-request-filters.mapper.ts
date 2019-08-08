import { Filter } from '@empathy/search-types';
import { injectable, multiInject } from 'inversify';
import { Dictionary } from '../../../../utils/utils.types';
import { DEPENDENCIES } from '../../../container/container.const';
import { Mapper, MapRequest, RequestMapper, RequestMapperContext } from '../../../empathy-adapter.types';
import { pipeMappers } from '../../pipe-mappers';

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
